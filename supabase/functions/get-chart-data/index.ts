
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

    // Obtener datos de los últimos 7 días
    const { data: currentData } = await supabaseClient
      .from('daily_call_metrics')
      .select('*')
      .order('call_date', { ascending: true })
      .limit(7);

    // Obtener datos de la semana anterior para comparación
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 14);
    
    const { data: previousData } = await supabaseClient
      .from('daily_call_metrics')
      .select('*')
      .gte('call_date', weekAgo.toISOString().split('T')[0])
      .lt('call_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('call_date', { ascending: true })
      .limit(7);

    // Formatear datos para el gráfico
    const chartData = [];
    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayName = daysOfWeek[date.getDay()];
      
      const currentDay = currentData?.find(d => {
        const dataDate = new Date(d.call_date);
        return dataDate.toDateString() === date.toDateString();
      });
      
      const previousDay = previousData?.[i];
      
      chartData.push({
        name: dayName,
        current: currentDay?.total_calls || 0,
        previous: previousDay?.total_calls || 0
      });
    }

    return new Response(JSON.stringify(chartData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
