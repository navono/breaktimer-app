import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { t } from "../../lib/i18n";

interface Props {
  handleSave: () => void;
  showSave: boolean;
}

export default function SettingsHeader(props: Props) {
  const { handleSave, showSave } = props;

  return (
    <div className="border-b border-border bg-background">
      <nav className="flex items-center justify-between p-4 h-16 min-h-16">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-foreground">
            {t("settings")}
          </h1>
        </div>
        {showSave && (
          <div className="flex items-center">
            <Button variant="outline" onClick={handleSave}>
              {t("save")}
            </Button>
          </div>
        )}
      </nav>
      <div className="px-4 pb-4">
        <TabsList
          className={`grid w-full ${
            processEnv.SNAP === undefined ? "grid-cols-4" : "grid-cols-3"
          }`}
        >
          <TabsTrigger value="break-settings">{t("tabGeneral")}</TabsTrigger>
          <TabsTrigger value="working-hours">
            {t("tabWorkingHours")}
          </TabsTrigger>
          <TabsTrigger value="customization">
            {t("tabCustomization")}
          </TabsTrigger>
          {processEnv.SNAP === undefined && (
            <TabsTrigger value="system">{t("tabSystem")}</TabsTrigger>
          )}
        </TabsList>
      </div>
    </div>
  );
}
