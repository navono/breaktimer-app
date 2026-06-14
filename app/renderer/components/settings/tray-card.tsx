import { FormGroup } from "@/components/ui/form-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, TrayTextMode } from "../../../types/settings";
import { t } from "../../lib/i18n";
import SettingsCard from "./settings-card";

interface TrayCardProps {
  settingsDraft: Settings;
  onSwitchChange: (field: string, checked: boolean) => void;
  onTrayTextModeChange: (value: string) => void;
}

export default function TrayCard({
  settingsDraft,
  onSwitchChange,
  onTrayTextModeChange,
}: TrayCardProps) {
  return (
    <SettingsCard
      title={t("menuBarText")}
      helperText={t("menuBarTextHelper")}
      toggle={{
        checked: settingsDraft.trayTextEnabled,
        onCheckedChange: (checked) =>
          onSwitchChange("trayTextEnabled", checked),
      }}
    >
      <FormGroup label={t("text")}>
        <Select
          value={settingsDraft.trayTextMode}
          disabled={!settingsDraft.trayTextEnabled}
          onValueChange={onTrayTextModeChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TrayTextMode.TimeToNextBreak}>
              {t("timeToNextBreak")}
            </SelectItem>
            <SelectItem value={TrayTextMode.TimeSinceLastBreak}>
              {t("timeSinceLastBreak")}
            </SelectItem>
          </SelectContent>
        </Select>
      </FormGroup>
    </SettingsCard>
  );
}
