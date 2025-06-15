
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
      .select(`
        id,
        conversation_id,
        agent_id,
        phone_number,
        first_name,
        email,
        call_duration_secs,
        cost_cents,
        call_successful,
        start_time_unix_secs,
        created_at,
        status,
        client_id,
        call_type,
        connection_type,
        session_id,
        user_agent,
        ip_address,
        first_response_latency_ms,
        average_response_latency_ms,
        total_processing_time_ms,
        audio_quality_score,
        total_cost_credits,
        start_time,
        end_time,
        duration_seconds,
        error_code,
        error_message,
        audio_received_bytes,
        audio_sent_bytes,
        call_direction,
        termination_reason
      `)
      .order('created_at', { ascending: false });

    // Aplicar filtros existentes
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

    // Filtro de estado mejorado para manejar tanto status como call_successful
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'success') {
        query = query.eq('call_successful', 'success');
      } else if (filters.status === 'failure') {
        query = query.eq('call_successful', 'failure');
      } else if (filters.status === 'completed') {
        query = query.or('status.eq.completed,call_successful.eq.success');
      } else if (filters.status === 'failed') {
        query = query.or('status.eq.failed,call_successful.eq.failure');
      } else {
        query = query.eq('status', filters.status);
      }
    }

    // Nuevos filtros
    if (filters.call_type && filters.call_type !== 'all') {
      query = query.eq('call_type', filters.call_type);
    }

    if (filters.client_id) {
      query = query.eq('client_id', filters.client_id);
    }

    const { data: conversations, error } = await query.limit(100);

    if (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }

    // Mapear los datos para mantener compatibilidad y agregar nuevos campos
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
      created_at: call.created_at,
      // Nuevos campos del esquema actualizado
      status: call.status,
      client_id: call.client_id,
      call_type: call.call_type,
      connection_type: call.connection_type,
      session_id: call.session_id,
      user_agent: call.user_agent,
      ip_address: call.ip_address,
      first_response_latency_ms: call.first_response_latency_ms,
      average_response_latency_ms: call.average_response_latency_ms,
      total_processing_time_ms: call.total_processing_time_ms,
      audio_quality_score: call.audio_quality_score,
      total_cost_credits: call.total_cost_credits,
      start_time: call.start_time,
      end_time: call.end_time,
      duration_seconds: call.duration_seconds,
      error_code: call.error_code,
      error_message: call.error_message,
      audio_received_bytes: call.audio_received_bytes,
      audio_sent_bytes: call.audio_sent_bytes,
      call_direction: call.call_direction,
      termination_reason: call.termination_reason
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
