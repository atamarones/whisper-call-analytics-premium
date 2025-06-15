
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
  // Nuevos campos del esquema actualizado
  status?: string;
  client_id?: string;
  call_type?: string;
  connection_type?: string;
  session_id?: string;
  user_agent?: string;
  ip_address?: string;
  first_response_latency_ms?: number;
  average_response_latency_ms?: number;
  audio_quality_score?: number;
  total_cost_credits?: number;
  start_time?: string;
  end_time?: string;
  duration_seconds?: number;
  error_code?: string;
  error_message?: string;
}

export interface ConversationFilters {
  dateFrom?: string;
  dateTo?: string;
  agentId?: string;
  status?: string;
  call_type?: string;
  client_id?: string;
}

export const useConversations = (filters: ConversationFilters = {}) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['conversations', filters],
    queryFn: async (): Promise<Conversation[]> => {
      try {
        const token = await getToken({ template: 'supabase' });
        
        let query = supabase
          .from('calls')
          .select(`
            id,
            conversation_id,
            agent_id,
            phone_number,
            first_name,
            email,
            call_duration_secs,
            cost_cents,
            call_successful,
            start_time_unix_secs,
            created_at,
            status,
            client_id,
            call_type,
            connection_type,
            session_id,
            user_agent,
            ip_address,
            first_response_latency_ms,
            average_response_latency_ms,
            audio_quality_score,
            total_cost_credits,
            start_time,
            end_time,
            duration_seconds,
            error_code,
            error_message
          `)
          .order('created_at', { ascending: false });

        // Aplicar filtros
        if (filters.dateFrom) {
          query = query.gte('created_at', filters.dateFrom);
        }

        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          toDate.setDate(toDate.getDate() + 1);
          query = query.lt('created_at', toDate.toISOString());
        }

        if (filters.agentId && filters.agentId !== 'all') {
          query = query.eq('agent_id', filters.agentId);
        }

        if (filters.status && filters.status !== 'all') {
          if (filters.status === 'success') {
            query = query.eq('call_successful', 'success');
          } else if (filters.status === 'failure') {
            query = query.eq('call_successful', 'failure');
          } else {
            query = query.eq('status', filters.status);
          }
        }

        if (filters.call_type && filters.call_type !== 'all') {
          query = query.eq('call_type', filters.call_type);
        }

        if (filters.client_id) {
          query = query.eq('client_id', filters.client_id);
        }

        const { data: conversations, error } = await query.limit(100);

        if (error) {
          console.error('Error fetching conversations:', error);
          throw error;
        }

        return conversations || [];
      } catch (error) {
        console.error('Error in useConversations:', error);
        throw error;
      }
    },
    refetchInterval: 2 * 60 * 1000,
  });
};
