// Màn hình chính: hiển thị mèo, không headerbar, luôn on top taskbar, minimize
import MainContent from './components/MainContent';
import FloatingControls from './components/FloatingControls';
import './MainScreen.css';

export default function MainScreen() {
  return (
    <div className="fixed inset-0 main-screen">
      <MainContent />
      <FloatingControls />
    </div>
  );
}