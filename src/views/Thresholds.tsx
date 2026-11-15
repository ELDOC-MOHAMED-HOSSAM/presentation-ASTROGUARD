import type { Dispatch, SetStateAction } from 'react';
import PageHeader from '../components/PageHeader';
import CopyJsonButton from '../components/CopyJsonButton';
import SourceLink from '../components/SourceLink';
import { isOutOfRange, presets } from '../data/thresholds';
import type { Threshold } from '../types';

interface Props {
  thresholds: Threshold[];
  setThresholds: Dispatch<SetStateAction<Threshold[]>>;
  notify: (msg: string) => void;
  onBack: () => void;
}

const PRESET_BUTTONS = [
  { key: 'normal', label: 'Normal day', msg: 'Back to normal readings', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25' },
  { key: 'eva', label: 'Spacewalk effort', msg: 'Showing readings from a hard spacewalk', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25' },
  { key: 'hypoxia', label: 'Low O₂ + high CO₂', msg: 'Showing a low-oxygen, high-CO₂ emergency', cls: 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25' },
] as const;

export default function Thresholds({ thresholds, setThresholds, notify, onBack }: Props) {
  const alerts = thresholds.filter(isOutOfRange).length;

  const patch = (id: string, changes: Partial<Threshold>) =>
    setThresholds((list) => list.map((t) => (t.id === id ? { ...t, ...changes } : t)));

  const applyPreset = (key: keyof typeof presets, msg: string) => {
    const values = presets[key];
    setThresholds((list) => list.map((t) => (t.id in values ? { ...t, value: values[t.id] } : t)));
    notify(msg);
  };

  const setLimit = (id: string, which: 'min' | 'max', raw: string) => {
    // ignore the empty box while someone is mid-edit
    if (raw.trim() === '') return;
    const n = Number(raw);
    if (!Number.isNaN(n)) patch(id, { [which]: n });
  };

  return (
    <section className="fade-in space-y-6">
      <PageHeader
        tab="TAB 02"
        title="Thresholds"
        subtitle="Safe ranges for crew vital signs and cabin air, and when to raise an alert"
        accent="violet"
        onBack={onBack}
      >
        {PRESET_BUTTONS.map((p) => (
          <button
            key={p.key}
            onClick={() => applyPreset(p.key, p.msg)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${p.cls}`}
          >
            {p.label}
          </button>
        ))}
      </PageHeader>

      <div
        className={`space-card rounded-2xl p-4 border-l-4 flex flex-wrap items-center justify-between gap-3 ${
          alerts === 0 ? 'border-l-emerald-400' : 'border-l-rose-500'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${alerts === 0 ? 'bg-emerald-400' : 'bg-rose-500 animate-ping'}`} />
          <div>
            <div className="font-mono-tech text-sm font-bold text-white">
              {alerts === 0
                ? 'ALL READINGS IN RANGE'
                : `${alerts} READING${alerts > 1 ? 'S' : ''} OUT OF RANGE`}
            </div>
            <div className="text-xs text-slate-400">
              {alerts === 0
                ? `All ${thresholds.length} channels look fine.`
                : 'Check the red cards below. The Scenarios tab has step-by-step responses.'}
            </div>
          </div>
        </div>
        <CopyJsonButton data={thresholds} filename="thresholds.json" color="text-violet-300" notify={notify} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {thresholds.map((t) => {
          const low = t.value < t.min;
          const high = t.value > t.max;
          const alert = low || high;

          return (
            <div
              key={t.id}
              className={`space-card rounded-2xl p-5 flex flex-col justify-between border ${
                alert ? 'border-rose-500/50 shadow-lg shadow-rose-500/10' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono-tech text-[10px] uppercase px-2 py-0.5 rounded bg-violet-500/15 text-violet-300 border border-violet-400/30">
                    {t.group}
                  </span>
                  <span
                    className={`font-mono-tech text-[11px] px-2.5 py-0.5 rounded-full border ${
                      alert
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {low ? 'TOO LOW' : high ? 'TOO HIGH' : 'OK'}
                  </span>
                </div>

                <h3 className="font-display font-semibold text-base text-white mb-2">{t.name}</h3>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className={`font-mono-tech text-3xl font-bold ${alert ? 'text-rose-400' : 'text-white'}`}>
                    {t.value}
                  </span>
                  <span className="font-mono-tech text-xs text-slate-400">{t.unit}</span>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Live value</span>
                    <span className="font-mono-tech text-slate-300">
                      Safe: {t.min}–{t.max} {t.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={t.lo}
                    max={t.hi}
                    step={t.step}
                    value={t.value}
                    onChange={(e) => patch(t.id, { value: Number(e.target.value) })}
                    aria-label={`${t.name} live value`}
                    className="w-full cursor-pointer"
                  />
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-3 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/70">
                  {t.note}
                </p>

                <SourceLink
                  source={t.ref}
                  note={t.refNote}
                  className="text-[10px] text-violet-300/80 hover:text-violet-300 mb-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-800/80 text-xs">
                {(['min', 'max'] as const).map((which) => (
                  <label key={which} className="block">
                    <span className="block text-[10px] font-mono-tech uppercase text-slate-400 mb-1">
                      {which} ({t.unit})
                    </span>
                    <input
                      type="number"
                      step={t.step}
                      defaultValue={t[which]}
                      key={`${t.id}-${which}-${t[which]}`}
                      onBlur={(e) => setLimit(t.id, which, e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono-tech text-white focus:outline-none focus:border-violet-400"
                    />
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
