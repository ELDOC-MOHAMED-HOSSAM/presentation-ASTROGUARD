import type { LucideIcon } from 'lucide-react';
import { Activity, ArrowRight, Dumbbell, Radiation, ShieldAlert } from 'lucide-react';
import { accents, type Accent } from './accents';
import type { View } from '../types';

interface Card {
  view: View;
  n: string;
  title: string;
  icon: LucideIcon;
  accent: Accent;
  blurb: string;
  statLabel: string;
  stat: string;
  statColor?: string;
}

interface Props {
  onNavigate: (view: View) => void;
  exercisesDone: number;
  exercisesTotal: number;
  alerts: number;
  scenarioCount: number;
  detectorsChecked: number;
  detectorsTotal: number;
}

export default function Hub(props: Props) {
  const { onNavigate, alerts } = props;

  const cards: Card[] = [
    {
      view: 'exercises',
      n: '01',
      title: 'Exercises',
      icon: Dumbbell,
      accent: 'sky',
      blurb:
        'The daily workout: squats, deadlifts, heel raises and presses on ARED, treadmill intervals, a bike pyramid on CEVIS, and balance drills for landing day. Every exercise has step-by-step instructions.',
      statLabel: 'Done today',
      stat: `${props.exercisesDone} / ${props.exercisesTotal}`,
    },
    {
      view: 'thresholds',
      n: '02',
      title: 'Thresholds',
      icon: Activity,
      accent: 'violet',
      blurb:
        'Safe ranges for nine vital signs and cabin readings — heart rate, oxygen, blood pressure, temperature, CO₂ and eye pressure. Drag the live values or change the limits and see what trips an alert.',
      statLabel: 'Status',
      stat: alerts === 0 ? 'ALL NOMINAL' : `${alerts} ALERT${alerts > 1 ? 'S' : ''}`,
      statColor: alerts === 0 ? 'text-emerald-400' : 'text-rose-400',
    },
    {
      view: 'scenarios',
      n: '03',
      title: 'Scenarios',
      icon: ShieldAlert,
      accent: 'emerald',
      blurb:
        'Medical situations crews train for, from the bends after a spacewalk to a clot in the neck vein, a solar storm, or a crew member who’s struggling. Work through each checklist step by step.',
      statLabel: 'Scenarios',
      stat: `${props.scenarioCount} ready`,
    },
    {
      view: 'radiation',
      n: '04',
      title: 'Radiation Dosimetry',
      icon: Radiation,
      accent: 'amber',
      blurb:
        'How radiation exposure compares on the ISS, the Moon and Mars, and the Canadian instruments that measure it — CANS, bubble detectors, EVARM and MOSFET sensors.',
      statLabel: 'Detectors checked',
      stat: `${props.detectorsChecked} / ${props.detectorsTotal}`,
    },
  ];

  return (
    <section className="fade-in my-auto py-4">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono-tech text-sky-300 mb-4 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>TELEMETRY LINK ACTIVE // CREW MEDICAL HUB</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
          Mission Control{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-violet-400">
            Medical Hub
          </span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Pick a module to get started. The content is based on NASA’s Human Research Program
          and the Canadian Space Agency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
        {cards.map((card) => {
          const a = accents[card.accent];
          const Icon = card.icon;
          return (
            <button
              key={card.view}
              onClick={() => onNavigate(card.view)}
              className={`space-card ${a.hover} rounded-2xl p-6 sm:p-7 flex flex-col justify-between cursor-pointer group relative overflow-hidden text-left focus-glow`}
            >
              <div className={`absolute -right-10 -top-10 w-36 h-36 rounded-full blur-2xl transition ${a.glow}`} />
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className={`font-mono-tech text-xs font-semibold px-2.5 py-1 rounded-md border ${a.badge}`}>
                    {card.n} // MODULE
                  </span>
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition ${a.icon}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h2 className={`font-display text-xl sm:text-2xl font-bold text-white transition mb-2 ${a.title}`}>
                  {card.title}
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">{card.blurb}</p>
              </div>

              <div className="w-full">
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 mb-5 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{card.statLabel}</span>
                  <span className={`font-mono-tech font-semibold ${card.statColor ?? a.text}`}>
                    {card.stat}
                  </span>
                </div>
                <div className={`flex items-center justify-between text-sm font-medium ${a.link}`}>
                  <span>Open {card.title}</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:translate-x-1 transition ${a.arrow}`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
