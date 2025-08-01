import MusicControls from './MusicControls';
import PomodoroTimer from './PomodoroTimer';

export default function FloatingControls() {
  return (
    <div className="fixed right-2 bottom-2 flex flex-col gap-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50">
      <MusicControls />
      <PomodoroTimer />
    </div>
  );
}