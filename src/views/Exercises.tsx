import { useState, type Dispatch, type SetStateAction } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import CopyJsonButton from '../components/CopyJsonButton';
import SourceLink from '../components/SourceLink';
import type { Timer } from '../hooks/useTimer';
import type { Exercise, ExerciseCategory } from '../types';

type Filter = 'ALL' | ExerciseCategory;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'ARED', label: 'Strength (ARED)' },
  { id: 'CARDIO', label: 'Cardio (T2 & CEVIS)' },
  { id: 'NEURO', label: 'Balance' },
];

interface Props {
  exercises: Exercise[];
  setExercises: Dispatch<SetStateAction<Exercise[]>>;
  timer: Timer;
  notify: (msg: string) => void;
  onBack: () => void;
}

export default function Exercises({ exercises, setExercises, timer, notify, onBack }: Props) {
  const [filter, setFilter] = useState<Filter>('ALL');
  const [open, setOpen] = useState<Record<string, boolean>>({ squat: true, deadlift: true });

  const done = exercises.filter((e) => e.done).length;
  const pct = Math.round((done / exercises.length) * 100);
  const shown = filter === 'ALL' ? exercises : exercises.filter((e) => e.category === filter);

  const update = (id: string, fn: (e: Exercise) => Exercise) =>
    setExercises((list) => list.map((e) => (e.id === id ? fn(e) : e)));

  const changeSets = (id: string, by: number) =>
    update(id, (e) => ({ ...e, sets: Math.min(10, Math.max(1, e.sets + by)) }));

  const toggleDone = (ex: Exercise) => {
    update(ex.id, (e) => ({ ...e, done: !e.done }));
    notify(ex.done ? `${ex.name} — back to pending` : `${ex.name} — done`);
  };

  const startTimer = (ex: Exercise) => {
    timer.load(ex.name, ex.minutes);
    notify(`Timer set: ${ex.minutes} min for ${ex.name}`);
  };

  return (
    <section className="fade-in space-y-6">
      <PageHeader
        tab="TAB 01"
        title="Exercises"
        subtitle="Daily countermeasure workouts — strength, cardio and balance"
        accent="sky"
        onBack={onBack}
      >
        <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-xl">
          <div>
            <div className="text-[10px] font-mono-tech uppercase text-slate-400 max-w-[180px] truncate">
              {timer.label}
            </div>
            <div className="font-mono-tech text-lg font-bold text-sky-300">{timer.display}</div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={timer.toggle}
              className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition cursor-pointer"
            >
              {timer.running ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={timer.reset}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
              title="Reset timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
        <CopyJsonButton data={exercises} filename="exercises.json" color="text-sky-300" notify={notify} />
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
        <div className="lg:col-span-2 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                filter === f.id
                  ? 'bg-sky-500 text-slate-950 font-semibold'
                  : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-sky-500/40'
              }`}
            >
              {f.id === 'ALL' ? `${f.label} (${exercises.length})` : f.label}
            </button>
          ))}
        </div>

        <div className="space-card rounded-xl p-3.5">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400">Today’s plan</span>
            <span className="font-mono-tech text-sky-300 font-semibold">
              {pct}% ({done}/{exercises.length})
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-cyan-300 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {shown.map((ex) => {
          const expanded = !!open[ex.id];
          return (
            <div
              key={ex.id}
              className={`space-card rounded-2xl p-5 flex flex-col justify-between border ${
                ex.done ? 'border-emerald-500/40' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono-tech text-[11px] px-2.5 py-0.5 rounded-md bg-sky-500/15 text-sky-300 border border-sky-400/30">
                    {ex.tag}
                  </span>
                  <span className="font-mono-tech text-xs text-slate-400">
                    {ex.minutes} min{ex.restSec > 0 && ` · ${ex.restSec}s rest`}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-white mb-1">{ex.name}</h3>
                <p className="text-xs text-sky-300/90 font-mono-tech mb-2">{ex.device}</p>

                <div className="text-xs text-slate-300 mb-2">
                  <span className="text-slate-400">Works: </span>
                  <span className="font-medium text-white">{ex.muscles}</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-3">{ex.why}</p>

                <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3 mb-3">
                  <button
                    onClick={() => setOpen((o) => ({ ...o, [ex.id]: !o[ex.id] }))}
                    aria-expanded={expanded}
                    className="w-full flex items-center justify-between text-left text-xs font-semibold text-sky-300 hover:text-sky-200 transition cursor-pointer"
                  >
                    <span>How to do it ({ex.steps.length} steps)</span>
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expanded && (
                    <ol className="mt-2.5 space-y-2 text-xs text-slate-300 list-decimal list-inside border-t border-slate-800/80 pt-2.5">
                      {ex.steps.map((s, i) => (
                        <li key={i} className="leading-relaxed">
                          {s}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 mb-2">
                  <span className="font-mono-tech text-sky-300/80">Load:</span> {ex.load}
                </div>

                <SourceLink
                  source={ex.ref}
                  note={ex.refNote}
                  className="text-[11px] text-sky-400/90 hover:text-sky-300 mb-3"
                />
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs bg-slate-950/60 px-3 py-2 rounded-xl">
                  <span className="text-slate-400">Sets × reps</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => changeSets(ex.id, -1)}
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
                      aria-label="One less set"
                    >
                      -
                    </button>
                    <span className="font-mono-tech text-white font-semibold">
                      {ex.sets} × {ex.reps}
                    </span>
                    <button
                      onClick={() => changeSets(ex.id, 1)}
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
                      aria-label="One more set"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleDone(ex)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      ex.done
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {ex.done ? '✓ Done' : 'Mark done'}
                  </button>
                  <button
                    onClick={() => startTimer(ex)}
                    className="py-2 px-3 rounded-xl text-xs font-mono-tech bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-400/30 transition cursor-pointer"
                  >
                    Timer
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
