import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { Play, CheckCircle2, Loader2, Bot, Eye, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { executeAndTest, runOnly, initPyodide } from '../services/pyodide';
import type { Lesson } from '../data/courses';

interface Props {
  lesson: Lesson;
  initialCode: string;
  onPassed: (code: string) => void;
  onFailed?: (code: string, errorMsg: string) => void;
  onAskAi: (code: string, errorMsg: string) => void;
}

export default function CodeRunner({ lesson, initialCode, onPassed, onFailed, onAskAi }: Props) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading-py' | 'running' | 'passed' | 'failed'>('idle');
  const [pyReady, setPyReady] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopyAnswer() {
    try {
      await navigator.clipboard.writeText(lesson.solution);
    } catch {
      // 剪贴板不可用时（比如非 HTTPS 环境），用户仍可手动选中答案复制
      const ta = document.createElement('textarea');
      ta.value = lesson.solution;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function ensurePy() {
    if (pyReady) return;
    setStatus('loading-py');
    setOutput('正在准备 Python 运行时，第一次会慢一点（约 10MB，之后缓存）…');
    try {
      await initPyodide();
      setPyReady(true);
    } catch (e: any) {
      setStatus('failed');
      setError(e?.message || String(e));
      throw e;
    }
  }

  async function handleRun() {
    try {
      await ensurePy();
      setStatus('running');
      setError('');
      const res = await runOnly(code);
      setOutput(res.output);
      if (!res.success) {
        setError(res.error || '');
        setStatus('failed');
      } else setStatus('idle');
    } catch { /* ensurePy 已报错 */ }
  }

  async function handleSubmit() {
    try {
      await ensurePy();
      setStatus('running');
      setError('');
      const res = await executeAndTest(code, lesson.testCode);
      setOutput(res.output);
      if (res.passed) {
        setStatus('passed');
        confetti({ particleCount: 120, spread: 75, origin: { y: 0.7 } });
        onPassed(code);
      } else {
        const msg = res.error || '未通过测试，再看看输出和提示。';
        setError(msg);
        setStatus('failed');
        onFailed?.(code, msg);
      }
    } catch { /* ensurePy 已报错 */ }
  }

  const busy = status === 'loading-py' || status === 'running';
  // 逻辑实战和项目关代码更长，编辑器给高一点，不然 80 行写起来很难受
  const editorHeight = lesson.track === 'logic' || lesson.track === 'textbook' ? '420px' : lesson.track === 'project' ? '340px' : '260px';

  return (
    <div>
      <div className="rounded-xl overflow-hidden border border-slate-700">
        <CodeMirror
          value={code}
          height={editorHeight}
          extensions={[python()]}
          theme="dark"
          onChange={(v) => setCode(v)}
          basicSetup={{ lineNumbers: true, foldGutter: false }}
        />
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <button onClick={handleRun} disabled={busy} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-sm font-medium">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} 运行
        </button>
        <button onClick={handleSubmit} disabled={busy} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:opacity-50 text-sm font-bold">
          <CheckCircle2 className="w-4 h-4" /> 提交判题
        </button>
        {status === 'failed' && (
          <button onClick={() => onAskAi(code, error || '未通过测试')} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-400 text-sm font-medium">
            <Bot className="w-4 h-4" /> 问 AI 助教
          </button>
        )}
        <button onClick={() => setShowAnswer((v) => !v)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-200 text-sm font-medium">
          <Eye className="w-4 h-4" /> {showAnswer ? '收起答案' : '查看答案'}
        </button>
      </div>

      {showAnswer && (
        <div className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3">
          <p className="text-sm text-amber-200 font-medium">参考答案（建议：先看懂思路，关掉后自己重写一遍再提交，效果最好；直接载入提交也能通关，但等于跳过了思考）</p>
          <pre className="mt-2 text-sm text-slate-100 bg-black/50 rounded-lg p-3 overflow-auto whitespace-pre-wrap font-mono">{lesson.solution}</pre>
          <div className="flex flex-wrap gap-2 mt-3">
            <button onClick={handleCopyAnswer} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />} {copied ? '已复制' : '复制答案'}
            </button>
            <button onClick={() => { setCode(lesson.solution); setShowAnswer(false); }} className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold">载入到编辑器</button>
            <button onClick={() => setShowAnswer(false)} className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm">我先自己再想想</button>
          </div>
        </div>
      )}

      <div className="mt-3 rounded-xl bg-black/50 border border-slate-800 p-3 min-h-[96px] text-sm whitespace-pre-wrap font-mono">
        {status === 'passed' ? (
          <p className="text-emerald-400 font-sans font-bold">🎉 通关！{output ? `\n${output}` : ''}</p>
        ) : (
          <>
            {output && <p className="text-slate-200">{output}</p>}
            {error && <p className="text-rose-400 mt-2">{error}</p>}
            {!output && !error && <p className="text-slate-500 font-sans">运行结果会显示在这里。第一次运行需要先下载 Python，别急。</p>}
          </>
        )}
      </div>
      <p className="text-xs text-slate-500 mt-2">Python 在你的浏览器本地运行，代码不会上传到服务器。判题失败时点「问 AI 助教」才会把当前代码和报错发给你自己配置的 AI 服务商。</p>
    </div>
  );
}
