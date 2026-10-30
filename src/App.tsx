import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Settings, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { COURSES, TRACKS, type Lesson } from './data/courses';
import CodeRunner from './components/CodeRunner';
import CourseMap from './components/CourseMap';
import AiTutorModal from './components/AiTutorModal';
import SettingsModal from './components/SettingsModal';
import { getCompletedLessons, saveProgress } from './services/supabase';
import StatsDashboard from './components/StatsDashboard';
import Playground from './components/Playground';
import WrongBook from './components/WrongBook';
import Stage3Guide from './components/Stage3Guide';
import Roadmap from './components/Roadmap';
import { loadActivity, recordPass, recordCheckin, computeStats, type ActivityMap } from './services/stats';
import { loadWrongBook, recordFailure, markMastered, deleteWrongItem, clearMastered, pendingCount, type WrongBook as WrongBookType } from './services/wrongbook';

export default function App() {
  const [track, setTrack] = useState<Lesson['track']>('rookie');
  const [lesson, setLesson] = useState<Lesson>(COURSES[0]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [userName, setUserName] = useState(() => localStorage.getItem('PYPOCKET_USER') || 'rookie');
  const [editorKey, setEditorKey] = useState(0);
  const [savedCode, setSavedCode] = useState<Record<string, string>>({});
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [view, setView] = useState<'learn' | 'stats' | 'playground' | 'wrongbook' | 'stage3' | 'roadmap'>('learn');
  const [activity, setActivity] = useState<ActivityMap>({});
  const [wrongBook, setWrongBook] = useState<WrongBookType>({});
  const [reviewCode, setReviewCode] = useState<{ lessonId: string; code: string; nonce: number } | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiCtx, setAiCtx] = useState({ code: '', error: '' });

  useEffect(() => { localStorage.setItem('PYPOCKET_USER', userName); }, [userName]);

  useEffect(() => {
    setActivity(loadActivity(userName));
    setWrongBook(loadWrongBook(userName));
    setReviewCode(null);
    getCompletedLessons(userName).then((rows) => {
      const map: Record<string, string> = {};
      rows.forEach((r) => (map[r.lesson_id] = r.submitted_code));
      setSavedCode(map);
      setCompleted(new Set(rows.map((r) => r.lesson_id)));
    });
  }, [userName]);

  const progress = useMemo(() => Math.round((completed.size / COURSES.length) * 100), [completed]);
  const stats = useMemo(() => computeStats(activity, completed), [activity, completed]);
  const idx = COURSES.findIndex((l) => l.id === lesson.id);

  function selectLesson(l: Lesson) {
    setLesson(l);
    setTrack(l.track);
    setReviewCode(null);
    setEditorKey((k) => k + 1);
  }

  function retryWrongItem(lessonId: string, code: string) {
    const target = COURSES.find((l) => l.id === lessonId);
    if (!target) return;
    setLesson(target);
    setTrack(target.track);
    setReviewCode({ lessonId, code, nonce: Date.now() });
    setEditorKey((k) => k + 1);
    setView('learn');
  }

  async function handlePassed(code: string) {
    await saveProgress(userName, lesson.id, code);
    setCompleted((prev) => new Set(prev).add(lesson.id));
    setSavedCode((prev) => ({ ...prev, [lesson.id]: code }));
    // 通关 = 当天自动打卡（重复通关也计一次通关次数，但通关关卡数不重复算）
    setActivity(recordPass(userName, lesson.id));
    // 通关 = 该关在错题本里自动变为已攻克
    setWrongBook(markMastered(userName, lesson.id));
    setReviewCode(null);
  }

  function handleFailed(code: string, errorMsg: string) {
    setWrongBook(recordFailure(userName, lesson.id, code, errorMsg));
  }

  function resetCode() {
    // 恢复到本关初始代码（不是已通关保存的代码）
    setReviewCode(null);
    setSavedCode((prev) => ({ ...prev, [lesson.id]: lesson.starterCode }));
    setEditorKey((k) => k + 1);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <h1 className="font-bold text-lg leading-tight">🐍 PyPocket <span className="text-slate-400 font-normal text-sm hidden sm:inline">Python 随身练</span></h1>
            <p className="text-xs text-slate-400">浏览器里跑 Python · 0 服务器 · 已通关 {completed.size}/{COURSES.length}（{progress}%）</p>
          </div>
          <button onClick={() => setSettingsOpen(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm"><Settings className="w-4 h-4" /> 设置</button>
        </div>
        <div className="max-w-5xl mx-auto px-4 pb-3">
          <div className="h-2 rounded-full bg-slate-800 overflow-hidden"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} /></div>
          <div className="flex flex-wrap gap-2 mt-3">
            <button onClick={() => setView('learn')} className={`text-xs px-3 py-1.5 rounded-full border ${view === 'learn' ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200' : 'border-slate-700 text-slate-300'}`}>📖 学习做题</button>
            <button onClick={() => setView('playground')} className={`text-xs px-3 py-1.5 rounded-full border ${view === 'playground' ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200' : 'border-slate-700 text-slate-300'}`}>🧪 自由练习场</button>
            <button onClick={() => setView('wrongbook')} className={`text-xs px-3 py-1.5 rounded-full border ${view === 'wrongbook' ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200' : 'border-slate-700 text-slate-300'}`}>📕 错题本{pendingCount(wrongBook) > 0 ? ` · ${pendingCount(wrongBook)} 待复习` : ''}</button>
            <button onClick={() => setView('stats')} className={`text-xs px-3 py-1.5 rounded-full border ${view === 'stats' ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200' : 'border-slate-700 text-slate-300'}`}>🔥 打卡统计{stats.streak > 0 ? ` · ${stats.streak} 天连打` : ''}</button>
            <button onClick={() => setView('stage3')} className={`text-xs px-3 py-1.5 rounded-full border ${view === 'stage3' ? 'border-violet-400 bg-violet-500/20 text-violet-200' : 'border-slate-700 text-slate-300'}`}>🚀 第三阶段指南</button>
            <button onClick={() => setView('roadmap')} className={`text-xs px-3 py-1.5 rounded-full border ${view === 'roadmap' ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200' : 'border-slate-700 text-slate-300'}`}>🗺️ 学习路线与方法</button>
          </div>
        </div>
      </header>

      {view === 'stats' ? (
        <main className="max-w-5xl mx-auto px-4 py-4">
          <StatsDashboard activity={activity} completed={completed} stats={stats} onCheckin={() => setActivity(recordCheckin(userName))} />
          <button onClick={() => setView('learn')} className="mt-4 w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm">← 回去继续做题</button>
        </main>
      ) : view === 'playground' ? (
        <main className="max-w-5xl mx-auto px-4 py-4">
          <Playground userName={userName} />
        </main>
      ) : view === 'wrongbook' ? (
        <main className="max-w-5xl mx-auto px-4 py-4">
          <WrongBook
            book={wrongBook}
            onRetry={retryWrongItem}
            onMarkMastered={(id) => setWrongBook(markMastered(userName, id))}
            onDelete={(id) => setWrongBook(deleteWrongItem(userName, id))}
            onClearMastered={() => setWrongBook(clearMastered(userName))}
          />
        </main>
      ) : view === 'stage3' ? (
        <main className="max-w-5xl mx-auto px-4 py-4">
          <Stage3Guide />
          <button onClick={() => setView('learn')} className="mt-4 w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm">← 回去继续做题</button>
        </main>
      ) : view === 'roadmap' ? (
        <main className="max-w-5xl mx-auto px-4 py-4">
          <Roadmap />
          <button onClick={() => setView('learn')} className="mt-4 w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm">← 回去继续做题</button>
        </main>
      ) : (
      <main className="max-w-5xl mx-auto px-4 py-4 grid gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-[220px] self-start">
          <div className="flex flex-wrap gap-2 mb-3">
            {(Object.keys(TRACKS) as Lesson['track'][]).map((t) => (
              <button key={t} onClick={() => setTrack(t)} className={`text-xs px-3 py-1.5 rounded-full border ${track === t ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200' : 'border-slate-700 text-slate-300'}`}>{TRACKS[t].label}</button>
            ))}
          </div>
          <CourseMap track={track} completed={completed} currentId={lesson.id} onSelect={selectLesson} />
        </aside>

        <section className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-bold text-xl leading-snug">{lesson.title}</h2>
            <button onClick={resetCode} title="恢复初始代码" className="shrink-0 p-2 rounded-lg bg-slate-800 hover:bg-slate-700"><RotateCcw className="w-4 h-4" /></button>
          </div>

          <article className="mt-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm leading-relaxed prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.markdown}</ReactMarkdown>
          </article>

          <div className="mt-4">
            <CodeRunner
              key={`${lesson.id}-${editorKey}-${reviewCode?.lessonId === lesson.id ? reviewCode.nonce : 0}`}
              lesson={lesson}
              initialCode={reviewCode?.lessonId === lesson.id ? reviewCode.code : savedCode[lesson.id] || lesson.starterCode}
              onPassed={handlePassed}
              onFailed={handleFailed}
              onAskAi={(code, error) => { setAiCtx({ code, error }); setAiOpen(true); }}
            />
            {reviewCode?.lessonId === lesson.id && (
              <p className="text-xs text-rose-300 mt-2">正在重练错题：编辑器里是上次失败的代码，改对并提交后，这题会自动变成“已攻克”。</p>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <button disabled={idx <= 0} onClick={() => selectLesson(COURSES[idx - 1])} className="flex-1 flex items-center justify-center gap-1 px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-sm"><ChevronLeft className="w-4 h-4" /> 上一关</button>
            <button disabled={idx >= COURSES.length - 1} onClick={() => selectLesson(COURSES[idx + 1])} className="flex-1 flex items-center justify-center gap-1 px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-sm">下一关 <ChevronRight className="w-4 h-4" /></button>
          </div>

          <footer className="text-xs text-slate-500 leading-relaxed mt-6">
            AI 助教和 Supabase 同步是可选项：不填 Key、不配 Supabase，练题和打卡照常用。
            想加新关卡？改 <code>src/data/courses.ts</code> 里加一个对象，重新部署即可。
          </footer>
        </section>
      </main>
      )}

      <SettingsModal open={settingsOpen} userName={userName} onUserName={setUserName} onClose={() => setSettingsOpen(false)} />
      <AiTutorModal
        open={aiOpen}
        lessonTitle={lesson.title}
        code={aiCtx.code}
        errorMsg={aiCtx.error}
        onClose={() => setAiOpen(false)}
        onOpenSettings={() => { setAiOpen(false); setSettingsOpen(true); }}
      />
    </div>
  );
}
