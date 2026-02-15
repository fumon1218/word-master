export enum Stage {
  HOME = 'HOME',
  STAGE_1 = 'STAGE_1', // Catching Game
  STAGE_2 = 'STAGE_2', // Syllable Tracing
  STAGE_3 = 'STAGE_3', // Word Tracing (No Batchim)
  STAGE_4 = 'STAGE_4', // Word Building
  STAGE_5 = 'STAGE_5', // Sentence Writing
}

export interface GameStats {
  score: number;
  completed: boolean;
}

export interface FallingItem {
  id: number;
  char: string;
  x: number;
  y: number;
  speed: number;
  isTarget: boolean;
}

export interface TracingItem {
  text: string;
  hint?: string;
}
