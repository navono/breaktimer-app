export interface WorkModeSession {
  mode: "SITTING" | "STANDING";
  start: string; // ISO timestamp
  duration: number; // seconds
}
