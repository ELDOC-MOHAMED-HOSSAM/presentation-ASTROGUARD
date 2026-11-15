import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import PageHeader from '../components/PageHeader';
import CopyJsonButton from '../components/CopyJsonButton';
import SourceLink from '../components/SourceLink';
import type { Scenario, Severity } from '../types';

const SEVERITY_STYLE: Record<Severity, string> = {
  CRITICAL: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  MODERATE: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  ROUTINE: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
};

interface Props {
  scenarios: Scenario[];
  setScenarios: Dispatch<SetStateAction<Scenario[]>>;
  notify: (msg: string) => void;
  onBack: () => void;
}

export default function Scenarios({ scenarios, setScenarios, notify, onBack }: Props) {
  const [selectedId, setSelectedId] = useState(scenarios[0]?.id);
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState<Severity | 'ALL'>('ALL');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return scenarios.filter((s) => {
      if (severity !== 'ALL' && s.severity !== severity) return false;
      if (!q) return true;
      return [s.title, s.system, s.code, s.presentation].some((f) => f.toLowerCase().includes(q));
    });
  }, [scenarios, search, severity]);

  // if the selected one gets filtered out, fall back to the first match
  const active = filtered.find((s) => s.id === selectedId) ?? filtered[0];

  const toggleStep = (id: string, idx: number) =>
    setScenarios((list) =>
      list.map((s) =>
        s.id === id
          ? { ...s, steps: s.steps.map((st, i) => (i === idx ? { ...st, done: !st.done } : st)) }
          : s
      )
    );

  const resetSteps = (sc: Scenario) => {
    setScenarios((list) =>
      list.map((s) => (s.id === sc.id ? { ...s, steps: s.steps.map((st) => ({ ...st, done: false })) } : s))
    );
    notify(`${sc.code} checklist cleared`);
  };

  return (
    <section className="fade-in space-y-6">
      <PageHeader
        tab="TAB 03"
        title={`Scenarios (${scenarios.length})`}
        subtitle="Medical situations crews train for, with a step-by-step checklist for each"
        accent="emerald"
        onBack={onBack}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="search"
          placeholder="Search scenarios..."
          className="bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
        />
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value as Severity | 'ALL')}
          className="bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-400"
        >
          <option value="ALL">All severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="MODERATE">Moderate</option>
          <option value="ROUTINE">Routine</option>
        </select>
        <CopyJsonButton data={scenarios} filename="scenarios.json" color="text-emerald-300" notify={notify} />
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-2.5 max-h-[760px] overflow-y-auto pr-1">
          {filtered.length === 0 && (
            <div className="space-card rounded-2xl p-5 text-xs text-slate-400">
              Nothing matches that search.
            </div>
          )}
          {filtered.map((sc) => {
            const doneCount = sc.steps.filter((s) => s.done).length;
            return (
              <button
                key={sc.id}
                onClick={() => setSelectedId(sc.id)}
                className={`w-full text-left space-card rounded-2xl p-4 transition border cursor-pointer ${
                  sc.id === active?.id ? 'border-emerald-400/70 bg-slate-900/90' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono-tech text-xs text-emerald-300 font-semibold">
                    {sc.code} · {sc.system}
                  </span>
                  <span className={`font-mono-tech text-[10px] px-2 py-0.5 rounded-full border ${SEVERITY_STYLE[sc.severity]}`}>
                    {sc.severity}
                  </span>
                </div>
                <h3 className="font-display font-bold text-sm text-white mb-1">{sc.title}</h3>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>Checklist</span>
                  <span className="font-mono-tech text-slate-300">
                    {doneCount} / {sc.steps.length}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {active && <ScenarioDetail scenario={active} onToggle={toggleStep} onReset={resetSteps} />}
      </div>
    </section>
  );
}

interface DetailProps {
  scenario: Scenario;
  onToggle: (id: string, idx: number) => void;
  onReset: (sc: Scenario) => void;
}

function ScenarioDetail({ scenario: sc, onToggle, onReset }: DetailProps) {
  const doneCount = sc.steps.filter((s) => s.done).length;
  const pct = Math.round((doneCount / sc.steps.length) * 100);

  return (
    <div className="lg:col-span-7 space-card rounded-2xl p-6 lg:sticky lg:top-24">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
        <div>
          <span className="font-mono-tech text-xs text-emerald-400">
            {sc.code} // {sc.system.toUpperCase()}
          </span>
          <h2 className="font-display text-xl font-bold text-white mt-0.5">{sc.title}</h2>
        </div>
        <button
          onClick={() => onReset(sc)}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 transition cursor-pointer"
        >
          Reset checklist
        </button>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 mb-3">
        <div className="text-[10px] font-mono-tech uppercase text-emerald-300 mb-1">What’s going on</div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{sc.presentation}</p>
      </div>

      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
        <span className="font-semibold text-white">Why it happens: </span>
        {sc.why}
      </p>

      <SourceLink
        source={sc.ref}
        note={sc.refNote}
        className="text-xs text-emerald-400 hover:text-emerald-300 mb-5"
      />

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-mono-tech uppercase text-slate-400">Response</span>
          <span className="font-mono-tech font-semibold text-emerald-300">
            {pct}% ({doneCount}/{sc.steps.length})
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="space-y-2.5">
        {sc.steps.map((st, i) => (
          <button
            key={i}
            onClick={() => onToggle(sc.id, i)}
            aria-pressed={st.done}
            className={`w-full text-left p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
              st.done
                ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-200'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center text-xs font-bold shrink-0 ${
                st.done ? 'bg-emerald-400 text-slate-950' : 'border border-slate-600 text-transparent'
              }`}
            >
              ✓
            </span>
            <span className={`flex-1 text-xs sm:text-sm leading-relaxed ${st.done ? 'line-through text-slate-400' : 'text-slate-200'}`}>
              <span className="font-mono-tech text-xs text-emerald-400 mr-1.5">
                STEP {String(i + 1).padStart(2, '0')}:
              </span>
              {st.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
