/* 打卡进度存储：默认 0 配置、0 费用 —— 存在浏览器 localStorage。
   只有当你主动在 .env / 部署平台里配了 VITE_SUPABASE_URL 和
   VITE_SUPABASE_ANON_KEY 时，才会同步到 Supabase 免费版（500MB）。
   这样没配 Supabase 也能完整用，配了则可以多设备同步。 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const hasSupabase = Boolean(url && anonKey);
let supabase: SupabaseClient | null = null;
if (hasSupabase) supabase = createClient(url!, anonKey!);

/* --- 本地存储（默认） --- */
const localKey = (userName: string) => `pypocket-progress-${userName}`;

function localCompleted(userName: string): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(localKey(userName)) || '{}');
  } catch {
    return {};
  }
}

/** 打卡保存进度 */
export async function saveProgress(userName: string, lessonId: string, code: string) {
  const all = localCompleted(userName);
  all[lessonId] = code;
  localStorage.setItem(localKey(userName), JSON.stringify(all));
  if (supabase) {
    // Supabase 表结构见 README / 文档：user_progress(user_name, lesson_id, submitted_code)
    // 失败不阻塞本地打卡（比如还没建表时）
    try {
      await supabase
        .from('user_progress')
        .upsert({ user_name: userName, lesson_id: lessonId, submitted_code: code }, { onConflict: 'user_name,lesson_id' });
    } catch {
      /* 忽略云端同步失败，本地已保存 */
    }
  }
  return { ok: true };
}

/** 获取已通关列表：返回 [{ lesson_id, submitted_code }]，与文档原接口保持一致 */
export async function getCompletedLessons(userName: string): Promise<{ lesson_id: string; submitted_code: string }[]> {
  const local = Object.entries(localCompleted(userName)).map(([lesson_id, submitted_code]) => ({ lesson_id, submitted_code }));
  if (supabase) {
    try {
      const { data } = await supabase.from('user_progress').select('lesson_id, submitted_code').eq('user_name', userName);
      if (data && data.length) {
        // 云端为准，同时回写本地，方便离线查看
        const merged: Record<string, string> = {};
        data.forEach((d: any) => (merged[d.lesson_id] = d.submitted_code));
        localStorage.setItem(localKey(userName), JSON.stringify(merged));
        return data as any;
      }
    } catch {
      /* 回落到本地 */
    }
  }
  return local;
}
