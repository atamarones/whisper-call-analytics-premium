
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
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setDate(toDate.getDate() + 1);
      query = query.lt('created_at', toDate.toISOString());
    }

    if (filters.agentId && filters.agentId !== 'all') {
      query = query.eq('agent_id', filters.agentId);
    }

    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'success') {
        query = query.eq('call_successful', 'success');
      } else if (filters.status === 'failure') {
        query = query.eq('call_successful', 'failure');
      }
    }

    const { data: conversations, error } = await query.limit(100);

    if (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }

    const mappedConversations = conversations?.map(call => ({
      id: call.id,
      conversation_id: call.conversation_id || call.id,
      agent_id: call.agent_id,
      phone_number: call.phone_number,
      first_name: call.first_name,
      email: call.email,
      call_duration_secs: call.call_duration_secs,
      cost_cents: call.cost_cents,
      call_successful: call.call_successful,
      start_time_unix_secs: call.start_time_unix_secs,
      created_at: call.created_at
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
