
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Knowledge = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Base de Conocimientos</h1>
          <p className="text-gray-400 mt-1">Gestiona el contenido y respuestas automáticas</p>
        </div>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Documentos y Recursos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-gray-400">Próximamente - Base de conocimientos para IA</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Knowledge;
