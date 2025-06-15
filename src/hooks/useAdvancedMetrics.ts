
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

export interface AudioSegment {
  id: number;
  conversation_id: string;
  segment_type: string;
  start_time_ms: number;
  end_time_ms: number;
  duration_ms: number;
  transcription?: string;
  transcription_confidence?: number;
  language_detected?: string;
  volume_level?: number;
  noise_level?: number;
  speech_clarity_score?: number;
}

export interface ToolExecution {
  id: number;
  conversation_id: string;
  tool_id: number;
  execution_status: string;
  input_parameters?: any;
  output_result?: any;
  execution_time_ms?: number;
  retry_count: number;
  started_at: string;
  completed_at?: string;
}

export interface WebhookEvent {
  id: number;
  conversation_id?: string;
  agent_id: string;
  event_type: string;
  payload: any;
  delivery_status: string;
  delivery_attempts: number;
  response_status_code?: number;
  created_at: string;
}

export const useAudioSegments = (conversationId: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['audio-segments', conversationId],
    queryFn: async (): Promise<AudioSegment[]> => {
      try {
        const { data, error } = await supabase
          .from('audio_segments')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('start_time_ms', { ascending: true });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching audio segments:', error);
        throw error;
      }
    },
    enabled: !!conversationId,
  });
};

export const useToolExecutions = (conversationId?: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['tool-executions', conversationId],
    queryFn: async (): Promise<ToolExecution[]> => {
      try {
        let query = supabase
          .from('tool_executions')
          .select('*')
          .order('started_at', { ascending: false });

        if (conversationId) {
          query = query.eq('conversation_id', conversationId);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching tool executions:', error);
        throw error;
      }
    },
  });
};

export const useWebhookEvents = (agentId?: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['webhook-events', agentId],
    queryFn: async (): Promise<WebhookEvent[]> => {
      try {
        let query = supabase
          .from('webhook_events')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (agentId) {
          query = query.eq('agent_id', agentId);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching webhook events:', error);
        throw error;
      }
    },
  });
};
