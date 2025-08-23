import { useState, useEffect, useRef, useCallback } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useMeditationTimer(initialDuration: number) {
  const [timeRemaining, setTimeRemaining] = useState(initialDuration);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
  });

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await apiRequest("POST", "/api/sessions", sessionData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });

  const playBellSound = useCallback(() => {
    if (settings?.bellVolume && settings.bellVolume > 0) {
      const audio = new Audio('/sounds/bell.mp3');
      audio.volume = (settings.bellVolume || 60) / 100;
      audio.play().catch(error => {
        console.error('Error playing bell sound:', error);
      });
    }
  }, [settings?.bellVolume]);

  const playCompletionSound = useCallback(() => {
    if (settings?.sessionEndSound) {
      const audio = new Audio('/sounds/bell.mp3');
      audio.volume = 0.7;
      audio.play().catch(error => {
        console.error('Error playing completion sound:', error);
      });
    }
  }, [settings?.sessionEndSound]);

  const completeSession = useCallback(async () => {
    if (!sessionStartTime) return;

    const sessionData = {
      duration: initialDuration,
      sounds: [], // TODO: Get active sounds from audio context
      completed: true,
    };

    try {
      await createSessionMutation.mutateAsync(sessionData);
      toast({
        title: "Session Complete! 🧘‍♀️",
        description: `You meditated for ${Math.floor(initialDuration / 60)} minutes`,
      });
      playCompletionSound();
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }, [sessionStartTime, initialDuration, createSessionMutation, toast, playCompletionSound]);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          
          // Check for interval bell
          if (settings?.intervalBellFrequency && settings.intervalBellFrequency > 0) {
            const intervalSeconds = settings.intervalBellFrequency * 60;
            const elapsedTime = initialDuration - newTime;
            
            if (elapsedTime > 0 && elapsedTime % intervalSeconds === 0) {
              playBellSound();
            }
          }
          
          if (newTime <= 0) {
            setIsActive(false);
            setIsCompleted(true);
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeRemaining, settings?.intervalBellFrequency, initialDuration, playBellSound]);

  useEffect(() => {
    if (timeRemaining === 0 && isCompleted) {
      completeSession();
    }
  }, [timeRemaining, isCompleted, completeSession]);

  const startTimer = useCallback(() => {
    setIsActive(true);
    setIsCompleted(false);
    if (!sessionStartTime) {
      setSessionStartTime(new Date());
    }
  }, [sessionStartTime]);

  const pauseTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  const resetTimer = useCallback((newDuration?: number) => {
    setIsActive(false);
    setIsCompleted(false);
    setSessionStartTime(null);
    setTimeRemaining(newDuration || initialDuration);
  }, [initialDuration]);

  return {
    timeRemaining,
    isActive,
    isCompleted,
    startTimer,
    pauseTimer,
    resetTimer,
  };
}
