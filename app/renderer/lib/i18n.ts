import { Language } from "../../types/settings";

let currentLanguage: Language = Language.En;

export function setLanguage(lang: Language): void {
  currentLanguage = lang;
}

export function getLanguage(): Language {
  return currentLanguage;
}

type Translations = Record<string, Record<Language, string>>;

const translations: Translations = {
  // Settings header
  settings: { [Language.En]: "Settings", [Language.Zh]: "设置" },
  save: { [Language.En]: "Save", [Language.Zh]: "保存" },
  tabGeneral: {
    [Language.En]: "General",
    [Language.Zh]: "通用",
  },
  tabWorkingHours: {
    [Language.En]: "Working Hours",
    [Language.Zh]: "工作时间",
  },
  tabCustomization: {
    [Language.En]: "Customization",
    [Language.Zh]: "自定义",
  },
  tabSystem: { [Language.En]: "System", [Language.Zh]: "系统" },

  // Breaks card
  breaks: { [Language.En]: "Breaks", [Language.Zh]: "休息" },
  type: { [Language.En]: "Type", [Language.Zh]: "类型" },
  popupBreak: {
    [Language.En]: "Popup break",
    [Language.Zh]: "弹窗休息",
  },
  simpleNotification: {
    [Language.En]: "Simple notification",
    [Language.Zh]: "简单通知",
  },
  frequency: { [Language.En]: "Frequency", [Language.Zh]: "频率" },
  controlledByWorkMode: {
    [Language.En]: "Controlled by Work Mode",
    [Language.Zh]: "由办公模式控制",
  },
  length: { [Language.En]: "Length", [Language.Zh]: "时长" },
  title: { [Language.En]: "Title", [Language.Zh]: "标题" },
  message: { [Language.En]: "Message", [Language.Zh]: "消息" },
  breakMessagePlaceholder: {
    [Language.En]: "Enter your break message...",
    [Language.Zh]: "输入休息消息...",
  },

  // Smart breaks card
  smartBreaks: {
    [Language.En]: "Smart Breaks",
    [Language.Zh]: "智能休息",
  },
  smartBreaksHelper: {
    [Language.En]:
      "Automatically detect natural breaks and reset the break timer.",
    [Language.Zh]: "自动检测自然休息并重置休息计时器。",
  },
  minimumIdleTime: {
    [Language.En]: "Minimum idle time",
    [Language.Zh]: "最小空闲时间",
  },
  idleNotificationLabel: {
    [Language.En]: "Show notification when break automatically detected",
    [Language.Zh]: "自动检测到休息时显示通知",
  },

  // Snooze card
  snooze: { [Language.En]: "Snooze", [Language.Zh]: "推迟" },
  snoozeHelper: {
    [Language.En]: "Snoozing allows you to postpone breaks when busy.",
    [Language.Zh]: "推迟允许您在忙碌时延后休息。",
  },
  limit: { [Language.En]: "Limit", [Language.Zh]: "限制" },
  noLimit: { [Language.En]: "No limit", [Language.Zh]: "无限制" },

  // Skip card
  skip: { [Language.En]: "Skip", [Language.Zh]: "跳过" },
  skipHelper: {
    [Language.En]: "Allow skipping breaks entirely without rescheduling them.",
    [Language.Zh]: "允许完全跳过休息而不重新安排。",
  },

  // Advanced card
  advanced: { [Language.En]: "Advanced", [Language.Zh]: "高级" },
  immediatelyStartBreaks: {
    [Language.En]: "Immediately start breaks",
    [Language.Zh]: "立即开始休息",
  },
  allowEndingBreakEarly: {
    [Language.En]: "Allow ending break early",
    [Language.Zh]: "允许提前结束休息",
  },

  // Startup card
  startAtLogin: {
    [Language.En]: "Start at login",
    [Language.Zh]: "登录时启动",
  },
  startAtLoginHelper: {
    [Language.En]:
      "Automatically start BreakTimer when you log into your computer.",
    [Language.Zh]: "登录电脑时自动启动 BreakTimer。",
  },

  // Tray card
  menuBarText: {
    [Language.En]: "Menu Bar Text",
    [Language.Zh]: "菜单栏文字",
  },
  menuBarTextHelper: {
    [Language.En]: "Show timing information next to the menu bar icon.",
    [Language.Zh]: "在菜单栏图标旁显示时间信息。",
  },
  text: { [Language.En]: "Text", [Language.Zh]: "文字" },
  timeToNextBreak: {
    [Language.En]: "Time to next break",
    [Language.Zh]: "距下次休息",
  },
  timeSinceLastBreak: {
    [Language.En]: "Time since last break",
    [Language.Zh]: "距上次休息",
  },

  // Theme card
  theme: { [Language.En]: "Theme", [Language.Zh]: "主题" },
  primaryColor: {
    [Language.En]: "Primary color",
    [Language.Zh]: "主色",
  },
  textColor: { [Language.En]: "Text color", [Language.Zh]: "文字颜色" },
  reset: { [Language.En]: "Reset", [Language.Zh]: "重置" },

  // Audio card
  audio: { [Language.En]: "Audio", [Language.Zh]: "音频" },
  breakSound: {
    [Language.En]: "Break sound",
    [Language.Zh]: "休息提示音",
  },
  breakSoundVolume: {
    [Language.En]: "Break sound volume",
    [Language.Zh]: "提示音音量",
  },

  // Backdrop card
  backdrop: { [Language.En]: "Backdrop", [Language.Zh]: "背景遮罩" },
  backdropHelper: {
    [Language.En]:
      "Show a colored overlay behind break windows to limit distractions.",
    [Language.Zh]: "在休息窗口后显示彩色遮罩以减少干扰。",
  },
  opacity: { [Language.En]: "Opacity", [Language.Zh]: "不透明度" },

  // Time range
  to: { [Language.En]: "to", [Language.Zh]: "至" },
  copyRangesTo: {
    [Language.En]: "Copy ranges to:",
    [Language.Zh]: "复制时间段到：",
  },
  apply: { [Language.En]: "Apply", [Language.Zh]: "应用" },

  // Break notification
  startBreakWhenReady: {
    [Language.En]: "Start your break when ready...",
    [Language.Zh]: "准备好后开始休息...",
  },
  breakStartingIn: {
    [Language.En]: "Break starting in {seconds}s...",
    [Language.Zh]: "{seconds}秒后开始休息...",
  },
  start: { [Language.En]: "Start", [Language.Zh]: "开始" },
  snoozeBtn: { [Language.En]: "Snooze", [Language.Zh]: "推迟" },
  skipBtn: { [Language.En]: "Skip", [Language.Zh]: "跳过" },

  // Break progress
  cancelBreak: {
    [Language.En]: "Cancel Break",
    [Language.Zh]: "取消休息",
  },
  endBreak: { [Language.En]: "End Break", [Language.Zh]: "结束休息" },

  // Break utils
  sinceLastBreak: {
    [Language.En]: "since last break",
    [Language.Zh]: "距上次休息",
  },
  lessThan1mSinceLastBreak: {
    [Language.En]: "Less than 1m since last break",
    [Language.Zh]: "距上次休息不到1分钟",
  },

  // Welcome modal
  welcomeTitle: {
    [Language.En]: "BreakTimer runs in the background",
    [Language.Zh]: "BreakTimer 在后台运行",
  },
  welcomeDescription: {
    [Language.En]: "The app can be accessed via your system tray.",
    [Language.Zh]: "可以通过系统托盘访问此应用。",
  },
  welcomeButton: {
    [Language.En]: "Understood, let's go!",
    [Language.Zh]: "知道了，开始吧！",
  },

  // Sound select
  soundNone: { [Language.En]: "None", [Language.Zh]: "无" },
  soundGong: { [Language.En]: "Gong", [Language.Zh]: "锣声" },
  soundBlip: { [Language.En]: "Blip", [Language.Zh]: "嘟声" },
  soundBloop: { [Language.En]: "Bloop", [Language.Zh]: "啵声" },
  soundPing: { [Language.En]: "Ping", [Language.Zh]: "叮声" },
  soundScifi: { [Language.En]: "Sci-fi", [Language.Zh]: "科幻" },

  // Language card
  language: { [Language.En]: "Language", [Language.Zh]: "语言" },
  languageEn: { [Language.En]: "English", [Language.Zh]: "English" },
  languageZh: { [Language.En]: "中文", [Language.Zh]: "中文" },

  // Settings saved toast
  settingsSaved: {
    [Language.En]: "Settings saved",
    [Language.Zh]: "设置已保存",
  },

  // Working hours
  workingHours: {
    [Language.En]: "Working Hours",
    [Language.Zh]: "工作时间",
  },
  workingHoursHelper: {
    [Language.En]: "Only show breaks during your configured work schedule.",
    [Language.Zh]: "仅在配置的工作时间内显示休息提醒。",
  },

  // Work mode
  workMode: {
    [Language.En]: "Work Mode",
    [Language.Zh]: "办公模式",
  },
  workModeHelper: {
    [Language.En]:
      "Alternate between sitting and standing desk modes with different break frequencies.",
    [Language.Zh]: "在坐姿和站姿办公模式之间交替，每种模式设置不同的休息频率。",
  },
  sittingFrequency: {
    [Language.En]: "Sitting frequency",
    [Language.Zh]: "坐姿频率",
  },
  standingFrequency: {
    [Language.En]: "Standing frequency",
    [Language.Zh]: "站姿频率",
  },
  sitting: { [Language.En]: "Sitting", [Language.Zh]: "坐姿" },
  standing: { [Language.En]: "Standing", [Language.Zh]: "站姿" },
  nextWorkModeAfterBreak: {
    [Language.En]: "Next: {mode} mode",
    [Language.Zh]: "休息后: {mode}模式",
  },

  // Statistics
  tabStatistics: {
    [Language.En]: "Statistics",
    [Language.Zh]: "统计",
  },
  statsPeriodDay: { [Language.En]: "Day", [Language.Zh]: "日" },
  statsPeriodWeek: { [Language.En]: "Week", [Language.Zh]: "周" },
  statsPeriodMonth: { [Language.En]: "Month", [Language.Zh]: "月" },
  statsPeriodYear: { [Language.En]: "Year", [Language.Zh]: "年" },
  statsSittingTime: {
    [Language.En]: "Sitting time",
    [Language.Zh]: "坐姿时长",
  },
  statsStandingTime: {
    [Language.En]: "Standing time",
    [Language.Zh]: "站姿时长",
  },
  statsRatio: { [Language.En]: "Ratio", [Language.Zh]: "比例" },
  statsNoData: {
    [Language.En]: "No data for this period",
    [Language.Zh]: "该时段无数据",
  },
  statsWorkMode: {
    [Language.En]: "Work Mode",
    [Language.Zh]: "办公模式",
  },
  statsEnableWorkMode: {
    [Language.En]: "Enable Work Mode to start tracking",
    [Language.Zh]: "启用办公模式以开始记录",
  },
};

export function t(
  key: string,
  params?: Record<string, string | number>,
): string {
  const entry = translations[key];
  if (!entry) {
    return key;
  }
  let text = entry[currentLanguage] || entry[Language.En] || key;
  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      text = text.replace(`{${paramKey}}`, String(paramValue));
    }
  }
  return text;
}
