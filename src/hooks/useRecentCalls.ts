
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RecentCall {
  id: number;
  number: string;
  duration: string;
  cost: string;
  status: string;
}

export const useRecentCalls = () => {
  return useQuery({
    queryKey: ['recent-calls'],
    queryFn: async (): Promise<RecentCall[]> => {
      const { data, error } = await supabase.functions.invoke('get-recent-calls');
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 2 * 60 * 1000, // Refrescar cada 2 minutos
  });
};
