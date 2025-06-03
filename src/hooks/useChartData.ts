
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ChartDataPoint {
  name: string;
  current: number;
  previous: number;
}

export const useChartData = () => {
  return useQuery({
    queryKey: ['chart-data'],
    queryFn: async (): Promise<ChartDataPoint[]> => {
      const { data, error } = await supabase.functions.invoke('get-chart-data');
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5 * 60 * 1000,
  });
};
