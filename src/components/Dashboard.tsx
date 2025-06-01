
import React from 'react';
import { BarChart3, Calendar, Download, Users, Phone, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ThemeToggle from './ThemeToggle';

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

        {/* Chart Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Comparación con período anterior</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Gráfico de comparación</p>
                <p className="text-xs text-green-500 mt-2">+97.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
