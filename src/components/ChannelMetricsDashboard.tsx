
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useChannelPerformanceSummary } from '@/hooks/useChannelMetrics';
import { MessageSquare, Users, TrendingUp, DollarSign } from 'lucide-react';

const ChannelMetricsDashboard = () => {
  const { data: channelPerformance, isLoading, error } = useChannelPerformanceSummary();

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f'];

  const pieData = channelPerformance?.map((channel, index) => ({
    name: channel.display_name,
    value: channel.total_conversations,
    color: colors[index % colors.length]
  })) || [];

  if (error) {
    console.error('Error loading channel performance:', error);
  }

  return (
    <div className="space-y-6">
      {/* Resumen por Canales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversaciones</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {channelPerformance?.reduce((acc, channel) => acc + channel.total_conversations, 0)?.toLocaleString() || '0'}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canales Activos</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {channelPerformance?.length || 0}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Éxito Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {channelPerformance?.length ? 
                  Math.round(channelPerformance.reduce((acc, channel) => acc + (channel.success_rate || 0), 0) / channelPerformance.length) 
                  : 0}%
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Costo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                ${(channelPerformance?.reduce((acc, channel) => acc + channel.total_cost_cents, 0) / 100)?.toFixed(2) || '0.00'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras - Conversaciones por canal */}
        <Card>
          <CardHeader>
            <CardTitle>Conversaciones por Canal</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={channelPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="display_name" 
                    stroke="hsl(var(--muted-foreground))"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }} 
                  />
                  <Bar dataKey="total_conversations" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de pastel - Distribución por canal */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Conversaciones</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabla detallada */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento Detallado por Canal</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Canal</TableHead>
                  <TableHead>Conversaciones</TableHead>
                  <TableHead>Exitosas</TableHead>
                  <TableHead>Fallidas</TableHead>
                  <TableHead>Tasa de Éxito</TableHead>
                  <TableHead>Agentes Activos</TableHead>
                  <TableHead>Costo Total</TableHead>
                  <TableHead>Última Actividad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channelPerformance?.map((channel) => (
                  <TableRow key={channel.channel_name}>
                    <TableCell className="font-medium">
                      <Badge variant="outline">
                        {channel.display_name}
                      </Badge>
                    </TableCell>
                    <TableCell>{channel.total_conversations?.toLocaleString() || '0'}</TableCell>
                    <TableCell className="text-green-600">{channel.successful_conversations?.toLocaleString() || '0'}</TableCell>
                    <TableCell className="text-red-600">{channel.failed_conversations?.toLocaleString() || '0'}</TableCell>
                    <TableCell>
                      <Badge variant={channel.success_rate >= 80 ? "default" : channel.success_rate >= 60 ? "secondary" : "destructive"}>
                        {channel.success_rate?.toFixed(1) || '0'}%
                      </Badge>
                    </TableCell>
                    <TableCell>{channel.active_agents || '0'}</TableCell>
                    <TableCell>${(channel.total_cost_cents / 100)?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>
                      {channel.last_activity_date ? 
                        new Date(channel.last_activity_date).toLocaleDateString() : 
                        'Sin actividad'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChannelMetricsDashboard;
