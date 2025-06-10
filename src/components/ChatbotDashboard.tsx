
import React from 'react';
import { BarChart3, Calendar, Download, MessageSquare, Bot, Users, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ChatbotDashboard = () => {
  // Mock data específico para chatbots
  const mockChatbotMetrics = {
    totalConversations: 156,
    activeUsers: 89,
    avgResponseTime: 2.3,
    satisfactionScore: 4.2,
    changes: {
      conversations: 12.5,
      users: 8.2,
      responseTime: -5.1,
      satisfaction: 3.4
    }
  };

  const mockChatbotChartData = [
    { name: 'Lun', conversations: 25, users: 18 },
    { name: 'Mar', conversations: 32, users: 24 },
    { name: 'Mié', conversations: 28, users: 21 },
    { name: 'Jue', conversations: 35, users: 28 },
    { name: 'Vie', conversations: 31, users: 25 },
    { name: 'Sáb', conversations: 22, users: 16 },
    { name: 'Dom', conversations: 18, users: 12 },
  ];

  const mockRecentConversations = [
    { id: '1', user: 'Usuario #1234', messages: 8, duration: '5:30', status: 'Resuelto', bot: 'Chatbot Ventas' },
    { id: '2', user: 'Usuario #5678', messages: 12, duration: '8:45', status: 'En curso', bot: 'Chatbot Soporte' },
    { id: '3', user: 'Usuario #9012', messages: 5, duration: '3:15', status: 'Resuelto', bot: 'Chatbot FAQ' },
    { id: '4', user: 'Usuario #3456', messages: 15, duration: '12:20', status: 'Escalado', bot: 'Chatbot Soporte' },
    { id: '5', user: 'Usuario #7890', messages: 7, duration: '4:50', status: 'Resuelto', bot: 'Chatbot Ventas' },
  ];

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? 'text-green-500' : 'text-red-500';
    
    return (
      <p className={`text-xs ${colorClass} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {Math.abs(change).toFixed(1)}%
      </p>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <Alert>
        <Bot className="h-4 w-4" />
        <AlertDescription>
          Estás viendo datos de demostración. Para ver métricas reales, necesitas configurar chatbots y tener conversaciones en el sistema.
        </AlertDescription>
      </Alert>

      {/* Métricas específicas de chatbots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de conversaciones
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {mockChatbotMetrics.totalConversations.toLocaleString()}
            </div>
            {formatChange(mockChatbotMetrics.changes.conversations)}
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Usuarios únicos
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {mockChatbotMetrics.activeUsers}
            </div>
            {formatChange(mockChatbotMetrics.changes.users)}
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tiempo promedio de respuesta
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {mockChatbotMetrics.avgResponseTime}s
            </div>
            {formatChange(mockChatbotMetrics.changes.responseTime)}
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Puntuación de satisfacción
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {mockChatbotMetrics.satisfactionScore}/5
            </div>
            {formatChange(mockChatbotMetrics.changes.satisfaction)}
          </CardContent>
        </Card>
      </div>

      {/* Gráficos específicos de chatbots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Conversaciones por día</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockChatbotChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="conversations" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Conversaciones"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Usuarios activos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockChatbotChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }} 
                />
                <Bar 
                  dataKey="users" 
                  fill="hsl(var(--primary))" 
                  name="Usuarios únicos"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de conversaciones recientes de chatbots */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Conversaciones recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground">Usuario</TableHead>
                <TableHead className="text-muted-foreground">Mensajes</TableHead>
                <TableHead className="text-muted-foreground">Duración</TableHead>
                <TableHead className="text-muted-foreground">Estado</TableHead>
                <TableHead className="text-muted-foreground">Chatbot</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRecentConversations.map((conversation) => (
                <TableRow key={conversation.id}>
                  <TableCell className="font-medium text-foreground">{conversation.user}</TableCell>
                  <TableCell className="text-foreground">{conversation.messages}</TableCell>
                  <TableCell className="text-foreground">{conversation.duration}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      conversation.status === 'Resuelto' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : conversation.status === 'En curso'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {conversation.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-foreground">{conversation.bot}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotDashboard;
