
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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Obtener agentes (RLS se encarga del filtrado automáticamente)
    const { data: agents, error: agentsError } = await supabaseClient
      .from('agents')
      .select('*');

    if (agentsError) {
      console.error('Error fetching agents:', agentsError);
      throw agentsError;
    }

    // Para cada agente, calcular métricas desde la tabla calls
    const agentsWithMetrics = await Promise.all(
      agents.map(async (agent) => {
        const { data: calls } = await supabaseClient
          .from('calls')
          .select('cost_cents, call_duration_secs, call_successful')
          .eq('agent_id', agent.id);

        const totalCalls = calls?.length || 0;
        const totalDuration = calls?.reduce((sum, call) => sum + (call.call_duration_secs || 0), 0) || 0;
        const totalCost = calls?.reduce((sum, call) => sum + ((call.cost_cents || 0) / 100), 0) || 0;
        const successfulCalls = calls?.filter(call => call.call_successful === 'success').length || 0;

        return {
          id: agent.id,
          name: agent.name,
          description: agent.description,
          voice_name: agent.voice_name,
          llm_provider: agent.llm_provider,
          llm_model: agent.llm_model,
          is_active: agent.is_active,
          user_id: agent.user_id,
          organization_id: agent.organization_id,
          total_conversations: totalCalls,
          avg_duration: totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0,
          avg_cost: totalCalls > 0 ? totalCost / totalCalls : 0,
          success_rate: totalCalls > 0 ? (successfulCalls / totalCalls * 100).toFixed(1) : 0,
          completed_conversations: successfulCalls,
          failed_conversations: totalCalls - successfulCalls,
        };
      })
    );

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
