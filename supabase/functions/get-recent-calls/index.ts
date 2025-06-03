
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

    const { data: calls } = await supabaseClient
      .from('calls')
      .select('phone_number, duration_seconds, cost_cents, total_cost_credits, call_successful, status')
      .order('created_at', { ascending: false })
      .limit(5);

    const recentCalls = calls?.map((call, index) => {
      // Usar total_cost_credits si está disponible, sino cost_cents
      const cost = call.total_cost_credits && call.total_cost_credits > 0 
        ? call.total_cost_credits 
        : (call.cost_cents || 0) / 100;

      // Determinar el estado basado en las nuevas columnas
      let status = 'Fallida';
      if (call.status === 'completed' || call.call_successful === 'success') {
        status = 'Completada';
      }

      return {
        id: index + 1,
        number: call.phone_number || 'N/A',
        duration: `${Math.floor((call.duration_seconds || 0) / 60)}:${((call.duration_seconds || 0) % 60).toString().padStart(2, '0')}`,
        cost: `$${cost.toFixed(2)}`,
        status: status
      };
    }) || [];

    return new Response(JSON.stringify(recentCalls), {
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
