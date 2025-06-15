
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
  const { getToken, isLoaded } = useAuth();

  return useQuery({
    queryKey: ['agents'],
    queryFn: async (): Promise<Agent[]> => {
      if (!isLoaded) {
        console.log('Clerk not loaded yet, skipping agents fetch');
        return [];
      }

      try {
        console.log('Fetching agents with authentication...');
        const token = await getToken({ template: 'supabase' });
        
        if (!token) {
          console.error('No authentication token available. Please check Clerk JWT template configuration.');
          throw new Error('Authentication failed: No token available');
        }

        console.log('Calling get-agents edge function...');
        const { data, error } = await supabase.functions.invoke('get-agents', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (error) {
          console.error('Error calling get-agents function:', error);
          throw new Error(error.message || 'Error fetching agents');
        }

        console.log('Agents fetched successfully:', data?.length || 0, 'agents');
        return data || [];
      } catch (error) {
        console.error('Error in useAgents:', error);
        throw error;
      }
    },
    enabled: isLoaded,
    // Caché inteligente optimizado
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false, // Evitar refetch innecesarios al cambiar ventana
    retry: (failureCount, error) => {
      // Solo reintentar si es un error de red, no de autenticación
      if (error.message.includes('Authentication failed')) {
        return false;
      }
      return failureCount < 2;
    },
    refetchInterval: 10 * 60 * 1000, // 10 minutos
  });
};
