import { HashRouter, Routes, Route} from 'react-router-dom'
import MainScreen from '@/features/main/MainScreen'
import SettingsScreen from '@/features/settings/SettingsScreen'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/main" element={<MainScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="*" element={<MainScreen />} />
      </Routes>
    </HashRouter>
  )
}

export default App
