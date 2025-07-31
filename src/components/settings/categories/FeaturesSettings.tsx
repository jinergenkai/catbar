import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Icon } from "@iconify/react";
import { useSettingsStore } from "@/store/settingsStore";

export default function FeaturesSettings() {
  const {
    weatherEnabled, setWeatherEnabled,
    vocabularyEnabled, setVocabularyEnabled,
    wordsPerDay, setWordsPerDay,
    pomodoroMinutes, setPomodoroMinutes,
  } = useSettingsStore();

  return (
    <div id="features" className="space-y-4 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Tính năng</h2>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon="mingcute:sunny-line" className="w-5 h-5 text-yellow-500" />
            Dự báo thời tiết
          </CardTitle>
          <CardDescription>Hiển thị thông tin thời tiết</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label>Bật dự báo thời tiết</Label>
            <Switch 
              checked={weatherEnabled}
              onCheckedChange={setWeatherEnabled}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon="mingcute:book-3-line" className="w-5 h-5 text-emerald-500" />
            Học từ vựng
          </CardTitle>
          <CardDescription>Cài đặt học từ vựng hằng ngày</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Bật học từ vựng</Label>
            <Switch 
              checked={vocabularyEnabled}
              onCheckedChange={setVocabularyEnabled}
            />
          </div>
          {vocabularyEnabled && (
            <div className="space-y-2">
              <Label>Số từ mới mỗi ngày</Label>
              <Slider 
                value={[wordsPerDay]} 
                onValueChange={([value]) => setWordsPerDay(value)}
                max={20} 
                step={1} 
                className="w-full" 
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon="game-icons:tomato" className="w-5 h-5 text-red-500" />
            Pomodoro Timer
          </CardTitle>
          <CardDescription>Tùy chỉnh thời gian làm việc và giải lao</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Icon icon="game-icons:tomato" className="w-4 h-4 text-red-400" />
              Thời gian làm việc (phút)
            </Label>
            <Slider 
              value={[pomodoroMinutes]} 
              onValueChange={([value]) => setPomodoroMinutes(value)}
              max={60} 
              step={5} 
              className="w-full" 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}