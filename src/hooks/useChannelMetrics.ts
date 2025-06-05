
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

export interface ChannelMetric {
  id: string;
  channel_id: string;
  agent_id: string;
  date: string;
  total_conversations: number;
  successful_conversations: number;
  failed_conversations: number;
  total_messages: number;
  avg_response_time_seconds: number;
  avg_conversation_duration_seconds: number;
  total_cost_cents: number;
  avg_satisfaction_score: number;
  created_at: string;
  updated_at: string;
}

export interface ChannelPerformanceSummary {
  channel_name: string;
  display_name: string;
  total_conversations: number;
  successful_conversations: number;
  failed_conversations: number;
  avg_satisfaction: number;
  success_rate: number;
  total_cost_cents: number;
  active_agents: number;
  last_activity_date: string;
}

export const useChannelMetrics = (dateFrom?: string, dateTo?: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['channel-metrics', dateFrom, dateTo],
    queryFn: async (): Promise<ChannelMetric[]> => {
      const token = await getToken({ template: 'supabase' });
      
      const { data, error } = await supabase.functions.invoke('get-channel-metrics', {
        body: { dateFrom, dateTo },
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

export const useChannelPerformanceSummary = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['channel-performance-summary'],
    queryFn: async (): Promise<ChannelPerformanceSummary[]> => {
      const token = await getToken({ template: 'supabase' });
      
      const { data, error } = await supabase.functions.invoke('get-channel-performance', {
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
