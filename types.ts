export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type Tone = 'Professional' | 'Casual' | 'Concise' | 'Friendly';

export interface CorrectionResult {
  original: string;
  corrected: string;
  tone: Tone;
}

export interface HistoryItem extends CorrectionResult {
  id: string;
  timestamp: number;
}