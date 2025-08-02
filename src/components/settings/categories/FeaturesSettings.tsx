import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Icon } from "@iconify/react";
import { useSettings } from "@/store/settings.sync";

export default function FeaturesSettings() {
  const {
    settings,
    setWeatherEnabled,
    setVocabularyEnabled,
    setWordsPerDay,
    setPomodoroMinutes,
  } = useSettings();

  return (
    <div id="features" className="space-y-4 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Tính năng</h2>

      <Card className="hover:shadow-lg transition-shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="mingcute:sunny-line" className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="font-medium">Dự báo thời tiết</div>
              <div className="text-sm text-muted-foreground">Hiển thị thông tin thời tiết</div>
            </div>
          </div>
          <Switch
            checked={settings.weatherEnabled}
            onCheckedChange={setWeatherEnabled}
          />
        </div>
      </Card>

      <Card className="hover:shadow-lg transition-shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="mingcute:book-3-line" className="w-5 h-5 text-emerald-500" />
            <div>
              <div className="font-medium">Học từ vựng</div>
              <div className="text-sm text-muted-foreground">Cài đặt học từ vựng hằng ngày</div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-4">
            <Switch
              checked={settings.vocabularyEnabled}
              onCheckedChange={setVocabularyEnabled}
            />
            {settings.vocabularyEnabled && (
              <Slider
                value={[settings.wordsPerDay]}
                onValueChange={([value]) => setWordsPerDay(value)}
                max={20}
                step={1}
                className="w-[200px]"
              />
            )}
          </div>
        </div>
      </Card>

      <Card className="hover:shadow-lg transition-shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="game-icons:tomato" className="w-5 h-5 text-red-500" />
            <div>
              <div className="font-medium">Pomodoro Timer</div>
              <div className="text-sm text-muted-foreground">Tùy chỉnh thời gian làm việc và giải lao</div>
            </div>
          </div>
          <Slider
            value={[settings.pomodoroMinutes]}
            onValueChange={([value]) => setPomodoroMinutes(value)}
            max={60}
            step={5}
            className="w-[200px]"
          />
        </div>
      </Card>
    </div>
  );
}