import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Icon } from "@iconify/react";
import { useSettingsStore } from "@/store/settingsStore";

export default function InterfaceSettings() {
  const {
    showMusicButton, setShowMusicButton,
    showFeatureButton, setShowFeatureButton,
    notificationsEnabled, setNotificationsEnabled,
  } = useSettingsStore();

  return (
    <div id="interface" className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Giao diện</h2>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon="mingcute:button-line" className="w-5 h-5 text-blue-500" />
            Hiển thị nút
          </CardTitle>
          <CardDescription>Tùy chỉnh hiển thị các nút chức năng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon="mingcute:music-line" className="w-4 h-4 text-purple-500" />
              <Label>Nút nhạc</Label>
            </div>
            <Switch 
              checked={showMusicButton}
              onCheckedChange={setShowMusicButton}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon="mingcute:function-line" className="w-4 h-4 text-green-500" />
              <Label>Nút tính năng</Label>
            </div>
            <Switch 
              checked={showFeatureButton}
              onCheckedChange={setShowFeatureButton}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon="mingcute:notification-line" className="w-5 h-5 text-yellow-500" />
            Thông báo
          </CardTitle>
          <CardDescription>Tùy chỉnh cài đặt thông báo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon="mingcute:notification-fill" className="w-4 h-4 text-yellow-500" />
              <Label>Bật thông báo</Label>
            </div>
            <Switch 
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}