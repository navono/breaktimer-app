import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Language } from "../../../types/settings";
import { t } from "../../lib/i18n";
import SettingsCard from "./settings-card";

interface LanguageCardProps {
  settingsDraft: { language: Language };
  onLanguageChange: (language: Language) => void;
}

export default function LanguageCard({
  settingsDraft,
  onLanguageChange,
}: LanguageCardProps) {
  return (
    <SettingsCard title={t("language")}>
      <Select
        value={settingsDraft.language}
        onValueChange={(value) => onLanguageChange(value as Language)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={Language.En}>{t("languageEn")}</SelectItem>
          <SelectItem value={Language.Zh}>{t("languageZh")}</SelectItem>
        </SelectContent>
      </Select>
    </SettingsCard>
  );
}
