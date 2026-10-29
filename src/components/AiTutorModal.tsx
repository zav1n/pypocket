import { useState } from 'react';
import { X, Loader2, Settings } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { askAiTutor, getAiSettings } from '../services/ai';

interface Props {
  open: boolean;
  lessonTitle: string;
  code: string;
  errorMsg: string;
  onClose: () => void;
  onOpenSettings: () => void;
}

export default function AiTutorModal({ open, lessonTitle, code, errorMsg, onClose, onOpenSettings }: Props) {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const hasKey = Boolean(getAiSettings().apiKey);

  if (!open) return null;

  async function ask() {
    setLoading(true);
    setAnswer('');
    setAnswer(await askAiTutor(lessonTitle, code, errorMsg));
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-slate-900 w-full max-w-lg rounded-t-2xl sm:rounded-2xl border border-slate-700 p-5 max-h-[85vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">🤖 AI 助教</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-slate-400 mt-1">关卡：{lessonTitle}</p>
        {!hasKey && (
          <div className="mt-3 text-sm bg-amber-500/10 border border-amber-500/30 text-amber-200 rounded-lg p-3">
            还没填 API Key。去硅基流动或 Gemini 官网免费领一个，Key 只存在你的浏览器里。
            <button onClick={onOpenSettings} className="ml-2 inline-flex items-center gap-1 underline font-medium"><Settings className="w-4 h-4" />去设置</button>
          </div>
        )}
        <button onClick={ask} disabled={loading || !hasKey} className="mt-4 px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-400 disabled:opacity-50 text-sm font-bold flex items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />} {answer ? '再问一次' : '帮我看看错在哪'}
        </button>
        {answer && (
          <div className="mt-4 text-sm leading-relaxed prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
