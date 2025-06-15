
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

// Interfaces para trabajar con la nueva estructura de datos
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

export interface ConversationMessage {
  id: number;
  conversation_id: string;
  role: string;
  content?: string;
  content_type?: string;
  timestamp: string;
  audio_duration_ms?: number;
  processing_time_ms?: number;
  tokens_used?: number;
  confidence_score?: number;
}

export interface AgentTool {
  id: number;
  agent_id: string;
  tool_name: string;
  tool_description?: string;
  tool_type: string;
  tool_config: any;
  is_active: boolean;
}

// Hook para obtener segmentos de audio
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

        if (error) {
          console.error('Error fetching audio segments:', error);
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error in useAudioSegments:', error);
        throw error;
      }
    },
    enabled: !!conversationId,
  });
};

// Hook para obtener ejecuciones de herramientas
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

        if (error) {
          console.error('Error fetching tool executions:', error);
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error in useToolExecutions:', error);
        throw error;
      }
    },
  });
};

// Hook para obtener eventos de webhook
export const useWebhookEvents = (agentId?: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['webhook-events', agentId],
    queryFn: async (): Promise<WebhookEvent[]> => {
      try {
        let query = supabase
          .from('webhook_events')
          .select('*')
          .order('created_at', { ascending: false });

        if (agentId) {
          query = query.eq('agent_id', agentId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching webhook events:', error);
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error in useWebhookEvents:', error);
        throw error;
      }
    },
  });
};

// Hook para obtener mensajes de conversación
export const useConversationMessages = (conversationId: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['conversation-messages', conversationId],
    queryFn: async (): Promise<ConversationMessage[]> => {
      try {
        const { data, error } = await supabase
          .from('conversation_messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('timestamp', { ascending: true });

        if (error) {
          console.error('Error fetching conversation messages:', error);
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error in useConversationMessages:', error);
        throw error;
      }
    },
    enabled: !!conversationId,
  });
};

// Hook para obtener herramientas de agente
export const useAgentTools = (agentId: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['agent-tools', agentId],
    queryFn: async (): Promise<AgentTool[]> => {
      try {
        const { data, error } = await supabase
          .from('agent_tools')
          .select('*')
          .eq('agent_id', agentId)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching agent tools:', error);
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error in useAgentTools:', error);
        throw error;
      }
    },
    enabled: !!agentId,
  });
};
