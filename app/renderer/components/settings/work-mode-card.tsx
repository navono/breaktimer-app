import { Label } from "@/components/ui/label";
import { Settings } from "../../../types/settings";
import { t } from "../../lib/i18n";
import SettingsCard from "./settings-card";
import TimeInput from "./time-input";

interface WorkModeCardProps {
  settingsDraft: Settings;
  onSwitchChange: (field: string, checked: boolean) => void;
  onWorkModeSecondsChange: (field: string, seconds: number) => void;
}

export default function WorkModeCard({
  settingsDraft,
  onSwitchChange,
  onWorkModeSecondsChange,
}: WorkModeCardProps) {
  return (
    <SettingsCard
      title={t("workMode")}
      helperText={t("workModeHelper")}
      toggle={{
        checked: settingsDraft.workModeEnabled,
        onCheckedChange: (checked) =>
          onSwitchChange("workModeEnabled", checked),
        disabled: !settingsDraft.breaksEnabled,
      }}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("sittingFrequency")}
            </Label>
            <TimeInput
              precision="seconds"
              value={settingsDraft.sittingFrequencySeconds}
              onChange={(seconds) =>
                onWorkModeSecondsChange("sittingFrequencySeconds", seconds)
              }
              disabled={
                !settingsDraft.workModeEnabled || !settingsDraft.breaksEnabled
              }
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("standingFrequency")}
            </Label>
            <TimeInput
              precision="seconds"
              value={settingsDraft.standingFrequencySeconds}
              onChange={(seconds) =>
                onWorkModeSecondsChange("standingFrequencySeconds", seconds)
              }
              disabled={
                !settingsDraft.workModeEnabled || !settingsDraft.breaksEnabled
              }
            />
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}
