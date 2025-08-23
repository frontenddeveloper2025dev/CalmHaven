import { useQuery } from "@tanstack/react-query";
import { Leaf, Waves, Mountain } from "lucide-react";
import { format } from "date-fns";

export default function ProgressStats() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["/api/sessions"],
  });

  if (statsLoading || sessionsLoading) {
    return (
      <div className="space-y-6">
        {/* Stats Overview Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-effect rounded-2xl p-6 text-center">
              <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const recentSessions = sessions?.slice(0, 5) || [];

  const getSessionIcon = (sounds: string[]) => {
    if (sounds.includes("rain") || sounds.includes("birds")) {
      return <Leaf className="text-sage-600" />;
    } else if (sounds.includes("ocean") || sounds.includes("stream")) {
      return <Waves className="text-ocean-600" />;
    } else {
      return <Mountain className="text-earth-600" />;
    }
  };

  const getSessionIconBg = (sounds: string[]) => {
    if (sounds.includes("rain") || sounds.includes("birds")) {
      return "bg-gradient-to-br from-sage-100 to-sage-200";
    } else if (sounds.includes("ocean") || sounds.includes("stream")) {
      return "bg-gradient-to-br from-ocean-100 to-ocean-200";
    } else {
      return "bg-gradient-to-br from-earth-100 to-earth-200";
    }
  };

  return (
    <div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-effect rounded-2xl p-6 text-center">
          <div className="text-3xl font-light text-sage-600 mb-2" data-testid="stat-total-minutes">
            {stats?.totalMinutes || 0}
          </div>
          <div className="text-sm text-gray-600">Total Minutes</div>
        </div>
        
        <div className="glass-effect rounded-2xl p-6 text-center">
          <div className="text-3xl font-light text-ocean-600 mb-2" data-testid="stat-session-count">
            {stats?.sessionCount || 0}
          </div>
          <div className="text-sm text-gray-600">Sessions Completed</div>
        </div>
        
        <div className="glass-effect rounded-2xl p-6 text-center">
          <div className="text-3xl font-light text-earth-600 mb-2" data-testid="stat-streak-days">
            {stats?.streakDays || 0}
          </div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </div>
      </div>
      
      {/* Recent Sessions */}
      <div className="glass-effect rounded-2xl p-8">
        <h3 className="text-xl font-medium text-gray-800 mb-6">Recent Sessions</h3>
        
        {recentSessions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-2">No sessions completed yet</div>
            <div className="text-sm text-gray-400">Start your first meditation to see your progress here</div>
          </div>
        ) : (
          <div className="space-y-4">
            {recentSessions.map((session, index) => (
              <div 
                key={session.id} 
                className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0"
                data-testid={`session-item-${index}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getSessionIconBg(session.sounds || [])}`}>
                    {getSessionIcon(session.sounds || [])}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800" data-testid={`session-duration-${index}`}>
                      {Math.floor(session.duration / 60)} minutes
                    </div>
                    <div className="text-sm text-gray-500" data-testid={`session-sounds-${index}`}>
                      {session.sounds && session.sounds.length > 0 
                        ? session.sounds.join(", ") 
                        : "Silent meditation"}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500" data-testid={`session-date-${index}`}>
                  {format(new Date(session.createdAt), "MMM d, h:mm a")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
