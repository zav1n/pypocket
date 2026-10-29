/* 自由练习场的代码片段：存在浏览器 localStorage，0 服务器。
   草稿（当前正在写的代码）单独存，刷新不丢；片段是用户主动保存的。 */

export interface Snippet {
  id: string;
  title: string;
  code: string;
  updatedAt: number;
}

const snippetsKey = (userName: string) => `pypocket-snippets-${userName}`;
const draftKey = (userName: string) => `pypocket-playground-draft-${userName}`;

export function loadSnippets(userName: string): Snippet[] {
  try {
    const raw = JSON.parse(localStorage.getItem(snippetsKey(userName)) || '[]') as Snippet[];
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function saveSnippet(userName: string, title: string, code: string): Snippet[] {
  const list = loadSnippets(userName);
  const snippet: Snippet = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: title.trim() || '未命名片段',
    code,
    updatedAt: Date.now(),
  };
  const next = [snippet, ...list];
  localStorage.setItem(snippetsKey(userName), JSON.stringify(next));
  return next;
}

export function deleteSnippet(userName: string, id: string): Snippet[] {
  const next = loadSnippets(userName).filter((s) => s.id !== id);
  localStorage.setItem(snippetsKey(userName), JSON.stringify(next));
  return next;
}

export function loadDraft(userName: string): string {
  return localStorage.getItem(draftKey(userName)) || '';
}

export function saveDraft(userName: string, code: string) {
  localStorage.setItem(draftKey(userName), code);
}

export const PLAYGROUND_SAMPLES: { title: string; code: string }[] = [
  {
    title: '打招呼',
    code: 'name = "小白"\nprint(f"你好，{name}，欢迎来到自由练习场！")',
  },
  {
    title: '猜数字思路（先看懂循环）',
    code: 'for i in range(1, 6):\n    print(f"第 {i} 次：", i * i)',
  },
  {
    title: '统计一句话里的词',
    code: 'text = "python python java python"\nwords = text.split()\nprint("python 出现了", words.count("python"), "次")',
  },
];
