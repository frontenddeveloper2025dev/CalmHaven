import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface BreathingPhase {
  name: string;
  duration: number;
}

export default function BreathingAnimation() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
  });

  const getBreathingPattern = (rhythm: string): BreathingPhase[] => {
    switch (rhythm) {
      case "4-4-4-4":
        return [
          { name: "Breathe In", duration: 4000 },
          { name: "Hold", duration: 4000 },
          { name: "Breathe Out", duration: 4000 },
          { name: "Hold", duration: 4000 },
        ];
      case "4-7-8":
        return [
          { name: "Breathe In", duration: 4000 },
          { name: "Hold", duration: 7000 },
          { name: "Breathe Out", duration: 8000 },
        ];
      case "6-2-6-2":
        return [
          { name: "Breathe In", duration: 6000 },
          { name: "Hold", duration: 2000 },
          { name: "Breathe Out", duration: 6000 },
          { name: "Hold", duration: 2000 },
        ];
      default:
        return [
          { name: "Breathe In", duration: 4000 },
          { name: "Hold", duration: 7000 },
          { name: "Breathe Out", duration: 8000 },
        ];
    }
  };

  const breathingPattern = getBreathingPattern(settings?.breathingRhythm || "4-7-8");
  const currentBreathingPhase = breathingPattern[currentPhase];

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % breathingPattern.length);
    }, currentBreathingPhase.duration);

    return () => clearInterval(timer);
  }, [currentPhase, breathingPattern.length, currentBreathingPhase.duration, isActive]);

  const getAnimationClass = () => {
    if (!isActive) return "";
    
    switch (currentBreathingPhase.name) {
      case "Breathe In":
        return "animate-breathe-in";
      case "Breathe Out":
        return "animate-breathe-out";
      default:
        return "animate-pulse-gentle";
    }
  };

  const toggleBreathing = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setCurrentPhase(0);
    }
  };

  return (
    <div className="relative">
      <div 
        className={`w-64 h-64 breathing-circle rounded-full flex items-center justify-center cursor-pointer ${getAnimationClass()}`}
        onClick={toggleBreathing}
        data-testid="breathing-circle"
      >
        <div className="w-32 h-32 bg-gradient-to-br from-sage-300 to-ocean-300 rounded-full flex items-center justify-center animate-pulse-gentle">
          <span className="text-white font-light text-sm" data-testid="text-breathing-phase">
            {isActive ? currentBreathingPhase.name : "Tap to Start"}
          </span>
        </div>
      </div>
      
      {/* Breathing guide rings */}
      <div className="absolute inset-0 rounded-full border border-sage-200/40 animate-pulse-gentle pointer-events-none"></div>
      <div 
        className="absolute inset-4 rounded-full border border-sage-200/30 animate-pulse-gentle pointer-events-none" 
        style={{ animationDelay: "0.5s" }}
      ></div>
      
      {isActive && (
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-600">
            Phase: {currentPhase + 1} of {breathingPattern.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.ceil(currentBreathingPhase.duration / 1000)}s
          </div>
        </div>
      )}
    </div>
  );
}
