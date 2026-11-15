import { useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import PageHeader from '../components/PageHeader';
import CopyJsonButton from '../components/CopyJsonButton';
import SourceLink from '../components/SourceLink';
import { missions } from '../data/radiation';
import type { Detector, MissionKey } from '../types';

const MISSION_TABS: { key: MissionKey; label: string }[] = [
  { key: 'ISS', label: 'ISS (6 months)' },
  { key: 'MOON', label: 'Moon (weeks)' },
  { key: 'MARS', label: 'Mars (~3 years)' },
];

interface Props {
  detectors: Detector[];
  setDetectors: Dispatch<SetStateAction<Detector[]>>;
  notify: (msg: string) => void;
  onBack: () => void;
}

export default function RadiationView({ detectors, setDetectors, notify, onBack }: Props) {
  const [mission, setMission] = useState<MissionKey>('ISS');
  const m = missions[mission];
  const overLimit = m.missionDose > m.careerLimit;

  const patch = (id: string, changes: Partial<Detector>) =>
    setDetectors((list) => list.map((d) => (d.id === id ? { ...d, ...changes } : d)));

  const toggleChecked = (d: Detector) => {
    patch(d.id, { checked: !d.checked });
    notify(`${d.code} ${d.checked ? 'unchecked' : 'checked'}`);
  };

  return (
    <section className="fade-in space-y-6">
      <PageHeader
        tab="TAB 04"
        title="Radiation Dosimetry"
        subtitle="How much radiation crews get, and the instruments that measure it"
        accent="amber"
        onBack={onBack}
      >
        {MISSION_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setMission(t.key)}
            className={`px-3 py-1.5 rounded-xl text-xs transition cursor-pointer ${
              mission === t.key
                ? 'font-semibold bg-amber-500 text-slate-950'
                : 'font-medium bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-amber-400/40'
            }`}
          >
            {t.label}
          </button>
        ))}
        <CopyJsonButton
          data={{ missions, detectors }}
          filename="radiation.json"
          color="text-amber-300"
          notify={notify}
        />
      </PageHeader>

      <div className="space-card rounded-2xl p-5 border-l-4 border-l-amber-400 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div>
            <div className="text-[10px] font-mono-tech uppercase text-amber-300">Mission</div>
            <div className="font-display font-bold text-base text-white mt-0.5">{m.name}</div>
            <div className="text-[11px] text-slate-400">{m.distance}</div>
          </div>

          <Stat label="Dose rate (approx.)" value={m.dosePerDay} sub={m.duration} />

          <Stat
            label="Whole mission (approx.)"
            value={
              <span className={overLimit ? 'text-rose-400' : 'text-amber-300'}>
                ~{m.missionDose.toLocaleString()} mSv{' '}
                <span className="text-xs font-normal text-slate-400">/ {m.careerLimit} mSv career limit</span>
              </span>
            }
            sub={m.gravity}
          />

          <Stat label="Neutron share" value={m.neutronShare} sub={`Shielding: ${m.shielding}`} highlight />
        </div>

        <div className="text-xs text-slate-300 bg-slate-950/60 border border-slate-800/80 rounded-xl px-4 py-2.5">
          {m.context}{' '}
          <SourceLink source={m.ref} className="text-amber-400 hover:text-amber-300" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {detectors.map((d) => {
          const alarm = d.reading > d.alarm;
          return (
            <div
              key={d.id}
              className={`space-card rounded-2xl p-5 flex flex-col justify-between border ${
                alarm ? 'border-rose-500/50' : d.checked ? 'border-amber-400/40' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono-tech text-xs px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-400/30">
                    {d.code}
                  </span>
                  <span
                    className={`font-mono-tech text-[11px] px-2.5 py-0.5 rounded-full border ${
                      alarm
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : d.checked
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {alarm ? 'DOSE ALARM' : d.status}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-white mb-1">{d.name}</h3>
                <p className="text-xs font-mono-tech text-amber-300/90 mb-2">{d.who}</p>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">{d.role}</p>

                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 mb-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Simulated reading</span>
                    <span className={`font-mono-tech font-bold ${alarm ? 'text-rose-400' : 'text-amber-300'}`}>
                      {d.reading.toFixed(2)} mSv/day (alarm {d.alarm.toFixed(2)})
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.05}
                    max={2.5}
                    step={0.05}
                    value={d.reading}
                    onChange={(e) => patch(d.id, { reading: Number(e.target.value) })}
                    aria-label={`${d.name} reading`}
                    className="w-full cursor-pointer"
                  />
                </div>

                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 mb-3 text-xs text-slate-300">
                  <span className="font-mono-tech text-amber-400 font-semibold">Good to know:</span> {d.fact}
                </div>

                <p className="text-xs text-slate-400 mb-3">
                  <span className="text-slate-300 font-medium">Back on Earth:</span> {d.onEarth}
                </p>

                <SourceLink source={d.ref} className="text-[11px] text-amber-400 hover:text-amber-300 mb-3" />
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400">Pre-shift check</span>
                <button
                  onClick={() => toggleChecked(d)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    d.checked
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  {d.checked ? '✓ Checked' : 'Mark checked'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: ReactNode;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div className={`bg-slate-950/70 p-3 rounded-xl border ${highlight ? 'border-amber-500/30' : 'border-slate-800'}`}>
      <div className={`text-[10px] font-mono-tech uppercase ${highlight ? 'text-amber-300' : 'text-slate-400'}`}>
        {label}
      </div>
      <div className="font-mono-tech text-lg text-white font-bold mt-0.5">{value}</div>
      <div className="text-[11px] text-slate-400">{sub}</div>
    </div>
  );
}
