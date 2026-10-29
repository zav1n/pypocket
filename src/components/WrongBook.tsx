import { useState } from 'react';
import { BookOpen, CheckCircle2, Trash2, RotateCcw } from 'lucide-react';
import { reviewQueue, type WrongBook as WrongBookType } from '../services/wrongbook';
import { COURSES } from '../data/courses';

interface Props {
  book: WrongBookType;
  onRetry: (lessonId: string, code: string) => void;
  onMarkMastered: (lessonId: string) => void;
  onDelete: (lessonId: string) => void;
  onClearMastered: () => void;
}

export default function WrongBook({ book, onRetry, onMarkMastered, onDelete, onClearMastered }: Props) {
  const [filter, setFilter] = useState<'pending' | 'mastered' | 'all'>('pending');
  const queue = reviewQueue(book);
  const all = Object.values(book);
  const pending = all.filter((i) => i.status === 'pending');
  const mastered = all.filter((i) => i.status === 'mastered');
  const shown = filter === 'pending' ? queue : filter === 'mastered' ? mastered : [...queue, ...mastered];

  function lessonTitle(id: string) {
    return COURSES.find((l) => l.id === id)?.title || id;
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="font-bold text-lg flex items-center gap-2"><BookOpen className="w-5 h-5 text-rose-400" /> 错题本</h2>
        <p className="text-sm text-slate-400 mt-1">
          只有“提交判题失败”才会自动记进来，单纯点运行报错不算。同一关多次失败只记一条，失败次数会累加。
          通关后自动变成“已攻克”。复习顺序是：失败次数多、上次失败久的排前面。
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {([
            { id: 'pending', label: `待复习（${pending.length}）` },
            { id: 'mastered', label: `已攻克（${mastered.length}）` },
            { id: 'all', label: `全部（${all.length}）` },
          ] as const).map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={`text-xs px-3 py-1.5 rounded-full border ${filter === f.id ? 'border-rose-400 bg-rose-500/20 text-rose-200' : 'border-slate-700 text-slate-300'}`}>{f.label}</button>
          ))}
          {mastered.length > 0 && (
            <button onClick={onClearMastered} className="text-xs px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:text-rose-300">清空已攻克</button>
          )}
        </div>
      </section>

      {shown.length === 0 ? (
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center">
          <p className="text-2xl">🎉</p>
          <p className="font-medium mt-2">{filter === 'pending' ? '目前没有待复习的错题' : '这里还没有错题记录'}</p>
          <p className="text-sm text-slate-400 mt-1">去做题吧，第一次提交失败就会自动记进来，不用你手动整理。</p>
        </section>
      ) : (
        <div className="grid gap-3">
          {shown.map((item) => (
            <article key={item.lessonId} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex flex-wrap gap-2 items-start justify-between">
                <div>
                  <h3 className="font-medium">{lessonTitle(item.lessonId)}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    失败 {item.attempts} 次 · 上次失败 {new Date(item.lastFailedAt).toLocaleString('zh-CN')} · {item.status === 'pending' ? '待复习' : '已攻克'}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'pending' ? 'bg-rose-500/20 text-rose-200' : 'bg-emerald-500/20 text-emerald-200'}`}>
                  {item.status === 'pending' ? '待复习' : '已攻克'}
                </span>
              </div>
              <p className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2 mt-3 whitespace-pre-wrap font-mono text-xs">{item.error}</p>
              <details className="mt-2">
                <summary className="text-xs text-slate-400 cursor-pointer">查看上次失败的代码</summary>
                <pre className="text-xs text-slate-300 bg-black/40 rounded p-2 mt-2 overflow-auto max-h-40 whitespace-pre-wrap">{item.code}</pre>
              </details>
              <div className="flex flex-wrap gap-2 mt-3">
                <button onClick={() => onRetry(item.lessonId, item.code)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold"><RotateCcw className="w-4 h-4" /> 去重练（载入上次代码）</button>
                {item.status === 'pending' && (
                  <button onClick={() => onMarkMastered(item.lessonId)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"><CheckCircle2 className="w-4 h-4" /> 手动标记已攻克</button>
                )}
                <button onClick={() => onDelete(item.lessonId)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-sm"><Trash2 className="w-4 h-4" /> 删除</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
