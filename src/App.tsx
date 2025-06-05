
import React, { useEffect } from 'react';
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useUserProfile } from '@/hooks/useUserProfile';
import AuthenticatedApp from '@/components/AuthenticatedApp';
import LoginPage from '@/components/LoginPage';

const App = () => {
  const { user, isLoaded } = useUser();
  const { profile, createProfile, isCreatingProfile } = useUserProfile();

  // Crear perfil automáticamente cuando el usuario se registra
  useEffect(() => {
    if (isLoaded && user && !profile && !isCreatingProfile) {
      createProfile();
    }
  }, [isLoaded, user, profile, createProfile, isCreatingProfile]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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

export default App;
