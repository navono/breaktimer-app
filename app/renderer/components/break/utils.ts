import { Language } from "../../../types/settings";
import { getLanguage, t } from "../../lib/i18n";

export function formatTimeSinceLastBreak(seconds: number): string {
  const lang = getLanguage();
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (lang === Language.Zh) {
    if (hours > 0) {
      return `${hours}小时${minutes > 0 ? ` ${minutes}分钟` : ""}${t("sinceLastBreak")}`;
    } else if (minutes > 0) {
      return `${minutes}分钟${t("sinceLastBreak")}`;
    } else {
      return t("lessThan1mSinceLastBreak");
    }
  }

  if (hours > 0) {
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""} ${t("sinceLastBreak")}`;
  } else if (minutes > 0) {
    return `${minutes}m ${t("sinceLastBreak")}`;
  } else {
    return t("lessThan1mSinceLastBreak");
  }
}

export function createRgba(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function createDarkerRgba(hex: string, a: number) {
  const r = Math.floor(parseInt(hex.slice(1, 3), 16) * 0.3);
  const g = Math.floor(parseInt(hex.slice(3, 5), 16) * 0.3);
  const b = Math.floor(parseInt(hex.slice(5, 7), 16) * 0.3);

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
}
