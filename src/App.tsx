import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header';
import Hub from './components/Hub';
import Starfield from './components/Starfield';
import { exercises as startingExercises } from './data/exercises';
import { isOutOfRange, thresholds as startingThresholds } from './data/thresholds';
import { scenarios as startingScenarios } from './data/scenarios';
import { detectors as startingDetectors } from './data/radiation';
import { useTimer } from './hooks/useTimer';
import Exercises from './views/Exercises';
import Thresholds from './views/Thresholds';
import Scenarios from './views/Scenarios';
import RadiationView from './views/Radiation';
import type { View } from './types';

export default function App() {
  const [view, setView] = useState<View>('hub');
  const [exercises, setExercises] = useState(startingExercises);
  const [thresholds, setThresholds] = useState(startingThresholds);
  const [scenarios, setScenarios] = useState(startingScenarios);
  const [detectors, setDetectors] = useState(startingDetectors);
  const [toast, setToast] = useState<string | null>(null);

  const notify = useCallback((msg: string) => setToast(msg), []);

  const timer = useTimer(startingExercises[0].name, startingExercises[0].minutes, (name) =>
    notify(`Time’s up — ${name}`)
  );

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const go = useCallback((next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Esc always takes you back to the hub
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && go('hub');
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const back = () => go('hub');

  return (
    <div className="cosmic-bg min-h-screen flex flex-col selection:bg-sky-500/30 selection:text-sky-200">
      <Starfield />
      <Header current={view} onNavigate={go} />

      <main className="relative z-10 flex-1 flex flex-col justify-center max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {view === 'hub' && (
          <Hub
            onNavigate={go}
            exercisesDone={exercises.filter((e) => e.done).length}
            exercisesTotal={exercises.length}
            alerts={thresholds.filter(isOutOfRange).length}
            scenarioCount={scenarios.length}
            detectorsChecked={detectors.filter((d) => d.checked).length}
            detectorsTotal={detectors.length}
          />
        )}
        {view === 'exercises' && (
          <Exercises exercises={exercises} setExercises={setExercises} timer={timer} notify={notify} onBack={back} />
        )}
        {view === 'thresholds' && (
          <Thresholds thresholds={thresholds} setThresholds={setThresholds} notify={notify} onBack={back} />
        )}
        {view === 'scenarios' && (
          <Scenarios scenarios={scenarios} setScenarios={setScenarios} notify={notify} onBack={back} />
        )}
        {view === 'radiation' && (
          <RadiationView detectors={detectors} setDetectors={setDetectors} notify={notify} onBack={back} />
        )}
      </main>

      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 bg-slate-900/95 border border-sky-400/40 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-mono-tech flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-sky-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
