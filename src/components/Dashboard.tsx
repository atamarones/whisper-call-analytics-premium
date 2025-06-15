
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
      <span className={`flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
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
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="p-3 md:p-6">
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-3" />
                </CardHeader>
                <CardContent className="pt-0">
                  <Skeleton className="h-6 w-12 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="p-2 md:p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 h-auto">
            <TabsTrigger value="overview" className="text-xs py-2 px-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <span className="hidden sm:inline">Resumen General</span>
              <span className="sm:hidden">Resumen</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs py-2 px-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <span className="hidden sm:inline">Métricas Avanzadas</span>
              <span className="sm:hidden">Métricas</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs py-2 px-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <span className="hidden sm:inline">Análisis de Conversaciones</span>
              <span className="sm:hidden">Análisis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Métricas principales - Grid responsivo mejorado */}
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
              <Card className="col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3">
                  <CardTitle className="text-xs font-medium text-muted-foreground">Total Llamadas</CardTitle>
                  <Phone className="h-3 w-3 text-muted-foreground" />
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  <div className="text-lg font-bold">{metrics?.totalCalls || 0}</div>
                  <div className="flex items-center mt-1">
                    {formatChange(metrics?.changes?.calls || 0)}
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3">
                  <CardTitle className="text-xs font-medium text-muted-foreground">Duración Total</CardTitle>
                  <Clock className="h-3 w-3 text-muted-foreground" />
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  <div className="text-lg font-bold">{Math.round((metrics?.totalMinutes || 0) / 60)}h {Math.round((metrics?.totalMinutes || 0) % 60)}m</div>
                  <div className="flex items-center mt-1">
                    {formatChange(metrics?.changes?.minutes || 0)}
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3">
                  <CardTitle className="text-xs font-medium text-muted-foreground">Costo Total</CardTitle>
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  <div className="text-lg font-bold">{formatCurrency((metrics?.totalCost || 0) / 100)}</div>
                  <div className="flex items-center mt-1">
                    {formatChange(metrics?.changes?.cost || 0)}
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3">
                  <CardTitle className="text-xs font-medium text-muted-foreground">Costo Promedio</CardTitle>
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  <div className="text-lg font-bold">{formatCurrency((metrics?.avgCostPerCall || 0) / 100)}</div>
                  <div className="flex items-center mt-1">
                    {formatChange(metrics?.changes?.avgCost || 0)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos y tablas - Stack en móvil */}
            <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
              {/* Gráfico de tendencias */}
              <div className="w-full">
                <CallTrendsChart />
              </div>

              {/* Rendimiento de Agentes */}
              <Card>
                <CardHeader className="px-3 pt-3 pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Bot className="h-4 w-4" />
                    Rendimiento de Agentes
                  </CardTitle>
                  <CardDescription className="text-xs">Métricas principales por agente</CardDescription>
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  {agentsLoading ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {agents?.slice(0, 5).map((agent) => (
                        <div key={agent.id} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-xs truncate">{agent.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{agent.description}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="flex items-center gap-2 text-xs">
                              <div className="text-center">
                                <div className="font-medium">{agent.total_conversations || 0}</div>
                                <div className="text-muted-foreground text-xs">llamadas</div>
                              </div>
                              <div className="text-center hidden sm:block">
                                <div className="font-medium">{formatSuccessRate(agent.success_rate)}%</div>
                                <div className="text-muted-foreground text-xs">éxito</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{formatCurrency((agent.avg_cost || 0) / 100)}</div>
                                <div className="text-muted-foreground text-xs hidden md:inline">prom.</div>
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
              <CardHeader className="px-3 pt-3 pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4" />
                  Llamadas Recientes
                </CardTitle>
                <CardDescription className="text-xs">Últimas conversaciones registradas</CardDescription>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                {callsLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentCalls?.slice(0, 10).map((call) => (
                      <div key={call.id} className="flex items-center justify-between p-2 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${call.status === 'Completada' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-xs truncate">{call.number}</p>
                            <p className="text-xs text-muted-foreground">{call.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs font-medium">{call.cost}</span>
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
