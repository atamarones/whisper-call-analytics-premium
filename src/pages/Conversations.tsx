
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Conversations = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Conversaciones</h1>
          <p className="text-gray-400 mt-1">Gestiona todas las conversaciones de llamadas</p>
        </div>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Lista de Conversaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-gray-400">Próximamente - Lista detallada de conversaciones</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Conversations;
