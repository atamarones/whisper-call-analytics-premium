
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAudioSegments, useToolExecutions, useWebhookEvents, useConversationMessages, useAgentTools } from '@/hooks/useAdvancedMetrics';
import { useAgents } from '@/hooks/useAgents';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { 
  Mic, 
  Settings, 
  Webhook, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Activity,
  Zap,
  Volume2,
  Database
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface AdvancedMetricsDashboardProps {
  selectedAgentId?: string;
  selectedConversationId?: string;
}

const AdvancedMetricsDashboard = ({ selectedAgentId, selectedConversationId }: AdvancedMetricsDashboardProps) => {
  const { data: agents, isLoading: agentsLoading } = useAgents();
  const { data: audioSegments, isLoading: audioLoading } = useAudioSegments(selectedConversationId || '');
  const { data: toolExecutions, isLoading: toolsLoading } = useToolExecutions(selectedConversationId);
  const { data: webhookEvents, isLoading: webhooksLoading } = useWebhookEvents(selectedAgentId);
  const { data: messages, isLoading: messagesLoading } = useConversationMessages(selectedConversationId || '');
  const { data: agentTools, isLoading: agentToolsLoading } = useAgentTools(selectedAgentId || '');

  // Procesamiento de datos para gráficos
  const audioSegmentsByType = audioSegments?.reduce((acc, segment) => {
    acc[segment.segment_type] = (acc[segment.segment_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const audioChartData = Object.entries(audioSegmentsByType).map(([type, count]) => ({
    name: type,
    value: count
  }));

  const toolExecutionsByStatus = toolExecutions?.reduce((acc, execution) => {
    acc[execution.execution_status] = (acc[execution.execution_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const toolsChartData = Object.entries(toolExecutionsByStatus).map(([status, count]) => ({
    name: status,
    value: count
  }));

  const webhookStatusData = webhookEvents?.reduce((acc, event) => {
    acc[event.delivery_status] = (acc[event.delivery_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const webhookChartData = Object.entries(webhookStatusData).map(([status, count]) => ({
    name: status,
    value: count
  }));

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Métricas Avanzadas</h1>
          <p className="text-muted-foreground">Análisis detallado de audio, herramientas y webhooks</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="audio">Análisis de Audio</TabsTrigger>
          <TabsTrigger value="tools">Herramientas</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="messages">Mensajes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Segmentos de Audio</CardTitle>
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{audioSegments?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Total de segmentos procesados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ejecuciones de Herramientas</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{toolExecutions?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Total de ejecuciones</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eventos Webhook</CardTitle>
                <Webhook className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{webhookEvents?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Total de eventos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mensajes</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{messages?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Total de mensajes</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Segmentos de Audio</CardTitle>
              </CardHeader>
              <CardContent>
                {audioLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={audioChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {audioChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado de Ejecución de Herramientas</CardTitle>
              </CardHeader>
              <CardContent>
                {toolsLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={toolsChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audio" className="space-y-4">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Segmentos de Audio Detallados</CardTitle>
                <CardDescription>Análisis completo de segmentos de audio procesados</CardDescription>
              </CardHeader>
              <CardContent>
                {audioLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {audioSegments?.map((segment) => (
                      <div key={segment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{segment.segment_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {segment.start_time_ms}ms - {segment.end_time_ms}ms ({segment.duration_ms}ms)
                          </p>
                          {segment.transcription && (
                            <p className="text-sm mt-1 max-w-lg truncate">{segment.transcription}</p>
                          )}
                        </div>
                        <div className="text-right">
                          {segment.speech_clarity_score && (
                            <div className="text-sm">
                              <span className="font-medium">Claridad: {(segment.speech_clarity_score * 100).toFixed(1)}%</span>
                            </div>
                          )}
                          {segment.volume_level && (
                            <div className="text-sm text-muted-foreground">
                              Vol: {segment.volume_level.toFixed(1)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {audioSegments?.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No hay segmentos de audio disponibles</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Herramientas del Agente</CardTitle>
                <CardDescription>Herramientas configuradas y su estado</CardDescription>
              </CardHeader>
              <CardContent>
                {agentToolsLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {agentTools?.map((tool) => (
                      <div key={tool.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{tool.tool_name}</p>
                          <p className="text-sm text-muted-foreground">{tool.tool_description}</p>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 inline-block">
                            {tool.tool_type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {tool.is_active ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                    {agentTools?.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No hay herramientas configuradas</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historial de Ejecuciones</CardTitle>
                <CardDescription>Últimas ejecuciones de herramientas</CardDescription>
              </CardHeader>
              <CardContent>
                {toolsLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {toolExecutions?.slice(0, 10).map((execution) => (
                      <div key={execution.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Herramienta ID: {execution.tool_id}</p>
                          <p className="text-sm text-muted-foreground">
                            Iniciado: {new Date(execution.started_at).toLocaleString()}
                          </p>
                          {execution.execution_time_ms && (
                            <p className="text-xs text-muted-foreground">
                              Duración: {execution.execution_time_ms}ms
                            </p>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          execution.execution_status === 'success' ? 'bg-green-100 text-green-800' :
                          execution.execution_status === 'error' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {execution.execution_status}
                        </span>
                      </div>
                    ))}
                    {toolExecutions?.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No hay ejecuciones registradas</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Estado de Entrega de Webhooks</CardTitle>
              </CardHeader>
              <CardContent>
                {webhooksLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={webhookChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {webhookChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Eventos de Webhook Recientes</CardTitle>
                <CardDescription>Últimos eventos procesados</CardDescription>
              </CardHeader>
              <CardContent>
                {webhooksLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {webhookEvents?.slice(0, 10).map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{event.event_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.created_at).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Intentos: {event.delivery_attempts} | Código: {event.response_status_code || 'N/A'}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          event.delivery_status === 'delivered' ? 'bg-green-100 text-green-800' :
                          event.delivery_status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {event.delivery_status}
                        </span>
                      </div>
                    ))}
                    {webhookEvents?.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No hay eventos de webhook</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mensajes de Conversación</CardTitle>
              <CardDescription>Historial completo de mensajes</CardDescription>
            </CardHeader>
            <CardContent>
              {messagesLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {messages?.map((message) => (
                    <div key={message.id} className={`p-3 rounded-lg ${
                      message.role === 'user' ? 'bg-blue-50 border-l-4 border-blue-500' :
                      message.role === 'assistant' ? 'bg-green-50 border-l-4 border-green-500' :
                      'bg-gray-50 border-l-4 border-gray-500'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{message.role}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {message.content && (
                        <p className="text-sm">{message.content}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {message.processing_time_ms && (
                          <span>Tiempo: {message.processing_time_ms}ms</span>
                        )}
                        {message.tokens_used && (
                          <span>Tokens: {message.tokens_used}</span>
                        )}
                        {message.confidence_score && (
                          <span>Confianza: {(message.confidence_score * 100).toFixed(1)}%</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {messages?.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No hay mensajes disponibles</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedMetricsDashboard;
