import { app, dialog, Menu, Tray } from "electron";
import log from "electron-log";
import moment from "moment";
import path from "path";
import packageJson from "../../../package.json";
import { TrayTextMode, WorkMode } from "../../types/settings";
import {
  checkIdle,
  checkInWorkingHours,
  getBreakTime,
  getTimeSinceLastCompletedBreak,
  getWorkMode,
  isHavingBreak,
  startBreakNow,
} from "./breaks";
import { t } from "./i18n";
import {
  getDisableEndTime,
  getSettings,
  setDisableEndTime,
  setSettings,
} from "./store";
import { closeBreakWindows, createSettingsWindow } from "./windows";

let tray: Tray;
let lastMinsLeft = 0;

const rootPath = path.dirname(app.getPath("exe"));
const resourcesPath =
  process.platform === "darwin"
    ? path.resolve(rootPath, "..", "Resources")
    : rootPath;

function checkDisableTimeout() {
  const disableEndTime = getDisableEndTime();

  if (disableEndTime && Date.now() >= disableEndTime) {
    setDisableEndTime(null);
    const settings = getSettings();
    setSettings({ ...settings, breaksEnabled: true });
    buildTray();
  }
}

function getDisableTimeRemaining(): string {
  const disableEndTime = getDisableEndTime();
  if (!disableEndTime) {
    return "";
  }

  const remainingMs = disableEndTime - Date.now();
  const remainingMinutes = Math.floor(remainingMs / 60000);
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingDisplayMinutes = remainingMinutes % 60;

  if (remainingMinutes < 1) {
    return "<1m";
  } else if (remainingHours > 0) {
    return `${remainingHours}h ${remainingDisplayMinutes}m`;
  } else {
    return `${remainingMinutes}m`;
  }
}

function formatCompactDuration(seconds: number): string {
  if (seconds < 60) {
    return "<1m";
  }

  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return minutes > 0 ? `${hours}h${minutes}m` : `${hours}h`;
  }

  return `${totalMinutes}m`;
}

function getTrayTitle(): string | null {
  const settings = getSettings();

  if (!settings.trayTextEnabled) return null;
  if (!settings.breaksEnabled) return null;
  if (!checkInWorkingHours()) return null;
  if (isHavingBreak()) return null;

  switch (settings.trayTextMode) {
    case TrayTextMode.TimeToNextBreak: {
      const breakTime = getBreakTime();

      if (breakTime === null) return null;

      const secondsLeft = Math.max(breakTime.diff(moment(), "seconds"), 0);
      const modePrefix = settings.workModeEnabled
        ? (getWorkMode() === WorkMode.Sitting ? "🪑" : "🧍") + " "
        : "";
      return ` ${modePrefix}${formatCompactDuration(secondsLeft)}`;
    }
    case TrayTextMode.TimeSinceLastBreak: {
      const secondsSinceLastBreak = getTimeSinceLastCompletedBreak();
      if (secondsSinceLastBreak === null) return null;
      const modePrefix = settings.workModeEnabled
        ? (getWorkMode() === WorkMode.Sitting ? "🪑" : "🧍") + " "
        : "";
      return ` ${modePrefix}${formatCompactDuration(secondsSinceLastBreak)}`;
    }
    default:
      return null;
  }
}

