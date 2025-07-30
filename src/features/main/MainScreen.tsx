// Màn hình chính: hiển thị mèo, không headerbar, luôn on top taskbar, minimize
import CatSprite from '@/components/cat/CatSprite';

export default function MainScreen() {
  // TODO: Thêm logic on top taskbar, minimize
  return (
    <div style={{
      background: 'transparent',
      width: '100%',
      height: '40px',
      overflow: 'hidden',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0
    }}>
      <CatSprite />
    </div>
  );
}