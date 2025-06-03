
import { useQuery } from '@tanstack/react-query';
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
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async (): Promise<DashboardMetrics> => {
      const { data, error } = await supabase.functions.invoke('get-dashboard-metrics');
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5 * 60 * 1000, // Refrescar cada 5 minutos
  });
};
