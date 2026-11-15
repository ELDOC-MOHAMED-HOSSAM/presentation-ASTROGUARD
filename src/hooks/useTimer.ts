import { useEffect, useRef, useState } from 'react';

export function useTimer(label: string, minutes: number, onDone?: (label: string) => void) {
  const [current, setCurrent] = useState({ label, total: minutes * 60 });
  const [seconds, setSeconds] = useState(minutes * 60);
  const [running, setRunning] = useState(false);

  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (running && seconds === 0) {
      setRunning(false);
      doneRef.current?.(current.label);
    }
  }, [running, seconds, current.label]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return {
    label: current.label,
    display: `${mm}:${ss}`,
    running,
    toggle: () => {
      // starting from 00:00 restarts the current exercise
      if (!running && seconds === 0) setSeconds(current.total);
      setRunning((r) => !r);
    },
    reset: () => {
      setRunning(false);
      setSeconds(current.total);
    },
    load: (name: string, mins: number) => {
      setRunning(false);
      setCurrent({ label: name, total: mins * 60 });
      setSeconds(mins * 60);
    },
  };
}

export type Timer = ReturnType<typeof useTimer>;
