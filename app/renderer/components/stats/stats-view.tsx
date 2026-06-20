import { Card, CardContent } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import { Settings, WorkingHoursRange } from "../../../types/settings";
import { WorkModeSession } from "../../../types/stats";
import { t } from "../../lib/i18n";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";

type Period = "day" | "week" | "month" | "year";

interface ChartData {
  label: string;
  sitting: number;
  standing: number;
}

const periodLabels: Record<Period, string> = {
  day: "statsPeriodDay",
  week: "statsPeriodWeek",
  month: "statsPeriodMonth",
  year: "statsPeriodYear",
};

// Map day-of-week (0=Sun,1=Mon,...6=Sat) to settings key
const dayOfWeekToKey: Record<number, string> = {
  0: "workingHoursSunday",
  1: "workingHoursMonday",
  2: "workingHoursTuesday",
  3: "workingHoursWednesday",
  4: "workingHoursThursday",
  5: "workingHoursFriday",
  6: "workingHoursSaturday",
};

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) {
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${m}m`;
}

function formatMinutes(seconds: number): number {
  return Math.round(seconds / 60);
}

function getWorkingRangesForDay(
  settings: Settings,
  day: moment.Moment,
): WorkingHoursRange[] {
  if (!settings.workingHoursEnabled) return [];
  const key = dayOfWeekToKey[day.day()];
  const dayConfig = settings[key as keyof Settings];
  if (!dayConfig || typeof dayConfig !== "object" || !("enabled" in dayConfig))
    return [];
  if (!(dayConfig as { enabled: boolean }).enabled) return [];
  return (dayConfig as { ranges: WorkingHoursRange[] }).ranges;
}

function getPeriodRange(period: Period, offset: number) {
  const base = moment().startOf(period).add(offset, period);
  const start = base.clone().startOf(period);
  const end = base.clone().endOf(period);

  const bars: { start: moment.Moment; end: moment.Moment; label: string }[] =
    [];

  if (period === "week") {
    for (let d = 0; d < 7; d++) {
      const barStart = start.clone().add(d, "days");
      bars.push({
        start: barStart,
        end: barStart.clone().endOf("day"),
        label: barStart.format("ddd"),
      });
    }
  } else if (period === "month") {
    const daysInMonth = start.daysInMonth();
    for (let d = 0; d < daysInMonth; d++) {
      const barStart = start.clone().add(d, "days");
      bars.push({
        start: barStart,
        end: barStart.clone().endOf("day"),
        label: `${d + 1}`,
      });
    }
  } else {
    for (let m = 0; m < 12; m++) {
      const barStart = start.clone().add(m, "months");
      bars.push({
        start: barStart,
        end: barStart.clone().endOf("month"),
        label: barStart.format("MMM"),
      });
    }
  }

  return { start, end, bars, title: start.format(getTitleFormat(period)) };
}

function getTitleFormat(period: Period): string {
  switch (period) {
    case "day":
      return "YYYY-MM-DD";
    case "week":
      return "GGGG-[W]WW";
    case "month":
      return "YYYY-MM";
    case "year":
      return "YYYY";
  }
}

function aggregateSessions(
  sessions: WorkModeSession[],
  bars: { start: moment.Moment; end: moment.Moment; label: string }[],
): ChartData[] {
  return bars.map((bar) => {
    const barSessions = sessions.filter((s) => {
      const sessionStart = moment(s.start);
      return sessionStart >= bar.start && sessionStart <= bar.end;
    });

    const sitting = barSessions
      .filter((s) => s.mode === "SITTING")
      .reduce((sum, s) => sum + s.duration, 0);
    const standing = barSessions
      .filter((s) => s.mode === "STANDING")
      .reduce((sum, s) => sum + s.duration, 0);

    return {
      label: bar.label,
      sitting: formatMinutes(sitting),
      standing: formatMinutes(standing),
    };
  });
}

// Day timeline: render sessions as colored blocks on a working-hours axis
function DayTimeline({
  sessions,
  dayStart,
  workingRanges,
}: {
  sessions: WorkModeSession[];
  dayStart: moment.Moment;
  workingRanges: WorkingHoursRange[];
}) {
  // Calculate axis bounds from working hours ranges
  const axisFromMinutes =
    workingRanges.length > 0
      ? Math.min(...workingRanges.map((r) => r.fromMinutes))
      : 9 * 60;
  const axisToMinutes =
    workingRanges.length > 0
      ? Math.max(...workingRanges.map((r) => r.toMinutes))
      : 18 * 60;

  const dayStartOfDay = dayStart.clone().startOf("day");
  const axisStartMs = dayStartOfDay.valueOf() + axisFromMinutes * 60 * 1000;
  const axisEndMs = dayStartOfDay.valueOf() + axisToMinutes * 60 * 1000;
  const totalMs = axisEndMs - axisStartMs;

  // Hour markers within axis range
  const firstHour = Math.floor(axisFromMinutes / 60);
  const lastHour = Math.ceil(axisToMinutes / 60);
  const hours = Array.from(
    { length: lastHour - firstHour + 1 },
    (_, i) => firstHour + i,
  );

  // Map sessions to positioned blocks
  const blocks = sessions
    .map((s) => {
      const startMs = moment(s.start).valueOf();
      const endMs = startMs + s.duration * 1000;

      const clampedStart = Math.max(startMs, axisStartMs);
      const clampedEnd = Math.min(endMs, axisEndMs);
      if (clampedStart >= clampedEnd) return null;

      const leftPercent = ((clampedStart - axisStartMs) / totalMs) * 100;
      const widthPercent = ((clampedEnd - clampedStart) / totalMs) * 100;

      return {
        mode: s.mode,
        leftPercent,
        widthPercent,
        startLabel: moment(s.start).format("HH:mm"),
        endLabel: moment(endMs).format("HH:mm"),
        duration: s.duration,
      };
    })
    .filter(Boolean) as {
    mode: string;
    leftPercent: number;
    widthPercent: number;
    startLabel: string;
    endLabel: string;
    duration: number;
  }[];

  return (
    <div className="space-y-2">
      <div className="relative h-10 rounded-md bg-muted overflow-hidden">
        {blocks.map((block, i) => (
          <div
            key={i}
            className="absolute top-0 h-full"
            style={{
              left: `${block.leftPercent}%`,
              width: `${block.widthPercent}%`,
              backgroundColor: block.mode === "SITTING" ? "#3b82f6" : "#22c55e",
              opacity: 0.85,
              minWidth: block.widthPercent < 0.5 ? "2px" : undefined,
            }}
            title={`${block.mode === "SITTING" ? t("sitting") : t("standing")}: ${block.startLabel} - ${block.endLabel} (${formatDuration(block.duration)})`}
          />
        ))}
      </div>

      <div className="relative h-5">
        {hours.map((h) => {
          const minuteOffset = h * 60 - axisFromMinutes;
          const leftPercent =
            (minuteOffset / (axisToMinutes - axisFromMinutes)) * 100;
          const isLast = h === hours[hours.length - 1];
          return (
            <div
              key={h}
              className="absolute text-[10px] text-muted-foreground"
              style={{
                left: `${leftPercent}%`,
                transform: isLast ? "translateX(-100%)" : "translateX(-50%)",
              }}
            >
              {h}:00
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 justify-center pt-1">
        <div className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: "#3b82f6" }}
          />
          <span className="text-xs text-muted-foreground">{t("sitting")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: "#22c55e" }}
          />
          <span className="text-xs text-muted-foreground">{t("standing")}</span>
        </div>
      </div>
    </div>
  );
}

export default function StatsView() {
  const [period, setPeriod] = useState<Period>("day");
  const [offset, setOffset] = useState(0);
  const [sessions, setSessions] = useState<WorkModeSession[]>([]);
  const [settings, setSettingsState] = useState<Settings | null>(null);

  const workModeEnabled = settings?.workModeEnabled ?? false;

  useEffect(() => {
    const loadData = async () => {
      const s = (await ipcRenderer.invokeGetSettings()) as Settings;
      setSettingsState(s);

      if (!s.workModeEnabled) return;

      if (period === "day") {
        const dayStart = moment().startOf("day").add(offset, "days");
        const stats = (await ipcRenderer.invokeGetWorkModeStats(
          dayStart.toISOString(),
          dayStart.clone().endOf("day").toISOString(),
        )) as WorkModeSession[];
        setSessions(stats || []);
      } else {
        const { start: rangeStart, end: rangeEnd } = getPeriodRange(
          period,
          offset,
        );
        const stats = (await ipcRenderer.invokeGetWorkModeStats(
          rangeStart.toISOString(),
          rangeEnd.toISOString(),
        )) as WorkModeSession[];
        setSessions(stats || []);
      }
    };
    loadData();
  }, [period, offset]);

  const dayStart = moment().startOf("day").add(offset, "days");
  const dayTitle = dayStart.format("YYYY-MM-DD");

  const { bars, title: periodTitle } =
    period !== "day"
      ? getPeriodRange(period, offset)
      : { bars: [], title: dayTitle };
  const title = periodTitle;

  const chartData = period !== "day" ? aggregateSessions(sessions, bars) : [];

  const totalSitting = sessions
    .filter((s) => s.mode === "SITTING")
    .reduce((sum, s) => sum + s.duration, 0);
  const totalStanding = sessions
    .filter((s) => s.mode === "STANDING")
    .reduce((sum, s) => sum + s.duration, 0);
  const ratio =
    totalStanding > 0
      ? `${Math.round((totalSitting / totalStanding) * 10) / 10}:1`
      : totalSitting > 0
        ? "∞:0"
        : "-";

  if (!workModeEnabled) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">{t("statsWorkMode")}</p>
        <p className="text-sm mt-2">{t("statsEnableWorkMode")}</p>
      </div>
    );
  }

  const hasData = sessions.length > 0;

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {(["day", "week", "month", "year"] as Period[]).map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setPeriod(p);
                setOffset(0);
              }}
            >
              {t(periodLabels[p])}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOffset((o) => o - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[100px] text-center">
            {title}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOffset((o) => o + 1)}
            disabled={offset >= 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">
              {t("statsSittingTime")}
            </p>
            <p className="text-2xl font-bold">
              {hasData ? formatDuration(totalSitting) : "-"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">
              {t("statsStandingTime")}
            </p>
            <p className="text-2xl font-bold">
              {hasData ? formatDuration(totalStanding) : "-"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">{t("statsRatio")}</p>
            <p className="text-2xl font-bold">{hasData ? ratio : "-"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {period === "day" ? (
        hasData ? (
          <Card>
            <CardContent className="pt-6">
              <DayTimeline
                sessions={sessions}
                dayStart={dayStart}
                workingRanges={
                  settings ? getWorkingRangesForDay(settings, dayStart) : []
                }
              />
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <p>{t("statsNoData")}</p>
          </div>
        )
      ) : hasData ? (
        <Card>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12 }}
                  interval={period === "month" ? 4 : 0}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v: number) => `${v}m`}
                />
                <Tooltip
                  formatter={(value: unknown, name: unknown) => [
                    `${value}m`,
                    name === "sitting" ? t("sitting") : t("standing"),
                  ]}
                />
                <Bar
                  dataKey="sitting"
                  stackId="a"
                  fill="#3b82f6"
                  name="sitting"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="standing"
                  stackId="a"
                  fill="#22c55e"
                  name="standing"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <p>{t("statsNoData")}</p>
        </div>
      )}
    </div>
  );
}
