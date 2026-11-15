import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { accents, type Accent } from './accents';

interface Props {
  tab: string;
  title: string;
  subtitle: string;
  accent: Accent;
  onBack: () => void;
  children?: ReactNode;
}

export default function PageHeader({ tab, title, subtitle, accent, onBack, children }: Props) {
  return (
    <div className="space-card rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
          title="Back to hub (Esc)"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className={`font-mono-tech text-xs px-2 py-0.5 rounded border ${accents[accent].tab}`}>
              {tab}
            </span>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-white">{title}</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{subtitle}</p>
        </div>
      </div>

      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
