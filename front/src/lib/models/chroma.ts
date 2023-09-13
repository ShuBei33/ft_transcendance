export type colorStop = { offset: number; color: string };

export interface chromaGradient {
  name: string;
  stops: colorStop[];
}