
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
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['agents'],
    queryFn: async (): Promise<Agent[]> => {
      try {
        const token = await getToken({ template: 'supabase' });
        
        // Usar la función edge optimizada que ya calcula las métricas
        const { data, error } = await supabase.functions.invoke('get-agents', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (error) {
          console.error('Error calling get-agents function:', error);
          throw new Error(error.message || 'Error fetching agents');
        }

        return data || [];
      } catch (error) {
        console.error('Error in useAgents:', error);
        throw error;
      }
    },
    // Caché inteligente - los datos son válidos por 2 minutos
    staleTime: 2 * 60 * 1000, // 2 minutos
    // Mantener en caché por 5 minutos después de que se vuelvan stale
    gcTime: 5 * 60 * 1000, // 5 minutos
    // Solo refetch cuando el usuario se enfoca en la ventana si los datos están stale
    refetchOnWindowFocus: 'always',
    // Reintentar una vez en caso de error
    retry: 1,
    // Intervalo de refetch más conservador
    refetchInterval: 10 * 60 * 1000, // 10 minutos en lugar de 5
  });
};
