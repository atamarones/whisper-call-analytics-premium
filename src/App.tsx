
import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useUserProfile } from '@/hooks/useUserProfile';
import AuthenticatedApp from '@/components/AuthenticatedApp';
import LoginPage from '@/components/LoginPage';

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, isLoaded } = useUser();
  const { profile, createProfile, isCreatingProfile, createProfileError } = useUserProfile();
  const [profileCreationAttempted, setProfileCreationAttempted] = useState(false);

  // Only create profile after user is fully loaded and we don't have a profile yet
  useEffect(() => {
    if (isLoaded && user && !profile && !isCreatingProfile && !profileCreationAttempted) {
      console.log('Creating profile for user:', user.emailAddresses[0]?.emailAddress);
      createProfile();
      setProfileCreationAttempted(true);
    }
  }, [isLoaded, user, profile, createProfile, isCreatingProfile, profileCreationAttempted]);

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  // Show loading while creating user profile (only for signed in users and only for a few seconds)
  if (user && isCreatingProfile && !createProfileError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Configurando tu perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <LoginPage />
      </SignedOut>
      <SignedIn>
        <AuthenticatedApp />
      </SignedIn>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;
