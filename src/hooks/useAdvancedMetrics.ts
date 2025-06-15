
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

// Interfaces simplificadas para trabajar con datos existentes
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

// Hook simulado para segmentos de audio (usando datos mock por ahora)
export const useAudioSegments = (conversationId: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['audio-segments', conversationId],
    queryFn: async (): Promise<AudioSegment[]> => {
      try {
        // Por ahora retornamos datos mock hasta que las tablas estén disponibles
        console.log('Audio segments not yet implemented - using mock data');
        return [];
      } catch (error) {
        console.error('Error fetching audio segments:', error);
        throw error;
      }
    },
    enabled: !!conversationId,
  });
};

// Hook simulado para ejecuciones de herramientas
export const useToolExecutions = (conversationId?: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['tool-executions', conversationId],
    queryFn: async (): Promise<ToolExecution[]> => {
      try {
        // Por ahora retornamos datos mock hasta que las tablas estén disponibles
        console.log('Tool executions not yet implemented - using mock data');
        return [];
      } catch (error) {
        console.error('Error fetching tool executions:', error);
        throw error;
      }
    },
  });
};

// Hook simulado para eventos de webhook
export const useWebhookEvents = (agentId?: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['webhook-events', agentId],
    queryFn: async (): Promise<WebhookEvent[]> => {
      try {
        // Por ahora retornamos datos mock hasta que las tablas estén disponibles
        console.log('Webhook events not yet implemented - using mock data');
        return [];
      } catch (error) {
        console.error('Error fetching webhook events:', error);
        throw error;
      }
    },
  });
};
