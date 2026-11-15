import { useMemo } from 'react';

const SIZES = ['small', 'medium', 'large'];

export default function Starfield({ count = 150 }: { count?: number }) {
  // Random once per mount so the stars don't jump around on re-render.
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        size: SIZES[Math.floor(Math.random() * SIZES.length)],
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: 0.3 + Math.random() * 0.7,
        drift: Math.random() > 0.7 ? 40 + Math.random() * 50 : 0,
        delay: Math.random() * 3,
      })),
    [count]
  );

  return (
    <div className="starfield" aria-hidden="true">
      {stars.map((s) => (
        <div
          key={s.id}
          className={`star ${s.size}${s.drift ? ' drift' : ''}`}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            ...(s.drift && { animationDuration: `2.5s, ${s.drift}s` }),
          }}
        />
      ))}
    </div>
  );
}
