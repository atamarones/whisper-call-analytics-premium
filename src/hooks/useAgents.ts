
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
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
        
        // Obtener los agentes usando la nueva vista agent_performance
        const { data: agentPerformanceData, error: performanceError } = await supabase
          .from('agent_performance')
          .select('*');

        if (performanceError) {
          console.error('Error fetching agent performance:', performanceError);
        }

        // Obtener los datos básicos de agentes
        const { data: agentsData, error: agentsError } = await supabase
          .from('agents')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (agentsError) {
          console.error('Error fetching agents:', agentsError);
          throw agentsError;
        }

        // Combinar los datos de agentes con las métricas de rendimiento
        const combinedData = agentsData?.map(agent => {
          const performance = agentPerformanceData?.find(p => p.id === agent.id);
          
          return {
            ...agent,
            total_conversations: performance?.total_conversations || 0,
            avg_duration: performance?.avg_duration || 0,
            avg_satisfaction: performance?.avg_satisfaction || 0,
            avg_cost: performance?.avg_cost || 0,
            success_rate: performance?.success_rate || 0,
            completed_conversations: performance?.completed_conversations || 0,
            failed_conversations: performance?.failed_conversations || 0
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
