
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
      .order('start_time', { ascending: false });

    // Aplicar filtros usando las nuevas columnas
    if (filters.dateFrom) {
      query = query.gte('start_time', filters.dateFrom);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setDate(toDate.getDate() + 1); // Incluir todo el día
      query = query.lt('start_time', toDate.toISOString());
    }

    if (filters.agentId && filters.agentId !== 'all') {
      query = query.eq('agent_id', filters.agentId);
    }

    if (filters.status && filters.status !== 'all') {
      // Usar la nueva columna status o fall back a call_successful
      if (filters.status === 'success') {
        query = query.or('status.eq.completed,call_successful.eq.success');
      } else if (filters.status === 'failure') {
        query = query.or('status.eq.failed,call_successful.eq.failure');
      }
    }

    const { data: conversations, error } = await query.limit(100);

    if (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }

    // Mapear los datos a la estructura esperada por el frontend
    const mappedConversations = conversations?.map(call => ({
      id: call.id,
      conversation_id: call.conversation_id || call.id,
      agent_id: call.agent_id,
      phone_number: call.phone_number,
      first_name: call.first_name,
      email: call.email,
      call_duration_secs: call.duration_seconds || call.call_duration_secs,
      cost_cents: call.cost_cents,
      total_cost_credits: call.total_cost_credits,
      call_successful: call.status || call.call_successful,
      start_time_unix_secs: call.start_time_unix || call.start_time_unix_secs,
      start_time: call.start_time,
      created_at: call.created_at,
      call_direction: call.call_direction,
      status: call.status
    })) || [];

    return new Response(JSON.stringify(mappedConversations), {
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
