
import React from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, User } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import ThemeToggle from './ThemeToggle';

const DashboardHeader = () => {
  const { user } = useUser();
  const { profile } = useUserProfile();

  return (
    <div className="border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Portal de Agentes</h1>
          {profile?.organization_id && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {profile.organization_id}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle showLabel={false} />
          
          {profile && (
            <Card className="px-3 py-1">
              <CardContent className="p-0 flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{profile.role}</span>
              </CardContent>
            </Card>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {user?.firstName} {user?.lastName}
            </span>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8"
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
