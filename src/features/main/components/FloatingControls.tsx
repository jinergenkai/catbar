import { useEffect, useState } from 'react';
import MusicControls from './MusicControls';
import PomodoroTimer from './PomodoroTimer';
import { getTaskbarHeight } from '../../../utils/system';

export default function FloatingControls() {
  const [height, setHeight] = useState(40);

  useEffect(() => {
    getTaskbarHeight().then(setHeight);
  }, []);

  return (
    <div
      className="fixed right-0 flex items-center gap-2 p-2 backdrop-blur-sm border-l border-border/50"
      style={{
        height: height,
        bottom: 0
      }}
    >
      <MusicControls />
      <PomodoroTimer />
    </div>
  );
}