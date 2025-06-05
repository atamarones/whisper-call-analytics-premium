
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export const useAuthenticatedSupabase = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const setToken = async () => {
      const token = await getToken({ template: 'supabase' });
      
      if (token) {
        supabase.realtime.setAuth(token);
      }
    };

    setToken();
  }, [getToken]);

  const getAuthenticatedClient = async () => {
    const token = await getToken({ template: 'supabase' });
    
    if (token) {
      supabase.realtime.setAuth(token);
    }
    
    return supabase;
  };

  return { getAuthenticatedClient };
};
