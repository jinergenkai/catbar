// Màn hình chính: hiển thị mèo, không headerbar, luôn on top taskbar, minimize
import MainContent from './components/MainContent';
import FloatingControls from './components/FloatingControls';
import './MainScreen.css';
import { useSettings } from '@/store/settings.sync';

export default function MainScreen() {
  const { settings } = useSettings();

  return (
    <div className="fixed inset-0 main-screen">
      <div className="absolute top-0 left-0 bg-background text-foreground p-2">
        Current theme: {settings.theme}
      </div>
      <MainContent />
      <FloatingControls />
    </div>
  );
}