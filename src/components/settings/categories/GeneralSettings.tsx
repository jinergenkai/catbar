import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { useSettingsStore } from "@/store/settingsStore";

export default function GeneralSettings() {
  const {
    barSize, setBarSize,
    language, setLanguage,
    autoExpand, setAutoExpand,
    startWithWindows, setStartWithWindows,
  } = useSettingsStore();

  return (
    <div id="general" className="space-y-4 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Cài đặt chung</h2>
      
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon="mingcute:translate-line" className="w-5 h-5 text-indigo-500" />
            Ngôn ngữ
          </CardTitle>
          <CardDescription>Chọn ngôn ngữ hiển thị</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
              <SelectItem value="en">🇬🇧 English</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon="mingcute:windows-line" className="w-5 h-5 text-blue-500" />
            Khởi động cùng Windows
          </CardTitle>
          <CardDescription>Tự động chạy khi khởi động Windows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label>Khởi động cùng Windows</Label>
            <Switch 
              checked={startWithWindows}
              onCheckedChange={setStartWithWindows}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon="mingcute:ruler-line" className="w-5 h-5 text-pink-500" />
            Điều chỉnh kích thước
          </CardTitle>
          <CardDescription>Thay đổi kích thước của thanh điều khiển</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Kích thước thanh điều khiển</Label>
            <Slider 
              value={[barSize]} 
              onValueChange={([value]) => setBarSize(value)} 
              max={100} 
              step={1} 
              className="w-full" 
            />
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon="mingcute:expand-line" className="w-5 h-5 text-teal-500" />
            Tự động mở rộng
          </CardTitle>
          <CardDescription>Tự động mở rộng khi di chuột</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label>Bật tự động mở rộng</Label>
            <Switch 
              checked={autoExpand}
              onCheckedChange={setAutoExpand}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}