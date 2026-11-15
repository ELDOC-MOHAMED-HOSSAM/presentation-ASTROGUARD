import type { SourceKey } from './data/sources';

export type View = 'hub' | 'exercises' | 'thresholds' | 'scenarios' | 'radiation';

export type ExerciseCategory = 'ARED' | 'CARDIO' | 'NEURO';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  tag: string;
  device: string;
  minutes: number;
  sets: number;
  reps: string;
  restSec: number;
  load: string;
  muscles: string;
  why: string;
  steps: string[];
  done: boolean;
  ref: SourceKey;
  refNote: string;
}

export interface Threshold {
  id: string;
  name: string;
  group: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  // slider range
  lo: number;
  hi: number;
  step: number;
  note: string;
  ref: SourceKey;
  refNote: string;
}

export type Severity = 'CRITICAL' | 'MODERATE' | 'ROUTINE';

export interface ChecklistStep {
  text: string;
  done: boolean;
}

export interface Scenario {
  id: string;
  code: string;
  title: string;
  severity: Severity;
  system: string;
  presentation: string;
  why: string;
  steps: ChecklistStep[];
  ref: SourceKey;
  refNote: string;
}

export type MissionKey = 'ISS' | 'MOON' | 'MARS';

export interface MissionProfile {
  name: string;
  duration: string;
  distance: string;
  gravity: string;
  dosePerDay: string;
  missionDose: number; // mSv, rough estimate
  careerLimit: number; // mSv
  neutronShare: string;
  shielding: string;
  context: string;
  ref: SourceKey;
}

export interface Detector {
  id: string;
  code: string;
  name: string;
  who: string;
  reading: number; // simulated, mSv/day
  alarm: number; // simulated, mSv/day
  role: string;
  fact: string;
  onEarth: string;
  status: string;
  checked: boolean;
  ref: SourceKey;
}
