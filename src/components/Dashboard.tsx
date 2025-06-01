
import React from 'react';
import { BarChart3, Calendar, Download, Users, Phone, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import ThemeToggle from './ThemeToggle';

const chartData = [
  { name: 'Lun', current: 400, previous: 240 },
  { name: 'Mar', current: 300, previous: 139 },
  { name: 'Mié', current: 200, previous: 980 },
  { name: 'Jue', current: 278, previous: 390 },
  { name: 'Vie', current: 189, previous: 480 },
  { name: 'Sáb', current: 239, previous: 380 },
  { name: 'Dom', current: 349, previous: 430 },
];

const recentCalls = [
  { id: 1, number: '+1 (555) 123-4567', duration: '2:45', cost: '$2.15', status: 'Completada' },
  { id: 2, number: '+1 (555) 987-6543', duration: '1:32', cost: '$1.85', status: 'Completada' },
  { id: 3, number: '+1 (555) 456-7890', duration: '3:21', cost: '$3.45', status: 'Fallida' },
  { id: 4, number: '+1 (555) 654-3210', duration: '0:58', cost: '$0.95', status: 'Completada' },
  { id: 5, number: '+1 (555) 789-0123', duration: '4:12', cost: '$4.25', status: 'Completada' },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground">Analítica</h1>
            <p className="text-muted-foreground">Últimos 7 días</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle showLabel={true} />
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

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de minutos de llamada
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">2,456</div>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +97.2%
              </p>
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
              <div className="text-2xl font-bold text-foreground">1,234</div>
              <p className="text-xs text-muted-foreground">0% vs período anterior</p>
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
              <div className="text-2xl font-bold text-foreground">$3,456</div>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +97.2%
              </p>
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
              <div className="text-2xl font-bold text-foreground">$2.81</div>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +97.2%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Comparación con período anterior</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
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
                  <Bar dataKey="previous" fill="hsl(var(--muted))" name="Período anterior" />
                  <Bar dataKey="current" fill="hsl(var(--primary))" name="Período actual" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Line Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Tendencia de llamadas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
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
                    dataKey="current" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Llamadas actuales"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Calls Table */}
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
                {recentCalls.map((call) => (
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
