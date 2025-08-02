import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Icon } from "@iconify/react";
import { useSettings } from "@/store/settings.sync";

export default function InterfaceSettings() {
  const {
    settings,
    setShowMusicButton,
    setShowFeatureButton,
    setNotificationsEnabled,
  } = useSettings();

  return (
    <div id="interface" className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Giao diện</h2>

      <Card className="hover:shadow-lg transition-shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="mingcute:music-line" className="w-5 h-5 text-purple-500" />
            <div>
              <div className="font-medium">Nút nhạc</div>
              <div className="text-sm text-muted-foreground">Hiển thị nút điều khiển nhạc</div>
            </div>
          </div>
          <Switch
            checked={settings.showMusicButton}
            onCheckedChange={setShowMusicButton}
          />
        </div>
      </Card>

      <Card className="hover:shadow-lg transition-shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="mingcute:function-line" className="w-5 h-5 text-green-500" />
            <div>
              <div className="font-medium">Nút tính năng</div>
              <div className="text-sm text-muted-foreground">Hiển thị nút truy cập tính năng</div>
            </div>
          </div>
          <Switch
            checked={settings.showFeatureButton}
            onCheckedChange={setShowFeatureButton}
          />
        </div>
      </Card>

      <Card className="hover:shadow-lg transition-shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="mingcute:notification-line" className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="font-medium">Thông báo</div>
              <div className="text-sm text-muted-foreground">Tùy chỉnh cài đặt thông báo</div>
            </div>
          </div>
          <Switch
            checked={settings.notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />
        </div>
      </Card>
    </div>
  );
}