
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
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
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['conversations', filters],
    queryFn: async (): Promise<Conversation[]> => {
      const token = await getToken({ template: 'supabase' });
      
      const { data, error } = await supabase.functions.invoke('get-conversations', {
        body: { filters },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 2 * 60 * 1000,
  });
};
