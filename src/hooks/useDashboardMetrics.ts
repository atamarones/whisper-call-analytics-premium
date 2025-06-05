
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardMetrics {
  totalMinutes: number;
  totalCalls: number;
  totalCost: number;
  avgCostPerCall: number;
  changes: {
    minutes: number;
    calls: number;
    cost: number;
    avgCost: number;
  };
}

export const useDashboardMetrics = () => {
  const { getToken, isLoaded } = useAuth();

  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async (): Promise<DashboardMetrics> => {
      try {
        const token = await getToken({ template: 'supabase' });
        
        if (!token) {
          throw new Error('No authentication token available');
        }
        
        const { data, error } = await supabase.functions.invoke('get-dashboard-metrics', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (error) {
          console.error('Error fetching dashboard metrics:', error);
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error('Dashboard metrics error:', error);
        throw error;
      }
    },
    enabled: isLoaded,
    refetchInterval: 5 * 60 * 1000,
    retry: 2,
  });
};
