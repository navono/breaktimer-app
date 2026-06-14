import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play } from "lucide-react";
import { SoundType } from "../../types/settings";
import { t } from "../lib/i18n";

interface SoundSelectProps {
  value: SoundType;
  onChange: (value: SoundType) => void;
  disabled?: boolean;
  volume?: number;
}

export function SoundSelect({
  value,
  onChange,
  disabled,
  volume = 1,
}: SoundSelectProps) {
  const playSound = (soundType: SoundType) => {
    if (soundType === SoundType.None) return;
    ipcRenderer.invokeStartSound(soundType, volume);
  };

  return (
    <div className="flex gap-4">
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="flex-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={SoundType.None}>{t("soundNone")}</SelectItem>
          <SelectItem value={SoundType.Gong}>{t("soundGong")}</SelectItem>
          <SelectItem value={SoundType.Blip}>{t("soundBlip")}</SelectItem>
          <SelectItem value={SoundType.Bloop}>{t("soundBloop")}</SelectItem>
          <SelectItem value={SoundType.Ping}>{t("soundPing")}</SelectItem>
          <SelectItem value={SoundType.Scifi}>{t("soundScifi")}</SelectItem>
        </SelectContent>
      </Select>
      {value !== SoundType.None && (
        <Button
          size="icon"
          variant="ghost"
          disabled={disabled}
          onClick={() => playSound(value)}
        >
          <Play className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
