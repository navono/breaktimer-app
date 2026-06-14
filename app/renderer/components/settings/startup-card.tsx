import SettingsCard from "./settings-card";
import { Settings } from "../../../types/settings";
import { t } from "../../lib/i18n";

interface StartupCardProps {
  settingsDraft: Settings;
  onSwitchChange: (field: string, checked: boolean) => void;
}

export default function StartupCard({
  settingsDraft,
  onSwitchChange,
}: StartupCardProps) {
  return (
    <SettingsCard
      title={t("startAtLogin")}
      helperText={t("startAtLoginHelper")}
      toggle={{
        checked: settingsDraft.autoLaunch,
        onCheckedChange: (checked) => onSwitchChange("autoLaunch", checked),
      }}
    />
  );
}
