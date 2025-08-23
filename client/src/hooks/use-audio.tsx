import { useState, useRef, useCallback } from "react";

interface AudioState {
  [key: string]: boolean;
}

export function useAudio() {
  const [playingAudio, setPlayingAudio] = useState<AudioState>({});
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const toggleAudio = useCallback((soundId: string, audioSrc: string) => {
    const isCurrentlyPlaying = playingAudio[soundId];

    if (isCurrentlyPlaying) {
      // Stop the audio
      if (audioRefs.current[soundId]) {
        audioRefs.current[soundId].pause();
        audioRefs.current[soundId].currentTime = 0;
      }
      setPlayingAudio(prev => ({ ...prev, [soundId]: false }));
    } else {
      // Start the audio
      if (!audioRefs.current[soundId]) {
        const audio = new Audio(audioSrc);
        audio.loop = true;
        audio.preload = "auto";
        audioRefs.current[soundId] = audio;

        audio.addEventListener('ended', () => {
          setPlayingAudio(prev => ({ ...prev, [soundId]: false }));
        });

        audio.addEventListener('error', (e) => {
          console.error(`Error loading audio for ${soundId}:`, e);
          setPlayingAudio(prev => ({ ...prev, [soundId]: false }));
        });
      }

      audioRefs.current[soundId].play().catch(error => {
        console.error(`Error playing audio for ${soundId}:`, error);
        setPlayingAudio(prev => ({ ...prev, [soundId]: false }));
      });

      setPlayingAudio(prev => ({ ...prev, [soundId]: true }));
    }
  }, [playingAudio]);

  const setVolume = useCallback((soundId: string, volume: number) => {
    if (audioRefs.current[soundId]) {
      audioRefs.current[soundId].volume = volume / 100;
    }
  }, []);

  const stopAllAudio = useCallback(() => {
    Object.keys(audioRefs.current).forEach(soundId => {
      if (audioRefs.current[soundId]) {
        audioRefs.current[soundId].pause();
        audioRefs.current[soundId].currentTime = 0;
      }
    });
    setPlayingAudio({});
  }, []);

  return {
    playingAudio,
    toggleAudio,
    setVolume,
    stopAllAudio,
  };
}
