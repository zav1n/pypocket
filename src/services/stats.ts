/* 打卡 / 学习统计 / 成就：全部存在浏览器 localStorage，0 服务器、0 费用。
   规则（简单、可解释，小白一看就懂）：
   - 通关一关 = 当天自动打卡一次；没通关也可以在统计页点“今日打卡”手动打卡。
   - 连续打卡：从今天（或昨天，如果今天还没打卡）往前数，连续有打卡的天数。
   - 历史通关没有日期，所以升级前已通关的关卡只计入通关数，不补算打卡天数。
   - 换名字（设置里的用户名）会换一套独立的打卡记录，和进度存储的规则一致。 */

import { COURSES } from '../data/courses';

export interface DayActivity {
  date: string; // 本地日期 YYYY-MM-DD
  passes: number;
  lessons: string[];
  checkin: boolean;
}

export type ActivityMap = Record<string, DayActivity>;

const keyFor = (userName: string) => `pypocket-activity-${userName}`;

export function todayString(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(dateStr: string, delta: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d + delta);
  return todayString(dt);
}

export function loadActivity(userName: string): ActivityMap {
  try {
    const raw = JSON.parse(localStorage.getItem(keyFor(userName)) || '{}') as ActivityMap;
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

function saveActivity(userName: string, map: ActivityMap) {
  localStorage.setItem(keyFor(userName), JSON.stringify(map));
}

export function recordPass(userName: string, lessonId: string, date = todayString()): ActivityMap {
  const map = loadActivity(userName);
  const day = map[date] || { date, passes: 0, lessons: [], checkin: false };
  day.passes += 1;
  if (!day.lessons.includes(lessonId)) day.lessons.push(lessonId);
  day.checkin = true;
  map[date] = day;
  saveActivity(userName, map);
  return map;
}

export function recordCheckin(userName: string, date = todayString()): ActivityMap {
  const map = loadActivity(userName);
  const day = map[date] || { date, passes: 0, lessons: [], checkin: false };
  day.checkin = true;
  map[date] = day;
  saveActivity(userName, map);
  return map;
}

function isActive(day: DayActivity | undefined): boolean {
  return Boolean(day && (day.checkin || day.passes > 0));
}

export interface Stats {
  totalDays: number;
  totalPasses: number;
  streak: number;
  longestStreak: number;
  weekActiveDays: number;
  weekPasses: number;
  last7: { date: string; label: string; passes: number; active: boolean }[];
  checkedInToday: boolean;
  trackCompleted: Record<string, number>;
  distinctTracks: number;
  maxWeekActiveDays: number;
}

function mondayOf(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const weekday = dt.getDay(); // 0=周日
  const deltaToMonday = weekday === 0 ? -6 : 1 - weekday;
  return addDays(dateStr, deltaToMonday);
}

export function computeStats(activity: ActivityMap, completedIds: Set<string>): Stats {
  const today = todayString();
  const dates = Object.keys(activity).sort();
  const totalDays = dates.filter((d) => isActive(activity[d])).length;
  const totalPasses = dates.reduce((sum, d) => sum + (activity[d]?.passes || 0), 0);

  // 当前连续打卡：今天没打卡时从昨天开始算，避免刚起床就显示断了
  let streak = 0;
  let cursor = isActive(activity[today]) ? today : addDays(today, -1);
  while (isActive(activity[cursor])) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  // 最长连续打卡
  let longestStreak = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of dates) {
    if (!isActive(activity[d])) {
      run = 0;
      prev = null;
      continue;
    }
    run = prev === addDays(d, -1) ? run + 1 : 1;
    longestStreak = Math.max(longestStreak, run);
    prev = d;
  }

  // 本周（周一起算）
  const monday = mondayOf(today);
  let weekActiveDays = 0;
  let weekPasses = 0;
  for (let i = 0; i < 7; i++) {
    const d = addDays(monday, i);
    if (d > today) break;
    if (isActive(activity[d])) weekActiveDays += 1;
    weekPasses += activity[d]?.passes || 0;
  }

  // 任意一周的最大打卡天数（用于“单周 5 天”成就）
  const weekCounts = new Map<string, number>();
  for (const d of dates) {
    if (!isActive(activity[d])) continue;
    const mon = mondayOf(d);
    weekCounts.set(mon, (weekCounts.get(mon) || 0) + 1);
  }
  const maxWeekActiveDays = Math.max(0, ...weekCounts.values());

  // 近 7 天（含今天）
  const weekdayLabels = ['日', '一', '二', '三', '四', '五', '六'];
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(today, -i);
    const [y, m, day] = d.split('-').map(Number);
    const dt = new Date(y, m - 1, day);
    last7.push({
      date: d,
      label: `${m}/${day} 周${weekdayLabels[dt.getDay()]}`,
      passes: activity[d]?.passes || 0,
      active: isActive(activity[d]),
    });
  }

  // 各路线通关数
  const trackCompleted: Record<string, number> = {};
  const trackSet = new Set<string>();
  for (const id of completedIds) {
    const lesson = COURSES.find((l) => l.id === id);
    if (!lesson) continue;
    trackCompleted[lesson.track] = (trackCompleted[lesson.track] || 0) + 1;
    trackSet.add(lesson.track);
  }

  return {
    totalDays,
    totalPasses,
    streak,
    longestStreak,
    weekActiveDays,
    weekPasses,
    last7,
    checkedInToday: isActive(activity[today]),
    trackCompleted,
    distinctTracks: trackSet.size,
    maxWeekActiveDays,
  };
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  unlocked: boolean;
  current: number;
  target: number;
}

export function getAchievements(stats: Stats, completedCount: number): Achievement[] {
  const defs: Omit<Achievement, 'unlocked'>[] = [
    { id: 'first', icon: '🌱', title: '第一步', desc: '通关第 1 关', current: Math.min(completedCount, 1), target: 1 },
    { id: 'rookie3', icon: '📗', title: '新手上路', desc: '新手村通关 3 关', current: Math.min(stats.trackCompleted.rookie || 0, 3), target: 3 },
    { id: 'rookie-grad', icon: '🎓', title: '新手村毕业', desc: '新手村全部 6 关通关', current: Math.min(stats.trackCompleted.rookie || 0, 6), target: 6 },
    { id: 'explorer', icon: '🧭', title: '多面手', desc: '尝试 3 条不同路线', current: Math.min(stats.distinctTracks, 3), target: 3 },
    { id: 'all', icon: '🏆', title: '全部通关', desc: '12 关全部通关', current: Math.min(completedCount, 12), target: 12 },
    { id: 'streak3', icon: '🔥', title: '三日连打', desc: '连续打卡 3 天', current: Math.min(stats.longestStreak, 3), target: 3 },
    { id: 'streak7', icon: '🔥', title: '一周坚持', desc: '连续打卡 7 天', current: Math.min(stats.longestStreak, 7), target: 7 },
    { id: 'streak30', icon: '💎', title: '月度自律', desc: '连续打卡 30 天', current: Math.min(stats.longestStreak, 30), target: 30 },
    { id: 'days7', icon: '📅', title: '累计 7 天', desc: '累计打卡 7 天', current: Math.min(stats.totalDays, 7), target: 7 },
    { id: 'days30', icon: '📅', title: '累计 30 天', desc: '累计打卡 30 天', current: Math.min(stats.totalDays, 30), target: 30 },
    { id: 'week5', icon: '⚡', title: '单周 5 天', desc: '任意一周内打卡 5 天', current: Math.min(stats.maxWeekActiveDays, 5), target: 5 },
  ];
  return defs.map((d) => ({ ...d, unlocked: d.current >= d.target }));
}
