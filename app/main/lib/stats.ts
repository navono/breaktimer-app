import { WorkMode } from "../../types/settings";
import { WorkModeSession } from "../../types/stats";
import { getStore } from "./store";

const MAX_AGE_DAYS = 730; // 2 years

function getStats(): WorkModeSession[] {
  return (getStore().get("workModeStats") as WorkModeSession[]) || [];
}

function saveStats(stats: WorkModeSession[]): void {
  getStore().set("workModeStats", stats);
}

export function recordWorkModeSession(
  mode: WorkMode,
  start: Date,
  durationSeconds: number,
): void {
  if (durationSeconds <= 0) return;

  const session: WorkModeSession = {
    mode: mode as unknown as "SITTING" | "STANDING",
    start: start.toISOString(),
    duration: durationSeconds,
  };

  const stats = getStats();
  stats.push(session);
  saveStats(stats);
}

export function getWorkModeStats(
  from?: string,
  to?: string,
): WorkModeSession[] {
  let stats = getStats();

  if (from) {
    const fromDate = new Date(from);
    stats = stats.filter((s) => new Date(s.start) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    stats = stats.filter((s) => new Date(s.start) <= toDate);
  }

  return stats;
}

export function pruneOldStats(): void {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - MAX_AGE_DAYS);

  const stats = getStats();
  const pruned = stats.filter((s) => new Date(s.start) >= cutoff);

  if (pruned.length !== stats.length) {
    console.log(
      `Pruned ${stats.length - pruned.length} old work mode stats entries`,
    );
    saveStats(pruned);
  }
}
