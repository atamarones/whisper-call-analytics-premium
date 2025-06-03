
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

    // Try to get agents from the new agents table if it exists
    const { data: agents, error: agentsError } = await supabaseClient
      .from('agents')
      .select('*');

    if (agentsError) {
      console.log('Agents table not found, using call data to create mock agents');
      
      // If agents table doesn't exist, create mock agents based on agent_ids from calls
      const { data: calls, error: callsError } = await supabaseClient
        .from('calls')
        .select('agent_id, cost_cents, call_duration_secs, call_successful')
        .not('agent_id', 'is', null);

      if (callsError) {
        console.error('Error fetching calls:', callsError);
        throw callsError;
      }

      // Group calls by agent_id and calculate metrics
      const agentMetrics = new Map();
      
      calls?.forEach(call => {
        const agentId = call.agent_id;
        if (!agentMetrics.has(agentId)) {
          agentMetrics.set(agentId, {
            id: agentId,
            name: `Agente ${agentId.slice(-4)}`,
            total_conversations: 0,
            total_duration: 0,
            total_cost: 0,
            successful_calls: 0,
          });
        }
        
        const metrics = agentMetrics.get(agentId);
        metrics.total_conversations++;
        metrics.total_duration += call.call_duration_secs || 0;
        metrics.total_cost += (call.cost_cents || 0) / 100;
        if (call.call_successful === 'success') {
          metrics.successful_calls++;
        }
      });

      // Convert to agent format
      const mockAgents = Array.from(agentMetrics.values()).map(metrics => ({
        id: metrics.id,
        name: metrics.name,
        description: 'Agente conversacional',
        voice_name: 'Default Voice',
        llm_provider: 'openai',
        llm_model: 'gpt-3.5-turbo',
        is_active: true,
        total_conversations: metrics.total_conversations,
        avg_duration: metrics.total_conversations > 0 ? Math.round(metrics.total_duration / metrics.total_conversations) : 0,
        avg_cost: metrics.total_conversations > 0 ? metrics.total_cost / metrics.total_conversations : 0,
        success_rate: metrics.total_conversations > 0 ? (metrics.successful_calls / metrics.total_conversations * 100).toFixed(1) : 0,
        completed_conversations: metrics.successful_calls,
        failed_conversations: metrics.total_conversations - metrics.successful_calls,
      }));

      return new Response(JSON.stringify(mockAgents), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If agents table exists, get metrics from calls
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
