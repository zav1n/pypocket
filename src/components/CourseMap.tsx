import { COURSES, TRACKS, type Lesson } from '../data/courses';
import { CheckCircle2, Lock } from 'lucide-react';

interface Props {
  track: Lesson['track'];
  completed: Set<string>;
  currentId: string;
  onSelect: (lesson: Lesson) => void;
}

export default function CourseMap({ track, completed, currentId, onSelect }: Props) {
  const lessons = COURSES.filter((l) => l.track === track);
  return (
    <div>
      <p className="text-sm text-slate-400 mb-3">{TRACKS[track].desc} · 共 {lessons.length} 关，已通关 {lessons.filter((l) => completed.has(l.id)).length} 关</p>
      <div className="grid gap-2">
        {lessons.map((lesson, i) => {
          const done = completed.has(lesson.id);
          const isCurrent = lesson.id === currentId;
          return (
            <button
              key={lesson.id}
              onClick={() => onSelect(lesson)}
              className={`text-left rounded-xl border p-3 flex items-center gap-3 transition ${isCurrent ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-900/60 hover:border-slate-600'}`}
            >
              <span className="w-8 h-8 shrink-0 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold">{done ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <span>{i + 1}</span>}</span>
              <span className="flex-1">
                <span className="block text-sm font-medium">{lesson.title}</span>
                <span className="block text-xs text-slate-500">{done ? '已通关，点击可复习' : isCurrent ? '正在挑战' : '未开始'}</span>
              </span>
              {!done && !isCurrent && <Lock className="w-4 h-4 text-slate-600" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
