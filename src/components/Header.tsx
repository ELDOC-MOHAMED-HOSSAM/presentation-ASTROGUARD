import { Activity, Dumbbell, LayoutGrid, Orbit, Radiation, ShieldAlert } from 'lucide-react';
import type { View } from '../types';

const TABS = [
  { view: 'hub', label: 'Hub', icon: LayoutGrid },
  { view: 'exercises', label: 'Exercises', icon: Dumbbell, n: 1 },
  { view: 'thresholds', label: 'Thresholds', icon: Activity, n: 2 },
  { view: 'scenarios', label: 'Scenarios', icon: ShieldAlert, n: 3 },
  { view: 'radiation', label: 'Radiation Dosimetry', icon: Radiation, n: 4 },
] as const;

interface Props {
  current: View;
  onNavigate: (view: View) => void;
}

export default function Header({ current, onNavigate }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 min-h-16 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('hub')}
          className="flex items-center gap-3 text-left group focus-glow cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/25 to-violet-500/25 border border-sky-400/40 flex items-center justify-center shadow-lg shadow-sky-500/10 group-hover:border-sky-400 transition">
            <Orbit className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white">
                ASTROGUARD
              </span>
              <span className="font-mono-tech text-[10px] uppercase px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-400/30">
                Orbital UI
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Space Crew Health &amp; Countermeasure System
            </p>
          </div>
        </button>

        <nav className="flex flex-wrap items-center gap-1 sm:gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = current === tab.view;
            return (
              <button
                key={tab.view}
                onClick={() => onNavigate(tab.view)}
                aria-current={active ? 'page' : undefined}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                  active
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
                    : 'text-slate-400 hover:text-white focus-glow'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {'n' in tab && <span className="hidden md:inline">{tab.n}.</span>}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
