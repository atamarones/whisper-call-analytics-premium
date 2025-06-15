
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
    // Obtener el token de autorización
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    console.log('Fetching agents with metrics...');

    // Usar una query optimizada que combina agentes con métricas en una sola consulta
    const { data: agentsWithMetrics, error } = await supabaseClient
      .rpc('get_agents_with_performance_metrics');

    if (error) {
      console.error('Error calling RPC function:', error);
      
      // Fallback: obtener agentes básicos si la función RPC falla
      const { data: agents, error: agentsError } = await supabaseClient
        .from('agents')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (agentsError) {
        console.error('Fallback error fetching agents:', agentsError);
        throw agentsError;
      }

      // Calcular métricas básicas para el fallback
      const agentsWithBasicMetrics = await Promise.all(
        (agents || []).map(async (agent) => {
          const { data: calls } = await supabaseClient
            .from('calls')
            .select('cost_cents, call_duration_secs, call_successful')
            .eq('agent_id', agent.id)
            .limit(1000); // Limitar para rendimiento

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

      return new Response(JSON.stringify(agentsWithBasicMetrics), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Successfully fetched ${agentsWithMetrics?.length || 0} agents with metrics`);

    return new Response(JSON.stringify(agentsWithMetrics || []), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Error fetching agents with performance metrics'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
