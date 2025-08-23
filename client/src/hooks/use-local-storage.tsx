import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useLocalStorage() {
  const queryClient = useQueryClient();

  const exportData = async () => {
    try {
      // Get all sessions and stats
      const sessions = await queryClient.fetchQuery({
        queryKey: ["/api/sessions"],
      });
      
      const stats = await queryClient.fetchQuery({
        queryKey: ["/api/stats"],
      });
      
      const settings = await queryClient.fetchQuery({
        queryKey: ["/api/settings"],
      });

      const exportData = {
        sessions,
        stats,
        settings,
        exportDate: new Date().toISOString(),
        version: "1.0",
      };

      // Create and download file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `serene-meditation-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  };

  const clearStorage = async () => {
    try {
      // Clear all cached data
      queryClient.clear();
      
      // Clear any localStorage items if needed
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('serene-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Note: In a real app with a database, you'd make API calls to delete data
      // For now, we'll just invalidate queries which will reset to default state
      queryClient.invalidateQueries();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  };

  return {
    exportData,
    clearStorage,
  };
}
