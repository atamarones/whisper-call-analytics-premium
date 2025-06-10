
import React from 'react';
import { BarChart3, Calendar, Download, Phone, DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { useChartData } from '@/hooks/useChartData';
import { useRecentCalls } from '@/hooks/useRecentCalls';

const Dashboard = () => {
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useDashboardMetrics();
  const { data: chartData, isLoading: chartLoading } = useChartData();
  const { data: recentCalls, isLoading: callsLoading } = useRecentCalls();

  // Mock data específico para llamadas
  const mockChartData = [
    { name: 'Lun', current: 12, previous: 8 },
    { name: 'Mar', current: 19, previous: 14 },
    { name: 'Mié', current: 15, previous: 12 },
    { name: 'Jue', current: 25, previous: 18 },
    { name: 'Vie', current: 22, previous: 16 },
    { name: 'Sáb', current: 18, previous: 15 },
    { name: 'Dom', current: 10, previous: 8 },
  ];

  const mockRecentCalls = [
    { id: '1', number: '+1-555-0123', duration: '2:34', cost: '$0.45', status: 'Completada' },
    { id: '2', number: '+1-555-0456', duration: '1:22', cost: '$0.28', status: 'Completada' },
    { id: '3', number: '+1-555-0789', duration: '0:45', cost: '$0.15', status: 'Fallida' },
    { id: '4', number: '+1-555-0321', duration: '3:12', cost: '$0.67', status: 'Completada' },
    { id: '5', number: '+1-555-0654', duration: '1:56', cost: '$0.38', status: 'Completada' },
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

  const formatYAxis = (value: number): string => {
    return Math.floor(Math.abs(value)).toString();
  };

  // Show demo mode alert when there's no real data
  const showDemoMode = !metrics || (!metrics.totalCalls && !metrics.totalMinutes);

  return (
    <div className="flex flex-col h-full">
      {/* Header específico para análisis de llamadas */}
      <div className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Phone className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Analítica de Llamadas</h1>
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

      <div className="flex-1 p-6 space-y-6">
        {showDemoMode && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Estás viendo datos de demostración. Para ver métricas reales, necesitas configurar agentes y tener llamadas en el sistema.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Grid - Solo métricas de llamadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de minutos de llamada
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-foreground">
                    {metrics?.totalMinutes?.toLocaleString() || '245'}
                  </div>
                  {formatChange(metrics?.changes?.minutes || 15.2)}
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Número de llamadas
              </CardTitle>
              <Phone className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-foreground">
                    {metrics?.totalCalls?.toLocaleString() || '89'}
                  </div>
                  {formatChange(metrics?.changes?.calls || 8.5)}
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Costo total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-foreground">
                    ${metrics?.totalCost?.toFixed(2) || '34.67'}
                  </div>
                  {formatChange(metrics?.changes?.cost || 12.3)}
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Costo medio por llamada
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-foreground">
                    ${metrics?.avgCostPerCall?.toFixed(2) || '0.39'}
                  </div>
                  {formatChange(metrics?.changes?.avgCost || -2.1)}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Comparación con período anterior</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData || mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    tickFormatter={formatYAxis}
                    domain={[0, 'dataMax']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previous" 
                    stroke="hsl(var(--muted))" 
                    strokeWidth={2}
                    name="Período anterior"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Período actual"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Tendencia de llamadas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData || mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    tickFormatter={formatYAxis}
                    domain={[0, 'dataMax']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }} 
                  />
                  <Bar 
                    dataKey="current" 
                    fill="hsl(var(--primary))" 
                    name="Llamadas actuales"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Calls Table - Solo llamadas */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Llamadas recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground">Número</TableHead>
                  <TableHead className="text-muted-foreground">Duración</TableHead>
                  <TableHead className="text-muted-foreground">Costo</TableHead>
                  <TableHead className="text-muted-foreground">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(recentCalls || mockRecentCalls).map((call) => (
                  <TableRow key={call.id}>
                    <TableCell className="font-medium text-foreground">{call.number}</TableCell>
                    <TableCell className="text-foreground">{call.duration}</TableCell>
                    <TableCell className="text-foreground">{call.cost}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        call.status === 'Completada' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {call.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
