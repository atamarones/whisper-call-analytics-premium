
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useChartData, ChartDataPoint } from '@/hooks/useChartData';

const chartConfig = {
  current: {
    label: 'Actual',
    color: '#8884d8',
  },
  previous: {
    label: 'Anterior',
    color: '#82ca9d',
  },
};

const CallTrendsChart = () => {
  const { data: chartData, isLoading: chartLoading } = useChartData();

  if (chartLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Llamadas</CardTitle>
          <CardDescription>Comparación período actual vs anterior</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base md:text-lg">Tendencia de Llamadas</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Comparación período actual vs anterior
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 md:px-6">
        <ChartContainer config={chartConfig} className="h-64 md:h-80 w-full">
          <BarChart
            data={chartData || []}
            margin={{
              top: 5,
              right: 10,
              left: 5,
              bottom: 5,
            }}
            barCategoryGap="20%"
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="opacity-30"
            />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              className="text-xs fill-muted-foreground"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              className="text-xs fill-muted-foreground"
              width={30}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
            />
            <Bar 
              dataKey="current" 
              fill="var(--color-current)"
              name="Actual"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="previous" 
              fill="var(--color-previous)"
              name="Anterior"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CallTrendsChart;
