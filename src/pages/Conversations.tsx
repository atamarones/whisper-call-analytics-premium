
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Filter, Download, Search, Phone, Clock, DollarSign, User, Activity, AlertCircle } from 'lucide-react';
import { useConversations, ConversationFilters } from '@/hooks/useConversations';
import { useAgents } from '@/hooks/useAgents';
import DashboardHeader from '@/components/DashboardHeader';

const Conversations = () => {
  const [filters, setFilters] = useState<ConversationFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: conversations, isLoading, error } = useConversations(filters);
  const { data: agents } = useAgents();

  const handleFilterChange = (key: keyof ConversationFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatCost = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (conversation: any) => {
    // Priorizar el campo status sobre call_successful
    const status = conversation.status || conversation.call_successful;
    
    let variant: "default" | "destructive" | "secondary" | "outline" = 'secondary';
    let text = 'Desconocido';
    
    if (status === 'completed' || status === 'success') {
      variant = 'default';
      text = 'Completada';
    } else if (status === 'failed' || status === 'failure') {
      variant = 'destructive';
      text = 'Fallida';
    } else if (status === 'pending') {
      variant = 'outline';
      text = 'Pendiente';
    } else if (status === 'running') {
      variant = 'secondary';
      text = 'En Curso';
    }
    
    return (
      <Badge variant={variant} className="text-xs">
        {text}
      </Badge>
    );
  };

  const getAgentName = (agentId: string) => {
    const agent = agents?.find(a => a.id === agentId);
    return agent?.name || agentId;
  };

  const filteredConversations = conversations?.filter(conv => 
    searchTerm === '' || 
    conv.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.agent_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.conversation_id?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    console.error('Error loading conversations:', error);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader />
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Conversaciones</h1>
            <p className="text-muted-foreground mt-1">Gestiona y analiza todas las conversaciones de llamadas</p>
          </div>

          {/* Filtros Expandidos */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros Avanzados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Teléfono, nombre, agente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFrom">Fecha desde</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={filters.dateFrom || ''}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateTo">Fecha hasta</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={filters.dateTo || ''}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agent">Agente</Label>
                  <Select value={filters.agentId || 'all'} onValueChange={(value) => handleFilterChange('agentId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los agentes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los agentes</SelectItem>
                      {agents?.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="completed">Completadas</SelectItem>
                      <SelectItem value="failed">Fallidas</SelectItem>
                      <SelectItem value="pending">Pendientes</SelectItem>
                      <SelectItem value="running">En Curso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="callType">Tipo de Llamada</Label>
                  <Select value={filters.call_type || 'all'} onValueChange={(value) => handleFilterChange('call_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="outbound">Saliente</SelectItem>
                      <SelectItem value="inbound">Entrante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <Button variant="outline" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Conversaciones Mejorada */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Lista de Conversaciones
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {filteredConversations.length} conversaciones encontradas
              </p>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Contacto
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Agente
                          </div>
                        </TableHead>
                        <TableHead>Fecha/Hora</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Duración
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Costo
                          </div>
                        </TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Calidad Audio</TableHead>
                        <TableHead>Latencia</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredConversations.map((conversation) => (
                        <TableRow key={conversation.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{conversation.first_name || 'Sin nombre'}</div>
                              <div className="text-sm text-muted-foreground">{conversation.phone_number}</div>
                              {conversation.email && (
                                <div className="text-xs text-muted-foreground">{conversation.email}</div>
                              )}
                              {conversation.conversation_id && (
                                <div className="text-xs text-muted-foreground">ID: {conversation.conversation_id.slice(0, 8)}...</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{getAgentName(conversation.agent_id)}</div>
                              <div className="text-xs text-muted-foreground">{conversation.agent_id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>{formatDate(conversation.created_at)}</div>
                              {conversation.call_type && (
                                <div className="text-xs text-muted-foreground capitalize">{conversation.call_type}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>{formatDuration(conversation.duration_seconds || conversation.call_duration_secs)}</div>
                              {conversation.connection_type && (
                                <div className="text-xs text-muted-foreground">{conversation.connection_type}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>{formatCost(conversation.cost_cents)}</div>
                              {conversation.total_cost_credits && (
                                <div className="text-xs text-muted-foreground">{conversation.total_cost_credits} credits</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {getStatusBadge(conversation)}
                              {conversation.error_code && (
                                <div className="flex items-center gap-1 text-xs text-red-600">
                                  <AlertCircle className="h-3 w-3" />
                                  {conversation.error_code}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {conversation.audio_quality_score ? (
                              <div className="text-sm">
                                {(conversation.audio_quality_score * 100).toFixed(1)}%
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {conversation.first_response_latency_ms ? (
                              <div>
                                <div className="text-sm">{conversation.first_response_latency_ms}ms</div>
                                {conversation.average_response_latency_ms && (
                                  <div className="text-xs text-muted-foreground">
                                    Avg: {conversation.average_response_latency_ms}ms
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Ver detalles
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Conversations;
