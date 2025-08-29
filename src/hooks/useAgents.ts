
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Agent {
  id: string;
  name: string;
  description?: string;
  voice_id?: string;
  voice_name?: string;
  voice_category?: string;
  llm_provider?: string;
  llm_model?: string;
  llm_temperature?: number;
  llm_system_prompt?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  organization_id?: string;
  
  // Configuraciones adicionales de la nueva estructura
  conversation_config?: any;
  platform_settings?: any;
  tools_enabled?: boolean;
  tools_config?: any;
  authentication_enabled?: boolean;
  hipaa_compliance?: boolean;
  pii_redaction?: boolean;
  webhook_url?: string;
  max_conversation_duration_seconds?: number;
  max_concurrent_conversations?: number;
  
  // Métricas calculadas por la función edge
  total_conversations?: number;
  avg_duration?: number;
  avg_satisfaction?: number;
  avg_cost?: number;
  success_rate?: string;
  completed_conversations?: number;
  failed_conversations?: number;
}

export const useAgents = () => {
  return useQuery({
    queryKey: ['agents'],
    queryFn: async (): Promise<Agent[]> => {
      try {
        console.log('Fetching agents from database...');
        
        // Fetch agents directly from the database
        const { data: agents, error } = await supabase
          .from('agents')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching agents:', error);
          throw new Error(error.message || 'Error fetching agents');
        }

        // Get call metrics for each agent
        const agentsWithMetrics = await Promise.all(
          (agents || []).map(async (agent) => {
            const { data: calls } = await supabase
              .from('calls')
              .select('cost_cents, call_duration_secs, call_successful')
              .eq('agent_id', agent.id)
              .limit(1000);

            const totalCalls = calls?.length || 0;
            const totalDuration = calls?.reduce((sum, call) => sum + (call.call_duration_secs || 0), 0) || 0;
            const totalCost = calls?.reduce((sum, call) => sum + ((call.cost_cents || 0) / 100), 0) || 0;
            const successfulCalls = calls?.filter(call => call.call_successful === 'success').length || 0;

            return {
              ...agent,
              total_conversations: totalCalls,
              avg_duration: totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0,
              avg_cost: totalCalls > 0 ? totalCost / totalCalls : 0,
              success_rate: totalCalls > 0 ? ((successfulCalls / totalCalls) * 100).toFixed(1) : '0',
              completed_conversations: successfulCalls,
              failed_conversations: totalCalls - successfulCalls,
            };
          })
        );

        console.log('Agents fetched successfully:', agentsWithMetrics?.length || 0, 'agents');
        return agentsWithMetrics || [];
      } catch (error) {
        console.error('Error in useAgents:', error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    retry: 2,
    refetchInterval: 10 * 60 * 1000, // 10 minutos
  });
};
