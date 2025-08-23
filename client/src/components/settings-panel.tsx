import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Shield, Download, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function SettingsPanel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { clearStorage, exportData } = useLocalStorage();

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
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved",
      });
    },
  });

  const handleBreathingRhythmChange = (rhythm: string) => {
    updateSettingsMutation.mutate({ breathingRhythm: rhythm });
  };

  const handleBreathingStyleChange = (style: string) => {
    updateSettingsMutation.mutate({ breathingStyle: style });
  };

  const handleNotificationChange = (setting: string, value: boolean) => {
    updateSettingsMutation.mutate({ [setting]: value });
  };

  const handleExportData = async () => {
    try {
      await exportData();
      toast({
        title: "Data exported",
        description: "Your session data has been downloaded",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClearData = async () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      try {
        await clearStorage();
        queryClient.invalidateQueries();
        toast({
          title: "Data cleared",
          description: "All your data has been cleared",
        });
      } catch (error) {
        toast({
          title: "Clear failed",
          description: "Failed to clear data. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Breathing Animation Settings */}
      <div className="glass-effect rounded-2xl p-8">
        <h3 className="text-xl font-medium text-gray-800 mb-6">Breathing Guide</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Breathing Rhythm</label>
            <Select 
              value={settings?.breathingRhythm || "4-7-8"} 
              onValueChange={handleBreathingRhythmChange}
            >
              <SelectTrigger data-testid="select-breathing-rhythm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4-4-4-4">4-4-4-4 (Balanced)</SelectItem>
                <SelectItem value="4-7-8">4-7-8 (Relaxing)</SelectItem>
                <SelectItem value="6-2-6-2">6-2-6-2 (Energizing)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Animation Style</label>
            <Select 
              value={settings?.breathingStyle || "circle"} 
              onValueChange={handleBreathingStyleChange}
            >
              <SelectTrigger data-testid="select-breathing-style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="circle">Expanding Circle</SelectItem>
                <SelectItem value="square">Square Breathing</SelectItem>
                <SelectItem value="wave">Wave Motion</SelectItem>
                <SelectItem value="lotus">Lotus Petals</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Notification Settings */}
      <div className="glass-effect rounded-2xl p-8">
        <h3 className="text-xl font-medium text-gray-800 mb-6">Notifications & Reminders</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-800">Daily Reminder</div>
              <div className="text-sm text-gray-600">Get reminded to meditate each day</div>
            </div>
            <Switch
              checked={settings?.dailyReminder || false}
              onCheckedChange={(checked) => handleNotificationChange('dailyReminder', checked)}
              data-testid="switch-daily-reminder"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-800">Session Complete Sound</div>
              <div className="text-sm text-gray-600">Play a gentle tone when session ends</div>
            </div>
            <Switch
              checked={settings?.sessionEndSound || false}
              onCheckedChange={(checked) => handleNotificationChange('sessionEndSound', checked)}
              data-testid="switch-session-end-sound"
            />
          </div>
        </div>
      </div>
      
      {/* Data & Privacy */}
      <div className="glass-effect rounded-2xl p-8">
        <h3 className="text-xl font-medium text-gray-800 mb-6">Privacy & Data</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-800">Local Storage Only</div>
              <div className="text-sm text-gray-600">All data stays on your device</div>
            </div>
            <div className="text-sage-600">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          
          <Button
            variant="outline"
            className="w-full bg-sage-100 hover:bg-sage-200 text-sage-800 border-sage-200"
            onClick={handleExportData}
            data-testid="button-export-data"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Session Data
          </Button>
          
          <Button
            variant="outline"
            className="w-full bg-red-100 hover:bg-red-200 text-red-800 border-red-200"
            onClick={handleClearData}
            data-testid="button-clear-data"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Data
          </Button>
        </div>
      </div>
    </div>
  );
}
