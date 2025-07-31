import SettingsLayout from "./SettingsLayout";
import GeneralSettings from "./categories/GeneralSettings";
import FeaturesSettings from "./categories/FeaturesSettings";
import InterfaceSettings from "./categories/InterfaceSettings";

export default function SettingsPanel() {
  return (
    <SettingsLayout>
      <div className="space-y-8">
        <GeneralSettings />
        <FeaturesSettings />
        <InterfaceSettings />
      </div>
    </SettingsLayout>
  );
}