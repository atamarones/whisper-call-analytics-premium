
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
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async (): Promise<DashboardMetrics> => {
      const token = await getToken({ template: 'supabase' });
      
      const { data, error } = await supabase.functions.invoke('get-dashboard-metrics', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5 * 60 * 1000,
  });
};
