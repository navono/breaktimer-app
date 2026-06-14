import { Language } from "../../types/settings";
import { getSettings } from "./store";

function getCurrentLanguage(): Language {
  return getSettings().language;
}

type Translations = Record<string, Record<Language, string>>;

const translations: Translations = {
  // Tray menu
  nextBreakInMinutes: {
    [Language.En]: "Next break in {minutes} minutes",
    [Language.Zh]: "{minutes}分钟后休息",
  },
  nextBreakIn1Minute: {
    [Language.En]: "Next break in 1 minute",
    [Language.Zh]: "1分钟后休息",
  },
  nextBreakInLessThanAMinute: {
    [Language.En]: "Next break in less than a minute",
    [Language.Zh]: "不到1分钟后休息",
  },
  disabledFor: {
    [Language.En]: "Disabled for {time}",
    [Language.Zh]: "已暂停 {time}",
  },
  outsideOfWorkingHours: {
    [Language.En]: "Outside of working hours",
    [Language.Zh]: "不在工作时间内",
  },
  idle: { [Language.En]: "Idle", [Language.Zh]: "空闲" },
  enable: { [Language.En]: "Enable", [Language.Zh]: "启用" },
  disable: { [Language.En]: "Disable...", [Language.Zh]: "暂停..." },
  indefinitely: {
    [Language.En]: "Indefinitely",
    [Language.Zh]: "无限期",
  },
  thirtyMinutes: {
    [Language.En]: "30 minutes",
    [Language.Zh]: "30 分钟",
  },
  oneHour: { [Language.En]: "1 hour", [Language.Zh]: "1 小时" },
  twoHours: { [Language.En]: "2 hours", [Language.Zh]: "2 小时" },
  fourHours: { [Language.En]: "4 hours", [Language.Zh]: "4 小时" },
  restOfDay: {
    [Language.En]: "Rest of day",
    [Language.Zh]: "今天剩余时间",
  },
  startBreakNow: {
    [Language.En]: "Start break now",
    [Language.Zh]: "立即开始休息",
  },
  settings: { [Language.En]: "Settings...", [Language.Zh]: "设置..." },
  about: { [Language.En]: "About...", [Language.Zh]: "关于..." },
  quit: { [Language.En]: "Quit", [Language.Zh]: "退出" },

  // Notifications & breaks
  breakAutoDetected: {
    [Language.En]: "Break automatically detected",
    [Language.Zh]: "自动检测到休息",
  },
  awayFor: {
    [Language.En]: "Away for {time}",
    [Language.Zh]: "离开了 {time}",
  },
  timeForABreak: {
    [Language.En]: "Time for a break!",
    [Language.Zh]: "该休息了！",
  },

  // Window titles
  settingsWindowTitle: {
    [Language.En]: "BreakTimer — Settings",
    [Language.Zh]: "BreakTimer — 设置",
  },
};

export function t(
  key: string,
  params?: Record<string, string | number>,
): string {
  const lang = getCurrentLanguage();
  const entry = translations[key];
  if (!entry) {
    return key;
  }
  let text = entry[lang] || entry[Language.En] || key;
  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      text = text.replace(`{${paramKey}}`, String(paramValue));
    }
  }
  return text;
}
