
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Obtener agentes con métricas de rendimiento
    const { data: agents, error: agentsError } = await supabaseClient
      .from('agent_performance')
      .select('*');

    if (agentsError) {
      console.error('Error fetching agents:', agentsError);
      throw agentsError;
    }

    // Si no hay datos en la vista, obtener agentes básicos
    if (!agents || agents.length === 0) {
      const { data: basicAgents, error: basicError } = await supabaseClient
        .from('agents')
        .select('*')
        .eq('is_active', true);

      if (basicError) {
        console.error('Error fetching basic agents:', basicError);
        throw basicError;
      }

      return new Response(JSON.stringify(basicAgents || []), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Mapear datos de la vista de rendimiento
    const agentsWithMetrics = agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      total_conversations: agent.total_conversations,
      avg_duration: agent.avg_duration,
      avg_satisfaction: agent.avg_satisfaction,
      avg_cost: agent.avg_cost,
      completed_conversations: agent.completed_conversations,
      failed_conversations: agent.failed_conversations,
      success_rate: agent.total_conversations > 0 
        ? (agent.completed_conversations / agent.total_conversations * 100).toFixed(1)
        : 0
    }));

    return new Response(JSON.stringify(agentsWithMetrics), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
