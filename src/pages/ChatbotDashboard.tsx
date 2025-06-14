
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ChatbotDashboard from '@/components/ChatbotDashboard';
import { Bot, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ChatbotDashboardPage = () => {
  return (
    <DashboardLayout>
      {/* Header específico para análisis de chatbots */}
      <div className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Bot className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Analítica de Chatbots</h1>
            <p className="text-muted-foreground">Últimos 7 días</p>
          </div>
          <div className="flex items-center gap-4">
            <Select defaultValue="7days">
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Últimos 7 días</SelectItem>
                <SelectItem value="30days">Últimos 30 días</SelectItem>
                <SelectItem value="90days">Últimos 90 días</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-primary hover:bg-primary/90">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>
      
      <ChatbotDashboard />
    </DashboardLayout>
  );
};

export default ChatbotDashboardPage;
