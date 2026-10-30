import { useState } from 'react';
import { X } from 'lucide-react';
import { AI_PRESETS, getAiSettings } from '../services/ai';
import { hasSupabase } from '../services/supabase';
import { APP_VERSION, APP_BUILD_DATE } from '../version';
import { COURSES } from '../data/courses';

interface Props {
  open: boolean;
  userName: string;
  onUserName: (v: string) => void;
  onClose: () => void;
}

export default function SettingsModal({ open, userName, onUserName, onClose }: Props) {
  const initial = getAiSettings();
  const [presetId, setPresetId] = useState(initial.presetId);
  const [apiKey, setApiKey] = useState(initial.apiKey);
  const [apiUrl, setApiUrl] = useState(initial.apiUrl);
  const [model, setModel] = useState(initial.model);

  if (!open) return null;
  const preset = AI_PRESETS.find((p) => p.id === presetId)!;

  function applyPreset(id: string) {
    setPresetId(id);
    const p = AI_PRESETS.find((x) => x.id === id)!;
    if (id !== 'custom') {
      setApiUrl(p.apiUrl);
      setModel(p.model);
    }
  }

  function save() {
    localStorage.setItem('AI_PRESET', presetId);
    localStorage.setItem('AI_API_KEY', apiKey.trim());
    localStorage.setItem('AI_API_URL', apiUrl.trim());
    localStorage.setItem('AI_MODEL', model.trim());
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-slate-900 w-full max-w-lg rounded-t-2xl sm:rounded-2xl border border-slate-700 p-5 max-h-[85vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">⚙️ 设置</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800"><X className="w-5 h-5" /></button>
        </div>

        <label className="block text-sm font-medium mt-4 mb-1">你的名字（用于区分打卡进度）</label>
        <input value={userName} onChange={(e) => onUserName(e.target.value)} placeholder="比如：master 或 rookie" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />

        <h4 className="font-medium mt-5 mb-2 text-sm">AI 助教（免费 Key，自己领）</h4>
        <div className="flex flex-wrap gap-2">
          {AI_PRESETS.map((p) => (
            <button key={p.id} onClick={() => applyPreset(p.id)} className={`text-xs px-3 py-1.5 rounded-full border ${presetId === p.id ? 'border-violet-400 bg-violet-500/20 text-violet-200' : 'border-slate-700 text-slate-300'}`}>{p.label}</button>
          ))}
        </div>
        {preset.keyUrl && (
          <p className="text-xs text-slate-400 mt-2">免费领 Key：<a className="text-violet-300 underline" href={preset.keyUrl} target="_blank" rel="noreferrer">{preset.keyUrl}</a>（新页面打开，Key 不要发给任何人）</p>
        )}
        <label className="block text-xs text-slate-400 mt-3 mb-1">API Key（只存在你的浏览器 localStorage，不上传到本站服务器——本站本来就没有服务器）</label>
        <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-…" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400" />
        <div className="grid grid-cols-1 gap-2 mt-2">
          <input value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} placeholder="接口地址" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none" />
          <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="模型名" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none" />
        </div>

        <h4 className="font-medium mt-5 mb-1 text-sm">进度同步</h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          当前：{hasSupabase ? '已接 Supabase 云端同步（免费版）' : '本地浏览器保存（0 配置、0 费用）。想多设备同步时，再按 README 配 Supabase，不配也能完整使用。'}
        </p>

        <h4 className="font-medium mt-5 mb-1 text-sm">版本</h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          当前版本：v{APP_VERSION} · 更新于 {APP_BUILD_DATE} · 共 {COURSES.length} 关
          <br />对照最新发布时的版本号和日期，就能看出手上这个是不是最新版。
        </p>

        <button onClick={save} className="mt-5 w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm">保存设置</button>
      </div>
    </div>
  );
}
