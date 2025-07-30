import { useState } from 'react'
import MainScreen from '@/features/main/MainScreen'
import SettingsScreen from '@/features/settings/SettingsScreen'
import './App.css'

function App() {
  const [screen, setScreen] = useState<'main' | 'settings'>('main')

  return (
    <>
      <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 9999 }}>
        <button onClick={() => setScreen(screen === 'main' ? 'settings' : 'main')}>
          {screen === 'main' ? 'Cài đặt' : 'Quay lại'}
        </button>
      </div>
      {screen === 'main' ? <MainScreen /> : <SettingsScreen />}
    </>
  )
}

export default App
