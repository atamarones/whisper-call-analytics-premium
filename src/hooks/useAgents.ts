
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

export interface Agent {
  id: string;
  name: string;
  description?: string;
  voice_name?: string;
  voice_category?: string;
  llm_provider?: string;
  llm_model?: string;
  llm_temperature?: number;
  llm_system_prompt?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Configuraciones adicionales
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
  
  // Métricas calculadas
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
      try {
        const token = await getToken({ template: 'supabase' });
        
        // Obtener los agentes básicos
        const { data: agentsData, error: agentsError } = await supabase
          .from('agents')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (agentsError) {
          console.error('Error fetching agents:', agentsError);
          throw agentsError;
        }

        // Calcular métricas manualmente desde la tabla calls
        const { data: callsData, error: callsError } = await supabase
          .from('calls')
          .select('*');

        if (callsError) {
          console.error('Error fetching calls for metrics:', callsError);
        }

        // Obtener datos de análisis de conversaciones
        const { data: analysisData, error: analysisError } = await supabase
          .from('conversation_analysis')
          .select('*');

        if (analysisError) {
          console.error('Error fetching conversation analysis:', analysisError);
        }

        // Combinar los datos y calcular métricas
        const combinedData = agentsData?.map(agent => {
          // Filtrar llamadas por agente
          const agentCalls = callsData?.filter(call => call.agent_id === agent.id) || [];
          
          // Calcular métricas básicas
          const totalConversations = agentCalls.length;
          const completedCalls = agentCalls.filter(call => call.call_successful === 'success').length;
          const failedCalls = agentCalls.filter(call => call.call_successful === 'failure').length;
          const avgDuration = totalConversations > 0 
            ? agentCalls.reduce((sum, call) => sum + (call.call_duration_secs || 0), 0) / totalConversations 
            : 0;
          const avgCost = totalConversations > 0 
            ? agentCalls.reduce((sum, call) => sum + (call.cost_cents || 0), 0) / totalConversations 
            : 0;
          const successRate = totalConversations > 0 
            ? (completedCalls / totalConversations) * 100 
            : 0;

          // Calcular satisfacción promedio desde análisis
          const agentAnalysis = analysisData?.filter(analysis => 
            agentCalls.some(call => call.conversation_id === analysis.conversation_id)
          ) || [];
          
          const avgSatisfaction = agentAnalysis.length > 0
            ? agentAnalysis.reduce((sum, analysis) => sum + (analysis.overall_satisfaction_score || 0), 0) / agentAnalysis.length
            : 0;

          return {
            ...agent,
            total_conversations: totalConversations,
            avg_duration: avgDuration,
            avg_satisfaction: avgSatisfaction,
            avg_cost: avgCost,
            success_rate: successRate,
            completed_conversations: completedCalls,
            failed_conversations: failedCalls
          };
        }) || [];

        return combinedData;
      } catch (error) {
        console.error('Error in useAgents:', error);
        throw error;
      }
    },
    refetchInterval: 5 * 60 * 1000,
  });
};
