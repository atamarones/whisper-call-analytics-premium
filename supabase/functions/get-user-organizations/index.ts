
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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Obtener organizaciones del usuario
    const { data: organizations, error: orgsError } = await supabaseClient
      .from('organizations')
      .select('*');

    if (orgsError) {
      console.error('Error fetching organizations:', orgsError);
      throw orgsError;
    }

    // Obtener permisos del usuario
    const { data: permissions, error: permsError } = await supabaseClient
      .from('user_organization_permissions')
      .select('*');

    if (permsError) {
      console.error('Error fetching permissions:', permsError);
      throw permsError;
    }

    const result = organizations.map(org => ({
      ...org,
      permissions: permissions.find(p => p.organization_id === org.id) || null
    }));

    return new Response(JSON.stringify(result), {
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
