
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { useRecentCalls } from '@/hooks/useRecentCalls';
import { useAgents } from '@/hooks/useAgents';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpIcon, ArrowDownIcon, Phone, Clock, DollarSign, TrendingUp, Bot, Activity } from 'lucide-react';
import AdvancedMetricsDashboard from './AdvancedMetricsDashboard';
import ConversationAnalysisDashboard from './ConversationAnalysisDashboard';
import DashboardHeader from './DashboardHeader';
import CallTrendsChart from './CallTrendsChart';

const Dashboard = () => {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
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

  const formatSuccessRate = (rate: string | number | undefined) => {
    if (!rate) return '0.0';
    if (typeof rate === 'string') return rate;
    return rate.toFixed(1);
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
      <div className="p-3 md:p-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="text-xs md:text-sm">Resumen General</TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs md:text-sm">Métricas Avanzadas</TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs md:text-sm">Análisis de Conversaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 md:space-y-6">
            {/* Métricas principales */}
            <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">Total de Llamadas</CardTitle>
                  <Phone className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold">{metrics?.totalCalls || 0}</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    {formatChange(metrics?.changes?.calls || 0)}
                    <span className="ml-1 hidden sm:inline">vs período anterior</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">Duración Total</CardTitle>
                  <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold">{Math.round((metrics?.totalMinutes || 0) / 60)}h {Math.round((metrics?.totalMinutes || 0) % 60)}m</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    {formatChange(metrics?.changes?.minutes || 0)}
                    <span className="ml-1 hidden sm:inline">vs período anterior</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">Costo Total</CardTitle>
                  <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold">{formatCurrency((metrics?.totalCost || 0) / 100)}</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    {formatChange(metrics?.changes?.cost || 0)}
                    <span className="ml-1 hidden sm:inline">vs período anterior</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">Costo Promedio</CardTitle>
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold">{formatCurrency((metrics?.avgCostPerCall || 0) / 100)}</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    {formatChange(metrics?.changes?.avgCost || 0)}
                    <span className="ml-1 hidden sm:inline">por llamada</span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos y tablas */}
            <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
              {/* Gráfico de tendencias - ahora es un componente separado */}
              <CallTrendsChart />

              {/* Rendimiento de Agentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Bot className="h-4 w-4 md:h-5 md:w-5" />
                    Rendimiento de Agentes
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">Métricas principales por agente</CardDescription>
                </CardHeader>
                <CardContent>
                  {agentsLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3 md:space-y-4">
                      {agents?.slice(0, 5).map((agent) => (
                        <div key={agent.id} className="flex items-center justify-between p-2 md:p-3 border rounded-lg">
                          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm md:text-base truncate">{agent.name}</p>
                              <p className="text-xs md:text-sm text-muted-foreground truncate">{agent.description}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm">
                              <div className="text-center">
                                <div className="font-medium">{agent.total_conversations || 0}</div>
                                <div className="text-muted-foreground">llamadas</div>
                              </div>
                              <div className="text-center hidden sm:block">
                                <div className="font-medium">{formatSuccessRate(agent.success_rate)}%</div>
                                <div className="text-muted-foreground">éxito</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{formatCurrency((agent.avg_cost || 0) / 100)}</div>
                                <div className="text-muted-foreground hidden md:inline">promedio</div>
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
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Activity className="h-4 w-4 md:h-5 md:w-5" />
                  Llamadas Recientes
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">Últimas conversaciones registradas</CardDescription>
              </CardHeader>
              <CardContent>
                {callsLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 md:space-y-3">
                    {recentCalls?.slice(0, 10).map((call) => (
                      <div key={call.id} className="flex items-center justify-between p-2 md:p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${call.status === 'Completada' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm md:text-base truncate">{call.number}</p>
                            <p className="text-xs md:text-sm text-muted-foreground">{call.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
                          <span className="text-xs md:text-sm font-medium">{call.cost}</span>
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
