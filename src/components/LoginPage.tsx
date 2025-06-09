
import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">
            Analítica de Chatbots
          </CardTitle>
          <p className="text-muted-foreground">
            Inicia sesión o regístrate para continuar
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="signup">Registrarse</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="mt-6">
              <div className="flex justify-center">
                <SignIn 
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none border-0 bg-transparent"
                    }
                  }}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-6">
              <div className="flex justify-center">
                <SignUp 
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none border-0 bg-transparent"
                    }
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Usuario Admin:</strong> sistemas0712@gmail.com
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
              Este usuario tendrá permisos de administrador al registrarse.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
