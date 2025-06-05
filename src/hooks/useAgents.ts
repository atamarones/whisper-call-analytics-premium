
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

export interface Agent {
  id: string;
  name: string;
  description?: string;
  voice_name?: string;
  llm_provider?: string;
  llm_model?: string;
  is_active?: boolean;
  created_at?: string;
  total_conversations?: number;
  avg_duration?: number;
  avg_satisfaction?: number;
  avg_cost?: number;
  success_rate?: number;
  completed_conversations?: number;
  failed_conversations?: number;
}

export const useAgents = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['agents'],
    queryFn: async (): Promise<Agent[]> => {
      const token = await getToken({ template: 'supabase' });
      
      const { data, error } = await supabase.functions.invoke('get-agents', {
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
