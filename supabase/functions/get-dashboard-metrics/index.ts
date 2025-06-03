
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

    // Obtener fechas para comparación
    const today = new Date();
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    
    const previousWeekStart = new Date(today);
    previousWeekStart.setDate(previousWeekStart.getDate() - 14);
    const previousWeekEnd = new Date(today);
    previousWeekEnd.setDate(previousWeekEnd.getDate() - 7);

    // Métricas actuales (últimos 7 días)
    const { data: currentWeekData } = await supabaseClient
      .from('calls')
      .select('call_duration_secs, cost_cents')
      .gte('created_at', lastWeekStart.toISOString());

    // Métricas semana anterior
    const { data: previousWeekData } = await supabaseClient
      .from('calls')
      .select('call_duration_secs, cost_cents')
      .gte('created_at', previousWeekStart.toISOString())
      .lt('created_at', previousWeekEnd.toISOString());

    // Calcular métricas actuales
    const currentCalls = currentWeekData?.length || 0;
    const currentMinutes = Math.round((currentWeekData?.reduce((sum, call) => sum + (call.call_duration_secs || 0), 0) || 0) / 60);
    const currentCost = (currentWeekData?.reduce((sum, call) => sum + (call.cost_cents || 0), 0) || 0) / 100;
    const currentAvgCost = currentCalls > 0 ? currentCost / currentCalls : 0;

    // Calcular métricas anteriores
    const previousCalls = previousWeekData?.length || 0;
    const previousMinutes = Math.round((previousWeekData?.reduce((sum, call) => sum + (call.call_duration_secs || 0), 0) || 0) / 60);
    const previousCost = (previousWeekData?.reduce((sum, call) => sum + (call.cost_cents || 0), 0) || 0) / 100;

    // Calcular porcentajes de cambio
    const minutesChange = previousMinutes > 0 ? ((currentMinutes - previousMinutes) / previousMinutes) * 100 : 0;
    const callsChange = previousCalls > 0 ? ((currentCalls - previousCalls) / previousCalls) * 100 : 0;
    const costChange = previousCost > 0 ? ((currentCost - previousCost) / previousCost) * 100 : 0;
    const avgCostChange = currentAvgCost > 0 && previousCalls > 0 ? 
      ((currentAvgCost - (previousCost / previousCalls)) / (previousCost / previousCalls)) * 100 : 0;

    const metrics = {
      totalMinutes: currentMinutes,
      totalCalls: currentCalls,
      totalCost: currentCost,
      avgCostPerCall: currentAvgCost,
      changes: {
        minutes: Math.round(minutesChange * 10) / 10,
        calls: Math.round(callsChange * 10) / 10,
        cost: Math.round(costChange * 10) / 10,
        avgCost: Math.round(avgCostChange * 10) / 10
      }
    };

    return new Response(JSON.stringify(metrics), {
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
