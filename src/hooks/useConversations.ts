
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Conversation {
  id: string;
  conversation_id: string;
  agent_id: string;
  phone_number: string;
  first_name: string;
  email: string;
  call_duration_secs: number;
  cost_cents: number;
  call_successful: string;
  start_time_unix_secs: number;
  created_at: string;
}

export interface ConversationFilters {
  dateFrom?: string;
  dateTo?: string;
  agentId?: string;
  status?: string;
}

export const useConversations = (filters: ConversationFilters = {}) => {
  return useQuery({
    queryKey: ['conversations', filters],
    queryFn: async (): Promise<Conversation[]> => {
      const { data, error } = await supabase.functions.invoke('get-conversations', {
        body: { filters }
      });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 2 * 60 * 1000, // Refrescar cada 2 minutos
  });
};
