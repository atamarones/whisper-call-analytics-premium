
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { useChartData } from '@/hooks/useChartData';
import { useRecentCalls } from '@/hooks/useRecentCalls';
import { useAgents } from '@/hooks/useAgents';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon, Phone, Clock, DollarSign, TrendingUp, Bot, Activity } from 'lucide-react';
import AdvancedMetricsDashboard from './AdvancedMetricsDashboard';
import ConversationAnalysisDashboard from './ConversationAnalysisDashboard';
import DashboardHeader from './DashboardHeader';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: chartData, isLoading: chartLoading } = useChartData();
  const { data: recentCalls, isLoading: callsLoading } = useRecentCalls();
  const { data: agents, isLoading: agentsLoading } = useAgents();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
        {Math.abs(change).toFixed(1)}%
      </span>
    );
  };

  if (metricsLoading) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-7 w-16 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <div className="p-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen General</TabsTrigger>
            <TabsTrigger value="advanced">Métricas Avanzadas</TabsTrigger>
            <TabsTrigger value="analysis">Análisis de Conversaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Métricas principales */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Llamadas</CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics?.totalCalls || 0}</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    {formatChange(metrics?.changes?.calls || 0)}
                    <span className="ml-1">vs período anterior</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Duración Total</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round((metrics?.totalMinutes || 0) / 60)}h {Math.round((metrics?.totalMinutes || 0) % 60)}m</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    {formatChange(metrics?.changes?.minutes || 0)}
                    <span className="ml-1">vs período anterior</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Costo Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency((metrics?.totalCost || 0) / 100)}</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    {formatChange(metrics?.changes?.cost || 0)}
                    <span className="ml-1">vs período anterior</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Costo Promedio</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency((metrics?.avgCostPerCall || 0) / 100)}</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    {formatChange(metrics?.changes?.avgCost || 0)}
                    <span className="ml-1">por llamada</span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos y tablas */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Gráfico de tendencias */}
              <Card>
                <CardHeader>
                  <CardTitle>Tendencia de Llamadas</CardTitle>
                  <CardDescription>Comparación período actual vs anterior</CardDescription>
                </CardHeader>
                <CardContent>
                  {chartLoading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="current" fill="#8884d8" name="Actual" />
                        <Bar dataKey="previous" fill="#82ca9d" name="Anterior" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Rendimiento de Agentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Rendimiento de Agentes
                  </CardTitle>
                  <CardDescription>Métricas principales por agente</CardDescription>
                </CardHeader>
                <CardContent>
                  {agentsLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {agents?.slice(0, 5).map((agent) => (
                        <div key={agent.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="font-medium">{agent.name}</p>
                              <p className="text-sm text-muted-foreground">{agent.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-4 text-sm">
                              <div>
                                <span className="font-medium">{agent.total_conversations || 0}</span>
                                <span className="text-muted-foreground ml-1">llamadas</span>
                              </div>
                              <div>
                                <span className="font-medium">{(agent.success_rate || 0).toFixed(1)}%</span>
                                <span className="text-muted-foreground ml-1">éxito</span>
                              </div>
                              <div>
                                <span className="font-medium">{formatCurrency((agent.avg_cost || 0) / 100)}</span>
                                <span className="text-muted-foreground ml-1">promedio</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Llamadas recientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Llamadas Recientes
                </CardTitle>
                <CardDescription>Últimas conversaciones registradas</CardDescription>
              </CardHeader>
              <CardContent>
                {callsLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentCalls?.slice(0, 10).map((call) => (
                      <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${call.status === 'Completada' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <div>
                            <p className="font-medium">{call.number}</p>
                            <p className="text-sm text-muted-foreground">{call.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="text-sm font-medium">{call.cost}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            call.status === 'Completada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {call.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedMetricsDashboard />
          </TabsContent>

          <TabsContent value="analysis">
            <ConversationAnalysisDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
