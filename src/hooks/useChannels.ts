
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

export interface Channel {
  id: string;
  name: string;
  display_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useChannels = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['channels'],
    queryFn: async (): Promise<Channel[]> => {
      const token = await getToken({ template: 'supabase' });
      
      const { data, error } = await supabase.functions.invoke('get-channels', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5 * 60 * 1000,
  });
};
