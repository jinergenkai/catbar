import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom'
import MainScreen from '@/features/main/MainScreen'
import SettingsScreen from '@/features/settings/SettingsScreen'
import './App.css'

function App() {
  return (
    <HashRouter>
      <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 9999 }}>
        <NavButton />
      </div>
      <Routes>
        <Route path="/main" element={<MainScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="*" element={<MainScreen />} />
      </Routes>
    </HashRouter>
  )
}

// Nút chuyển qua lại giữa hai màn hình
function NavButton() {
  const navigate = useNavigate()
  const isMain = window.location.hash.includes('/main')
  return (
    <button onClick={() => navigate(isMain ? '/settings' : '/main')}>
      {isMain ? 'Cài đặt' : 'Quay lại'}
    </button>
  )
}

export default App