export function buildTray(): void {
  if (!tray) {
    let imgPath;

    if (process.platform === "darwin") {
      imgPath =
        process.env.NODE_ENV === "development"
          ? "resources/tray/tray-IconTemplate.png"
          : path.join(resourcesPath, "tray", "tray-IconTemplate.png");
    } else {
      imgPath =
        process.env.NODE_ENV === "development"
          ? "resources/tray/icon.png"
          : path.join(app.getAppPath(), "..", "tray", "icon.png");
    }

    tray = new Tray(imgPath);

    // On windows, context menu will not show on left click by default
    if (process.platform === "win32") {
      tray.on("click", () => {
        tray.popUpContextMenu();
      });
    }
  }

  let settings = getSettings();
  const breaksEnabled = settings.breaksEnabled;

  if (process.platform === "darwin") {
    const trayTitle = getTrayTitle();
    tray.setTitle(trayTitle ?? "", { fontType: "monospacedDigit" });
  }

  const setBreaksEnabled = (breaksEnabled: boolean): void => {
    if (breaksEnabled) {
      log.info("Enabled breaks");
      setDisableEndTime(null);
    } else if (isHavingBreak()) {
      closeBreakWindows();
    }

    settings = getSettings();
    setSettings({ ...settings, breaksEnabled });
    buildTray();
  };

  const disableIndefinitely = (): void => {
    log.info("Disabled breaks indefinitely");
    setBreaksEnabled(false);
  };

  const disableBreaksFor = (duration: number): void => {
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);
    const displayMinutes = minutes % 60;

    if (hours > 0) {
      log.info(`Disabled breaks for ${hours}h${displayMinutes}m`);
    } else {
      log.info(`Disabled breaks for ${minutes}m`);
    }

    setBreaksEnabled(false);
    const endTime = Date.now() + duration;
    setDisableEndTime(endTime);
    buildTray();
  };

  const createAboutWindow = (): void => {
    dialog.showMessageBox({
      title: "About",
      type: "info",
      message: `BreakTimer`,
      detail: `Build: ${packageJson.version}\n\nWebsite:\nhttps://breaktimer.app\n\nSource Code:\nhttps://github.com/tom-james-watson/breaktimer-app\n\nDistributed under GPL-3.0-or-later license.`,
    });
  };

  const quit = (): void => {
    setTimeout(() => {
      app.exit(0);
    });
  };

  const breakTime = getBreakTime();
  const inWorkingHours = checkInWorkingHours();
  const idle = checkIdle();
  const havingBreak = isHavingBreak();
  const minsLeft = breakTime?.diff(moment(), "minutes");

  let nextBreak = "";

  if (minsLeft !== undefined) {
    if (minsLeft > 1) {
      nextBreak = t("nextBreakInMinutes", { minutes: minsLeft });
    } else if (minsLeft === 1) {
      nextBreak = t("nextBreakIn1Minute");
    } else {
      nextBreak = t("nextBreakInLessThanAMinute");
    }
  }

  const disableEndTime = getDisableEndTime();

  const contextMenu = Menu.buildFromTemplate([
    {
      label: nextBreak,
      visible:
        breakTime !== null &&
        inWorkingHours &&
        settings.breaksEnabled &&
        !havingBreak,
      enabled: false,
    },
    {
      label: t("currentMode", {
        mode: getWorkMode() === WorkMode.Sitting ? t("sitting") : t("standing"),
      }),
      visible:
        settings.workModeEnabled &&
        breakTime !== null &&
        inWorkingHours &&
        settings.breaksEnabled &&
        !havingBreak,
      enabled: false,
    },
    {
      label: t("disabledFor", { time: getDisableTimeRemaining() }),
      visible: disableEndTime !== null && !breaksEnabled,
      enabled: false,
    },
    {
      label: t("outsideOfWorkingHours"),
      visible: !inWorkingHours,
      enabled: false,
    },
    {
      label: t("idle"),
      visible: idle,
      enabled: false,
    },
    { type: "separator" },
    {
      label: t("enable"),
      click: setBreaksEnabled.bind(null, true),
      visible: !breaksEnabled,
    },
    {
      label: t("disable"),
      submenu: [
        { label: t("indefinitely"), click: disableIndefinitely },
        {
          label: t("thirtyMinutes"),
          click: () => disableBreaksFor(30 * 60 * 1000),
        },
        { label: t("oneHour"), click: () => disableBreaksFor(60 * 60 * 1000) },
        {
          label: t("twoHours"),
          click: () => disableBreaksFor(2 * 60 * 60 * 1000),
        },
        {
          label: t("fourHours"),
          click: () => disableBreaksFor(4 * 60 * 60 * 1000),
        },
        {
          label: t("restOfDay"),
          click: () => {
            const now = new Date();
            const endOfDay = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              23,
              59,
              59,
            );
            disableBreaksFor(endOfDay.getTime() - now.getTime());
          },
        },
      ],
      visible: breaksEnabled,
    },
    {
      label: t("startBreakNow"),
      visible: breakTime !== null && inWorkingHours && !havingBreak,
      click: () => {
        log.info("Start break now selected");
        startBreakNow();
      },
    },
    { type: "separator" },
    { label: t("settings"), click: createSettingsWindow },
    { label: t("about"), click: createAboutWindow },
    { label: t("quit"), click: quit },
  ]);

  // Call this again for Linux because we modified the context menu
  tray.setContextMenu(contextMenu);
}

export function initTray(): void {
  buildTray();
  let lastDisableText = getDisableTimeRemaining();
  let lastTrayTitle = getTrayTitle();

  setInterval(() => {
    checkDisableTimeout();

    const currentDisableText = getDisableTimeRemaining();
    if (currentDisableText !== lastDisableText) {
      buildTray();
      lastDisableText = currentDisableText;
    }

    if (process.platform === "darwin") {
      const currentTrayTitle = getTrayTitle();
      if (currentTrayTitle !== lastTrayTitle) {
        buildTray();
        lastTrayTitle = currentTrayTitle;
      }
    }

    const breakTime = getBreakTime();
    if (breakTime === null) {
      return;
    }

    const minsLeft = breakTime.diff(moment(), "minutes");
    if (minsLeft !== lastMinsLeft) {
      buildTray();
      lastMinsLeft = minsLeft;
    }
  }, 5000);
}
