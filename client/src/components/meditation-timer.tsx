import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { useMeditationTimer } from "@/hooks/use-meditation-timer";

const timerPresets = [5, 10, 15, 20];

export default function MeditationTimer() {
  const [selectedDuration, setSelectedDuration] = useState(10);
  const { 
    timeRemaining, 
    isActive, 
    isCompleted,
    startTimer, 
    pauseTimer, 
    resetTimer 
  } = useMeditationTimer(selectedDuration * 60);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePresetClick = (duration: number) => {
    setSelectedDuration(duration);
    resetTimer(duration * 60);
  };

  const handleToggleTimer = () => {
    if (isActive) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  return (
    <div>
      {/* Timer Presets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {timerPresets.map((duration) => (
          <Button
            key={duration}
            variant={selectedDuration === duration ? "default" : "outline"}
            className={`nav-transition ${
              selectedDuration === duration
                ? "bg-sage-400 hover:bg-sage-500 text-white"
                : "bg-sage-100 hover:bg-sage-200 text-sage-800"
            }`}
            onClick={() => handlePresetClick(duration)}
            disabled={isActive}
            data-testid={`button-preset-${duration}`}
          >
            {duration} min
          </Button>
        ))}
      </div>
      
      {/* Play/Pause Controls */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="ghost"
          size="lg"
          className="w-16 h-16 bg-gradient-to-br from-sage-400 to-ocean-400 hover:from-sage-500 hover:to-ocean-500 text-white rounded-full shadow-lg"
          onClick={handleToggleTimer}
          data-testid="button-toggle-timer"
        >
          {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>
        
        <div className="text-center">
          <div className="text-3xl font-light text-gray-800" data-testid="text-timer-display">
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-gray-500">
            {isCompleted ? "Session Complete!" : "minutes remaining"}
          </div>
        </div>
      </div>

      {isActive && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => resetTimer(selectedDuration * 60)}
            data-testid="button-reset-timer"
          >
            Reset
          </Button>
        </div>
      )}
    </div>
  );
}
