/* 错题本：全部存在浏览器 localStorage，0 服务器、0 费用。
   规则：
   - 只有“提交判题失败”才进错题本，单纯点“运行”报错不算，避免把试错都记成错题。
   - 同一关多次失败只保留一条，失败次数 +1，并更新为最新一次的代码和报错。
   - 通关该关后自动标记为“已攻克”，但记录保留，方便回看；也可以手动标记或删除。
   - 复习排序：待复习的排前面，失败次数多的、离上次失败越久的越靠前。 */

export interface WrongItem {
  lessonId: string;
  code: string;
  error: string;
  attempts: number;
  firstFailedAt: number; // 时间戳
  lastFailedAt: number;
  status: 'pending' | 'mastered';
}

export type WrongBook = Record<string, WrongItem>;

const keyFor = (userName: string) => `pypocket-wrongbook-${userName}`;

export function loadWrongBook(userName: string): WrongBook {
  try {
    const raw = JSON.parse(localStorage.getItem(keyFor(userName)) || '{}') as WrongBook;
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

function saveWrongBook(userName: string, book: WrongBook) {
  localStorage.setItem(keyFor(userName), JSON.stringify(book));
}

export function recordFailure(userName: string, lessonId: string, code: string, error: string): WrongBook {
  const book = loadWrongBook(userName);
  const now = Date.now();
  const prev = book[lessonId];
  book[lessonId] = {
    lessonId,
    code,
    error,
    attempts: (prev?.attempts || 0) + 1,
    firstFailedAt: prev?.firstFailedAt || now,
    lastFailedAt: now,
    // 如果之前已攻克又再次失败，重新回到待复习
    status: 'pending',
  };
  saveWrongBook(userName, book);
  return book;
}

export function markMastered(userName: string, lessonId: string): WrongBook {
  const book = loadWrongBook(userName);
  if (book[lessonId]) {
    book[lessonId] = { ...book[lessonId], status: 'mastered' };
    saveWrongBook(userName, book);
  }
  return book;
}

export function deleteWrongItem(userName: string, lessonId: string): WrongBook {
  const book = loadWrongBook(userName);
  delete book[lessonId];
  saveWrongBook(userName, book);
  return book;
}

export function clearMastered(userName: string): WrongBook {
  const book = loadWrongBook(userName);
  for (const id of Object.keys(book)) {
    if (book[id].status === 'mastered') delete book[id];
  }
  saveWrongBook(userName, book);
  return book;
}

/** 复习队列：待复习在前，失败次数多、上次失败久的靠前 */
export function reviewQueue(book: WrongBook): WrongItem[] {
  return Object.values(book)
    .filter((item) => item.status === 'pending')
    .sort((a, b) => b.attempts - a.attempts || a.lastFailedAt - b.lastFailedAt);
}

export function pendingCount(book: WrongBook): number {
  return Object.values(book).filter((item) => item.status === 'pending').length;
}
