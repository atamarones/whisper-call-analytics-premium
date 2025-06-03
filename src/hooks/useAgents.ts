
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Agent {
  id: string;
  name: string;
  description: string;
  voice_name: string;
  llm_provider: string;
  llm_model: string;
  is_active: boolean;
  created_at: string;
  total_conversations?: number;
  avg_duration?: number;
  success_rate?: number;
}

export const useAgents = () => {
  return useQuery({
    queryKey: ['agents'],
    queryFn: async (): Promise<Agent[]> => {
      const { data, error } = await supabase.functions.invoke('get-agents');
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5 * 60 * 1000,
  });
};
