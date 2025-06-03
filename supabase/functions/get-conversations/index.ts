
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

    const { filters } = await req.json();

    let query = supabaseClient
      .from('calls')
      .select('*')
      .order('start_time_unix_secs', { ascending: false });

    // Aplicar filtros si están presentes
    if (filters.dateFrom) {
      const fromTimestamp = Math.floor(new Date(filters.dateFrom).getTime() / 1000);
      query = query.gte('start_time_unix_secs', fromTimestamp);
    }

    if (filters.dateTo) {
      const toTimestamp = Math.floor(new Date(filters.dateTo).getTime() / 1000);
      query = query.lte('start_time_unix_secs', toTimestamp);
    }

    if (filters.agentId && filters.agentId !== 'all') {
      query = query.eq('agent_id', filters.agentId);
    }

    if (filters.status && filters.status !== 'all') {
      query = query.eq('call_successful', filters.status);
    }

    const { data: conversations, error } = await query.limit(100);

    if (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }

    return new Response(JSON.stringify(conversations || []), {
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
