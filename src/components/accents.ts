// Tailwind needs full class names in the source, so each accent spells them out.
export const accents = {
  sky: {
    hover: 'space-card-interactive',
    glow: 'bg-sky-500/10 group-hover:bg-sky-400/20',
    badge: 'bg-sky-500/15 text-sky-300 border-sky-400/30',
    tab: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
    icon: 'bg-sky-500/15 border-sky-400/30 text-sky-400 group-hover:bg-sky-500/25',
    title: 'group-hover:text-sky-300',
    link: 'text-sky-400 group-hover:text-sky-300',
    arrow: 'bg-sky-500/15',
    text: 'text-sky-300',
  },
  violet: {
    hover: 'space-card-violet',
    glow: 'bg-violet-500/10 group-hover:bg-violet-400/20',
    badge: 'bg-violet-500/15 text-violet-300 border-violet-400/30',
    tab: 'bg-violet-500/20 text-violet-300 border-violet-400/30',
    icon: 'bg-violet-500/15 border-violet-400/30 text-violet-400 group-hover:bg-violet-500/25',
    title: 'group-hover:text-violet-300',
    link: 'text-violet-400 group-hover:text-violet-300',
    arrow: 'bg-violet-500/15',
    text: 'text-violet-300',
  },
  emerald: {
    hover: 'space-card-emerald',
    glow: 'bg-emerald-500/10 group-hover:bg-emerald-400/20',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
    tab: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    icon: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-400 group-hover:bg-emerald-500/25',
    title: 'group-hover:text-emerald-300',
    link: 'text-emerald-400 group-hover:text-emerald-300',
    arrow: 'bg-emerald-500/15',
    text: 'text-emerald-300',
  },
  amber: {
    hover: 'space-card-amber',
    glow: 'bg-amber-500/10 group-hover:bg-amber-400/20',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
    tab: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    icon: 'bg-amber-500/15 border-amber-400/30 text-amber-400 group-hover:bg-amber-500/25',
    title: 'group-hover:text-amber-300',
    link: 'text-amber-400 group-hover:text-amber-300',
    arrow: 'bg-amber-500/15',
    text: 'text-amber-300',
  },
};

export type Accent = keyof typeof accents;
