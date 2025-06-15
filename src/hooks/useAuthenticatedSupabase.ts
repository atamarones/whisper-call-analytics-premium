
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

export const useAuthenticatedSupabase = () => {
  const { getToken, isLoaded } = useAuth();
  const [isTokenSet, setIsTokenSet] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const setToken = async () => {
      try {
        console.log('Getting Clerk token for Supabase...');
        const token = await getToken({ template: 'supabase' });
        
        if (token) {
          console.log('Token obtained successfully, setting auth...');
          supabase.realtime.setAuth(token);
          setIsTokenSet(true);
        } else {
          console.warn('No token received from Clerk. Make sure JWT template "supabase" is configured.');
          setIsTokenSet(false);
        }
      } catch (error) {
        console.error('Error getting Clerk token:', error);
        setIsTokenSet(false);
      }
    };

    setToken();
  }, [getToken, isLoaded]);

  const getAuthenticatedClient = async () => {
    if (!isLoaded) {
      throw new Error('Clerk is not loaded yet');
    }

    try {
      console.log('Getting authenticated Supabase client...');
      const token = await getToken({ template: 'supabase' });
      
      if (token) {
        console.log('Setting auth token for this request...');
        supabase.realtime.setAuth(token);
        return supabase;
      } else {
        console.error('Failed to get token. Check Clerk JWT template configuration.');
        throw new Error('Authentication failed: No token available');
      }
    } catch (error) {
      console.error('Error in getAuthenticatedClient:', error);
      throw error;
    }
  };

  return { 
    getAuthenticatedClient, 
    isTokenSet,
    isClerkLoaded: isLoaded 
  };
};
