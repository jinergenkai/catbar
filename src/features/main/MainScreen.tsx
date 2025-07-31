// Màn hình chính: hiển thị mèo, không headerbar, luôn on top taskbar, minimize
import CatSprite from '@/components/cat/CatSprite';
import './MainScreen.css';

export default function MainScreen() {
  return (
    <div className="main-screen">
      <CatSprite />
    </div>
  );
}