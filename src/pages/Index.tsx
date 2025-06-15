
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardHeader from '@/components/DashboardHeader';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  return (
    <DashboardLayout>
      <DashboardHeader />
      <Dashboard />
    </DashboardLayout>
  );
};

export default Index;
