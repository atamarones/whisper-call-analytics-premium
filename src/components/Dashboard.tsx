import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Phone, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  PlayCircle, 
  PauseCircle,
  Download,
  Filter,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Time periods
const timePeriods = [
  { value: '7d', label: 'Últimos 7 días' },
  { value: '15d', label: 'Últimos 15 días' },
  { value: '1m', label: 'Último 1 mes' },
  { value: '3m', label: 'Últimos 3 meses' },
  { value: '6m', label: 'Último 6 meses' },
];

// Mock data with comparison
const callsData = [
  { date: '11 Feb', minutes: 0, calls: 0, previousMinutes: 0 },
  { date: '12 Feb', minutes: 0.5, calls: 1, previousMinutes: 0.2 },
  { date: '13 Feb', minutes: 1.2, calls: 2, previousMinutes: 0.8 },
  { date: '14 Feb', minutes: 2.8, calls: 4, previousMinutes: 1.5 },
  { date: '15 Feb', minutes: 5.85, calls: 6, previousMinutes: 3.2 },
  { date: '16 Feb', minutes: 4.2, calls: 3, previousMinutes: 2.8 },
  { date: '17 Feb', minutes: 3.1, calls: 2, previousMinutes: 2.1 },
];

const recentCalls = [
  { id: 1, contact: 'María García', duration: '2:34', cost: '$0.12', status: 'completed', timestamp: '14:30' },
  { id: 2, contact: 'Carlos López', duration: '1:45', cost: '$0.08', status: 'completed', timestamp: '14:15' },
  { id: 3, contact: 'Ana Rodríguez', duration: '3:21', cost: '$0.18', status: 'failed', timestamp: '14:02' },
  { id: 4, contact: 'Luis Martín', duration: '0:52', cost: '$0.04', status: 'completed', timestamp: '13:45' },
];

const Dashboard = () => {
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [metrics, setMetrics] = useState({
    totalMinutes: 5.85,
    totalCalls: 3,
    totalCost: 0.70,
    avgCostPerCall: 0.23,
    growth: 97.2
  });

  const MetricCard = ({ title, value, subtitle, growth, icon: Icon, trend = 'up' }: any) => (
    <Card className="metric-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
        <Icon className="h-4 w-4 text-dashboard-blue" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        )}
        {growth && (
          <div className="flex items-center mt-2">
            <TrendingUp className="h-3 w-3 text-dashboard-green mr-1" />
            <span className="text-xs text-dashboard-green font-medium">+{growth}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const togglePlay = (callId: number) => {
    setIsPlaying(isPlaying === callId ? null : callId);
  };

  const getPeriodLabel = () => {
    return timePeriods.find(p => p.value === selectedPeriod)?.label || 'Últimos 7 días';
  };

  return (
    <div className="min-h-screen bg-dashboard-navy p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analítica</h1>
          <p className="text-gray-400 mt-1">{getPeriodLabel()}</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-dashboard-navy-light border-white/10">
              {timePeriods.map((period) => (
                <SelectItem 
                  key={period.value} 
                  value={period.value}
                  className="text-white hover:bg-white/10 focus:bg-white/10"
                >
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="bg-dashboard-blue hover:bg-dashboard-blue-light">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de minutos de llamada"
          value="5,85"
          growth={metrics.growth}
          icon={Clock}
        />
        <MetricCard
          title="Número de llamadas"
          value="3"
          subtitle="0% vs período anterior"
          icon={Phone}
        />
        <MetricCard
          title="Costo total"
          value="0,70 US$"
          growth={metrics.growth}
          icon={DollarSign}
        />
        <MetricCard
          title="Costo medio por llamada"
          value="0,23 US$"
          growth={metrics.growth}
          icon={TrendingUp}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Minutes Chart with Comparison */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Total de minutos de llamada
              <Badge variant="secondary" className="bg-dashboard-green/20 text-dashboard-green">
                +97.2%
              </Badge>
            </CardTitle>
            <p className="text-gray-400 text-sm">Comparación con período anterior</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={callsData}>
                <defs>
                  <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="previousGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b7280" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6b7280" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} className="text-gray-400" />
                <YAxis axisLine={false} tickLine={false} className="text-gray-400" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Area
                  type="monotone"
                  dataKey="previousMinutes"
                  stroke="#6b7280"
                  strokeWidth={2}
                  fill="url(#previousGradient)"
                  strokeDasharray="5 5"
                />
                <Area
                  type="monotone"
                  dataKey="minutes"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#currentGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Calls Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Número de llamadas
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                0%
              </Badge>
            </CardTitle>
            <p className="text-gray-400 text-sm">El número total de llamadas realizadas cada día.</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={callsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} className="text-gray-400" />
                <YAxis axisLine={false} tickLine={false} className="text-gray-400" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="calls" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Calls */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Llamadas Recientes</CardTitle>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCalls.map((call) => (
              <div key={call.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePlay(call.id)}
                    className="text-dashboard-blue hover:text-dashboard-blue-light flex-shrink-0"
                  >
                    {isPlaying === call.id ? 
                      <PauseCircle className="h-5 w-5" /> : 
                      <PlayCircle className="h-5 w-5" />
                    }
                  </Button>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{call.contact}</p>
                    <p className="text-gray-400 text-sm">{call.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right w-16">
                    <p className="text-white text-sm">{call.duration}</p>
                    <p className="text-gray-400 text-xs">{call.cost}</p>
                  </div>
                  <div className="w-24 flex justify-center">
                    <Badge 
                      variant={call.status === 'completed' ? 'default' : 'destructive'}
                      className={call.status === 'completed' ? 
                        'bg-dashboard-green/20 text-dashboard-green hover:bg-dashboard-green/30' : 
                        'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      }
                    >
                      {call.status === 'completed' ? 'Completada' : 'Fallida'}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white flex-shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
