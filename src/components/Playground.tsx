import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { Play, Save, Trash2, Loader2, FlaskConical } from 'lucide-react';
import { runOnly, initPyodide } from '../services/pyodide';
import { loadSnippets, saveSnippet, deleteSnippet, loadDraft, saveDraft, PLAYGROUND_SAMPLES, type Snippet } from '../services/snippets';

interface Props {
  userName: string;
}

const DEFAULT_CODE = `# 自由练习场：这里没有判题，写什么都能跑
# 改一改，点运行，看看会发生什么
name = "小白"
for i in range(1, 4):
    print(f"第 {i} 次：你好，{name}")
`;

export default function Playground({ userName }: Props) {
  const [code, setCode] = useState(() => loadDraft(userName) || DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);
  const [pyReady, setPyReady] = useState(false);
  const [title, setTitle] = useState('');
  const [snippets, setSnippets] = useState<Snippet[]>(() => loadSnippets(userName));
  const [savedMsg, setSavedMsg] = useState('');

  function handleChange(v: string) {
    setCode(v);
    saveDraft(userName, v);
  }

  async function handleRun() {
    setRunning(true);
    setError('');
    try {
      if (!pyReady) {
        setOutput('正在准备 Python 运行时，第一次会慢一点（约 10MB，之后缓存）…');
        await initPyodide();
        setPyReady(true);
      }
      const res = await runOnly(code);
      setOutput(res.output);
      if (!res.success) {
        setError(res.error || '');
      }
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setRunning(false);
    }
  }

  function handleSave() {
    setSnippets(saveSnippet(userName, title, code));
    setSavedMsg('已保存到我的片段');
    setTitle('');
    setTimeout(() => setSavedMsg(''), 2000);
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="font-bold text-lg flex items-center gap-2"><FlaskConical className="w-5 h-5 text-sky-400" /> 自由练习场</h2>
        <p className="text-sm text-slate-400 mt-1">没有关卡、没有判题、没有对错。在这里随便试，跑错了也是学习。代码会自动保存为草稿，刷新不丢。</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs text-slate-500 self-center">试试示例：</span>
          {PLAYGROUND_SAMPLES.map((s) => (
            <button key={s.title} onClick={() => handleChange(s.code)} className="text-xs px-3 py-1.5 rounded-full border border-slate-700 hover:border-sky-400 text-slate-300">{s.title}</button>
          ))}
        </div>
      </section>

      <div className="rounded-xl overflow-hidden border border-slate-700">
        <CodeMirror value={code} height="280px" extensions={[python()]} theme="dark" onChange={handleChange} basicSetup={{ lineNumbers: true, foldGutter: false }} />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={handleRun} disabled={running} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:opacity-50 text-sm font-bold">
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} 运行
        </button>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="给这段代码起个名字（可选）" className="flex-1 min-w-[180px] bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
        <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm font-medium"><Save className="w-4 h-4" /> 保存片段</button>
        {savedMsg && <span className="text-sm text-emerald-400">{savedMsg}</span>}
      </div>

      <div className="rounded-xl bg-black/50 border border-slate-800 p-3 min-h-[96px] text-sm whitespace-pre-wrap font-mono">
        {output && <p className="text-slate-200">{output}</p>}
        {error && <p className="text-rose-400 mt-2">{error}</p>}
        {!output && !error && <p className="text-slate-500 font-sans">运行结果会显示在这里。</p>}
      </div>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="font-bold">我的片段（{snippets.length}）</h3>
        {snippets.length === 0 ? (
          <p className="text-sm text-slate-400 mt-2">还没保存过片段。写一段觉得有用的代码，起个名字点“保存片段”，以后随时能找回来接着改。</p>
        ) : (
          <div className="grid gap-2 mt-3">
            {snippets.map((s) => (
              <div key={s.id} className="rounded-lg border border-slate-800 p-3 flex gap-3 items-start">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{s.title}</p>
                  <p className="text-xs text-slate-500">{new Date(s.updatedAt).toLocaleString('zh-CN')}</p>
                  <pre className="text-xs text-slate-300 bg-black/40 rounded p-2 mt-2 overflow-auto max-h-28 whitespace-pre-wrap">{s.code}</pre>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => handleChange(s.code)} className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600">载入编辑</button>
                  <button onClick={() => setSnippets(deleteSnippet(userName, s.id))} className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 flex items-center gap-1 justify-center"><Trash2 className="w-3 h-3" /> 删除</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
