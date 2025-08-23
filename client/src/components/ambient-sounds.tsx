import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";
import { apiRequest } from "@/lib/queryClient";

const sounds = [
  {
    id: "rain",
    name: "Forest Rain",
    description: "Gentle rainfall through tree canopy",
    image: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    color: "ocean",
  },
  {
    id: "ocean",
    name: "Ocean Waves",
    description: "Rhythmic waves on the shore",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    color: "ocean",
  },
  {
    id: "birds",
    name: "Forest Birds",
    description: "Gentle chirping and rustling leaves",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    color: "sage",
  },
  {
    id: "stream",
    name: "Mountain Stream",
    description: "Babbling brook over stones",
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    color: "ocean",
  },
  {
    id: "chimes",
    name: "Wind Chimes",
    description: "Soft melodic tones in the breeze",
    image: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    color: "earth",
  },
  {
    id: "bowls",
    name: "Tibetan Bowls",
    description: "Deep resonant healing tones",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    color: "earth",
  },
];

export default function AmbientSounds() {
  const queryClient = useQueryClient();
  const { playingAudio, toggleAudio, setVolume } = useAudio();

  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: any) => {
      const response = await apiRequest("PATCH", "/api/settings", updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  const handleVolumeChange = (soundId: string, volume: number) => {
    setVolume(soundId, volume);
    
    const newSoundVolumes = {
      ...settings?.soundVolumes,
      [soundId]: volume,
    };
    
    updateSettingsMutation.mutate({
      soundVolumes: newSoundVolumes,
    });
  };

  const handleIntervalBellChange = (frequency: string) => {
    updateSettingsMutation.mutate({
      intervalBellFrequency: parseInt(frequency),
    });
  };

  const handleBellVolumeChange = (volume: number) => {
    updateSettingsMutation.mutate({
      bellVolume: volume,
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sounds.map((sound, index) => (
          <div 
            key={sound.id} 
            className="glass-effect rounded-2xl p-6 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <img 
              src={sound.image} 
              alt={sound.description} 
              className="w-full h-32 object-cover rounded-xl mb-4" 
            />
            <h3 className="text-lg font-medium text-gray-800 mb-2">{sound.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{sound.description}</p>
            
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  sound.color === "ocean" 
                    ? "bg-ocean-100 hover:bg-ocean-200 text-ocean-600" 
                    : sound.color === "sage"
                    ? "bg-sage-100 hover:bg-sage-200 text-sage-600"
                    : "bg-earth-100 hover:bg-earth-200 text-earth-600"
                }`}
                onClick={() => toggleAudio(sound.id, `/sounds/${sound.id}.mp3`)}
                data-testid={`button-toggle-${sound.id}`}
              >
                {playingAudio[sound.id] ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <div className="flex-1 mx-3">
                <Slider
                  value={[settings?.soundVolumes?.[sound.id] || 0]}
                  onValueChange={([value]) => handleVolumeChange(sound.id, value)}
                  max={100}
                  step={1}
                  className={`${
                    sound.color === "ocean" ? "accent-ocean-400" : 
                    sound.color === "sage" ? "accent-sage-400" : "accent-earth-400"
                  }`}
                  data-testid={`slider-volume-${sound.id}`}
                />
              </div>
              
              <span className="text-sm text-gray-500 w-10 text-right" data-testid={`text-volume-${sound.id}`}>
                {settings?.soundVolumes?.[sound.id] || 0}%
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Interval Bell Settings */}
      <div className="glass-effect rounded-2xl p-8 mt-12 animate-fade-in">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Interval Bells</h3>
            <p className="text-gray-600 text-sm">Gentle chimes to guide your meditation</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <label className="text-sm text-gray-600">Every</label>
              <Select 
                value={settings?.intervalBellFrequency?.toString() || "5"} 
                onValueChange={handleIntervalBellChange}
              >
                <SelectTrigger className="w-20" data-testid="select-bell-frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Off</SelectItem>
                  <SelectItem value="1">1 min</SelectItem>
                  <SelectItem value="2">2 min</SelectItem>
                  <SelectItem value="5">5 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-3">
              <label className="text-sm text-gray-600">Volume</label>
              <Slider
                value={[settings?.bellVolume || 60]}
                onValueChange={([value]) => handleBellVolumeChange(value)}
                max={100}
                step={1}
                className="w-20 accent-sage-400"
                data-testid="slider-bell-volume"
              />
              <span className="text-sm text-gray-500 w-8" data-testid="text-bell-volume">
                {settings?.bellVolume || 60}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
