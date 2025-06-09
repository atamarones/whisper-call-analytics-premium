
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  clerk_user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  organization_id?: string;
  created_at: string;
  updated_at: string;
}

export const useUserProfile = () => {
  const { user, isLoaded } = useUser();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user || !isLoaded) {
        console.log('No user or not loaded yet');
        return null;
      }

      console.log('Fetching profile for user:', user.id);

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('clerk_user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user profile:', error);
          throw error;
        }

        console.log('Profile data:', data);
        return data;
      } catch (error) {
        console.error('Profile fetch error:', error);
        return null;
      }
    },
    enabled: !!(user && isLoaded),
    retry: 1,
  });

  const createProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('No user found');

      console.log('Creating profile for user:', user.emailAddresses[0]?.emailAddress);

      const email = user.emailAddresses[0]?.emailAddress || '';
      
      // Check if user should be admin
      const isAdmin = email === 'sistemas0712@gmail.com';
      
      const profileData = {
        clerk_user_id: user.id,
        email,
        first_name: user.firstName || '',
        last_name: user.lastName || '',
        role: isAdmin ? 'admin' : 'user'
      };

      console.log('Profile data to insert:', profileData);

      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }

      console.log('Profile created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: (error) => {
      console.error('Failed to create profile:', error);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('clerk_user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });

  return {
    profile,
    isLoading,
    createProfile: createProfileMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    isCreatingProfile: createProfileMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    createProfileError: createProfileMutation.error,
  };
};
