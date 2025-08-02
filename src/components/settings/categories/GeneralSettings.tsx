import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { useSettings } from "@/store/settings.sync";

export default function GeneralSettings() {
  const {
    settings,
    setBarSize,
    setLanguage,
    setTheme,
    setAutoExpand,
    setStartWithWindows,
  } = useSettings();

  return (
    <div id="general" className="space-y-4 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Cài đặt chung</h2>
      
      <Card className="hover:shadow-lg transition-shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="mingcute:paint-line" className="w-5 h-5 text-amber-500" />
            <div>
              <div className="font-medium">Giao diện</div>
              <div className="text-sm text-muted-foreground">Chọn chế độ sáng tối</div>
            </div>
          </div>
          <Select
            value={settings.theme}
            onValueChange={(value: "dark" | "light" | "system") => {
              setTheme(value);
            }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <div className="flex items-center gap-2">
                  <Icon icon="mingcute:sun-line" className="w-4 h-4" />
                  Sáng
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center gap-2">
                  <Icon icon="mingcute:moon-line" className="w-4 h-4" />
                  Tối
                </div>
              </SelectItem>
              <SelectItem value="system">
                <div className="flex items-center gap-2">
                  <Icon icon="mingcute:computer-line" className="w-4 h-4" />
                  Hệ thống
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="hover:shadow-lg transition-shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="mingcute:translate-line" className="w-5 h-5 text-indigo-500" />
            <div>
              <div className="font-medium">Ngôn ngữ</div>
              <div className="text-sm text-muted-foreground">Chọn ngôn ngữ hiển thị</div>
            </div>
          </div>
          <Select value={settings.language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
              <SelectItem value="en">🇬🇧 English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="hover:shadow-lg transition-shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="mingcute:windows-line" className="w-5 h-5 text-blue-500" />
            <div>
              <div className="font-medium">Khởi động cùng Windows</div>
              <div className="text-sm text-muted-foreground">Tự động chạy khi khởi động Windows</div>
            </div>
          </div>
          <Switch
            checked={settings.startWithWindows}
            onCheckedChange={setStartWithWindows}
          />
        </div>
      </Card>

      <Card className="hover:shadow-lg transition-shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="mingcute:ruler-line" className="w-5 h-5 text-pink-500" />
            <div>
              <div className="font-medium">Điều chỉnh kích thước</div>
              <div className="text-sm text-muted-foreground">Thay đổi kích thước của thanh điều khiển</div>
            </div>
          </div>
          <Slider
            value={[settings.barSize]}
            onValueChange={([value]) => setBarSize(value)}
            max={100}
            step={1}
            className="w-[200px]"
          />
        </div>
      </Card>

      <Card className="hover:shadow-lg transition-shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="mingcute:expand-line" className="w-5 h-5 text-teal-500" />
            <div>
              <div className="font-medium">Tự động mở rộng</div>
              <div className="text-sm text-muted-foreground">Tự động mở rộng khi di chuột</div>
            </div>
          </div>
          <Switch
            checked={settings.autoExpand}
            onCheckedChange={setAutoExpand}
          />
        </div>
      </Card>
    </div>
  );
}