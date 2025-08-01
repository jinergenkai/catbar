import { Button } from "@/components/ui/button";
import { PlayIcon, PauseIcon, SkipForwardIcon } from "lucide-react";
import { useState } from "react";

export default function MusicControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement music play/pause logic
  };

  const nextTrack = () => {
    // TODO: Implement next track logic
  };

  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-primary/20"
        onClick={togglePlay}
      >
        {isPlaying ? (
          <PauseIcon className="h-4 w-4" />
        ) : (
          <PlayIcon className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-primary/20"
        onClick={nextTrack}
      >
        <SkipForwardIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}