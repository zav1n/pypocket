import { useState } from 'react';
import { ChevronLeft, ChevronRight, Flame, CalendarCheck2, Trophy, BarChart3 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getAchievements, type ActivityMap, type Stats } from '../services/stats';
import { COURSES, TRACKS, type Lesson } from '../data/courses';

interface Props {
  activity: ActivityMap;
  completed: Set<string>;
  stats: Stats;
  onCheckin: () => void;
}

export default function StatsDashboard({ activity, completed, stats, onCheckin }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-11
  const achievements = getAchievements(stats, completed.size);
  const unlocked = achievements.filter((a) => a.unlocked);

  function shiftMonth(delta: number) {
    const dt = new Date(year, month + delta, 1);
    setYear(dt.getFullYear());
    setMonth(dt.getMonth());
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const cells: (string | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  }
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const maxLast7 = Math.max(1, ...stats.last7.map((d) => d.passes));

  function handleCheckin() {
    onCheckin();
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  }

  return (
    <div className="space-y-4">
      {/* 今日打卡 */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-wrap items-center gap-3 justify-between">
        <div>
          <h2 className="font-bold text-lg flex items-center gap-2"><Flame className="w-5 h-5 text-orange-400" /> 今日打卡</h2>
          <p className="text-sm text-slate-400 mt-1">
            {stats.checkedInToday
              ? '今天已经打卡了，继续保持。通关一关会自动打卡，没通关也可以手动打卡。'
              : '今天还没打卡。通关一关会自动打卡，或者直接点右边的按钮打卡。'}
          </p>
        </div>
        <button
          onClick={handleCheckin}
          disabled={stats.checkedInToday}
          className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 disabled:cursor-default font-bold text-sm"
        >
          {stats.checkedInToday ? '✓ 今日已打卡' : '今日打卡'}
        </button>
      </section>

      {/* 核心数字 */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: '连续打卡', value: `${stats.streak} 天`, sub: `最长 ${stats.longestStreak} 天` },
          { label: '累计打卡天数', value: `${stats.totalDays} 天`, sub: '有打卡记录的天数' },
          { label: '本周打卡', value: `${stats.weekActiveDays} / 7 天`, sub: `本周通关 ${stats.weekPasses} 次` },
          { label: '已通关', value: `${completed.size} / ${COURSES.length} 关`, sub: `通关总次数 ${stats.totalPasses}（含重复通关）` },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-xs text-slate-400">{c.label}</p>
            <p className="font-bold text-xl mt-1">{c.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{c.sub}</p>
          </div>
        ))}
      </section>

      {/* 日历 + 近 7 天 */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2"><CalendarCheck2 className="w-4 h-4 text-emerald-400" /> 打卡日历</h3>
            <div className="flex items-center gap-1">
              <button onClick={() => shiftMonth(-1)} className="p-1.5 rounded hover:bg-slate-800"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-sm font-medium w-20 text-center">{year} 年 {month + 1} 月</span>
              <button onClick={() => shiftMonth(1)} className="p-1.5 rounded hover:bg-slate-800"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mt-3 text-center text-xs text-slate-500">
            {['日', '一', '二', '三', '四', '五', '六'].map((w) => <div key={w}>{w}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 mt-1">
            {cells.map((dateStr, i) => {
              if (!dateStr) return <div key={`blank-${i}`} />;
              const day = activity[dateStr];
              const active = Boolean(day && (day.checkin || day.passes > 0));
              const isToday = dateStr === todayStr;
              return (
                <div
                  key={dateStr}
                  title={dateStr + (active ? ` · 通关 ${day?.passes || 0} 次` : ' · 未打卡')}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs border ${active ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200' : 'border-slate-800 text-slate-400'} ${isToday ? 'ring-2 ring-amber-400/70' : ''}`}
                >
                  <span>{Number(dateStr.slice(-2))}</span>
                  {active && day && day.passes > 0 && <span className="text-[10px] opacity-80">{day.passes} 关</span>}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 mt-3">绿色 = 当天打卡过；金色边框 = 今天。注意：升级前已通关的关卡没有日期，不补算进打卡天数，从今天开始算才是准确的。</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 className="font-bold flex items-center gap-2"><BarChart3 className="w-4 h-4 text-sky-400" /> 近 7 天通关次数</h3>
          <div className="flex items-end gap-2 h-32 mt-4">
            {stats.last7.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <span className="text-xs text-slate-300">{d.passes}</span>
                <div
                  className={`w-full rounded-t-md ${d.active ? 'bg-emerald-500' : 'bg-slate-800'}`}
                  style={{ height: `${d.passes === 0 ? 6 : Math.max(12, (d.passes / maxLast7) * 88)}px` }}
                />
                <span className="text-[10px] text-slate-500 text-center leading-tight">{d.label}</span>
              </div>
            ))}
          </div>
          <h4 className="font-medium text-sm mt-5 mb-2">各路线进度</h4>
          <div className="space-y-2">
            {(Object.keys(TRACKS) as Lesson['track'][]).map((t) => {
              const total = COURSES.filter((l) => l.track === t).length;
              const done = stats.trackCompleted[t] || 0;
              return (
                <div key={t} className="text-sm">
                  <div className="flex justify-between text-slate-300"><span>{TRACKS[t].label}</span><span>{done} / {total}</span></div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden mt-1"><div className="h-full bg-emerald-500" style={{ width: `${total ? (done / total) * 100 : 0}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 成就 */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="font-bold flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-400" /> 成就 · 已解锁 {unlocked.length} / {achievements.length}</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 mt-3">
          {achievements.map((a) => (
            <div key={a.id} className={`rounded-lg border p-3 ${a.unlocked ? 'border-amber-500/40 bg-amber-500/10' : 'border-slate-800 bg-slate-900/40 opacity-70'}`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{a.unlocked ? a.icon : '🔒'}</span>
                <span className="font-medium text-sm">{a.title}</span>
                <span className="ml-auto text-xs text-slate-400">{a.current} / {a.target}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{a.desc}</p>
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden mt-2"><div className="h-full bg-amber-400" style={{ width: `${(a.current / a.target) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
