
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
      .select('phone_number, call_duration_secs, cost_cents, call_successful')
      .order('created_at', { ascending: false })
      .limit(5);

    const recentCalls = calls?.map((call, index) => ({
      id: index + 1,
      number: call.phone_number || 'N/A',
      duration: `${Math.floor(call.call_duration_secs / 60)}:${(call.call_duration_secs % 60).toString().padStart(2, '0')}`,
      cost: `$${(call.cost_cents / 100).toFixed(2)}`,
      status: call.call_successful === 'success' ? 'Completada' : 'Fallida'
    })) || [];

    return new Response(JSON.stringify(recentCalls), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
