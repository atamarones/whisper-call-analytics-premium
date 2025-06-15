
import React from 'react';
import { Calendar, Download, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DashboardHeader = () => {
  return (
    <div className="border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between px-3 md:px-6">
        {/* Left section - Title */}
        <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
          <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">
            Analítica de Llamadas
          </h1>
          <p className="hidden sm:block text-muted-foreground text-sm md:text-base">
            Últimos 7 días
          </p>
        </div>

        {/* Right section - Controls */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          {/* Date selector - hidden on very small screens, simplified on medium */}
          <div className="hidden sm:block">
            <Select defaultValue="7days">
              <SelectTrigger className="w-32 md:w-40 text-xs md:text-sm">
                <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Últimos 7 días</SelectItem>
                <SelectItem value="30days">Últimos 30 días</SelectItem>
                <SelectItem value="90days">Últimos 90 días</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export button */}
          <Button className="bg-primary hover:bg-primary/90 text-xs md:text-sm px-2 md:px-4" size="sm">
            <Download className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Exportar</span>
            <span className="sm:hidden">CSV</span>
          </Button>

          {/* Mobile menu button - only visible on small screens */}
          <Button variant="outline" size="sm" className="sm:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile date selector - visible only on small screens */}
      <div className="sm:hidden px-3 pb-3">
        <Select defaultValue="7days">
          <SelectTrigger className="w-full text-sm">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Últimos 7 días</SelectItem>
            <SelectItem value="30days">Últimos 30 días</SelectItem>
            <SelectItem value="90days">Últimos 90 días</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DashboardHeader;
