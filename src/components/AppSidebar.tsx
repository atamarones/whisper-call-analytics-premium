
import React from 'react';
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Phone,
  Database,
  MessageSquare,
  Target,
  Settings,
  Users,
  Menu,
  Plus,
  LogOut,
  Bell
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { title: "Analítica", url: "/", icon: BarChart3 },
  { title: "Conversaciones", url: "/conversations", icon: MessageSquare },
  { title: "Base de conocimientos", url: "/knowledge", icon: Database },
  { title: "Temas", url: "/topics", icon: Target },
  { title: "Dirige", url: "/manage", icon: Users },
  { title: "Campañas", url: "/campaigns", icon: Phone },
];

const AppSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, logout } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const collapsed = state === "collapsed";

  const handleLogout = () => {
    logout();
  };

  return (
    <Sidebar
      className={`border-r border-border bg-sidebar ${collapsed ? "w-16" : "w-64"}`}
      collapsible="icon"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-dashboard-blue to-dashboard-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AL</span>
              </div>
              <span className="text-sidebar-foreground font-semibold text-lg">Analítica</span>
            </div>
          )}
          <div className="ml-auto">
            <SidebarTrigger className="text-sidebar-foreground/60 hover:text-sidebar-foreground" />
          </div>
        </div>
      </div>

      <SidebarContent className="px-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider px-3 py-2">
            {!collapsed && "Navegación"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`sidebar-item group ${isActive(item.url) ? 'active' : ''} ${
                        collapsed ? 'justify-center' : ''
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Add Custom Menu */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupContent>
              <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent">
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Menu
              </Button>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Settings */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/settings"
                    className={`sidebar-item group ${isActive('/settings') ? 'active' : ''} ${
                      collapsed ? 'justify-center' : ''
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    {!collapsed && <span>Configuración del proy...</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/api/placeholder/32/32" />
            <AvatarFallback className="bg-dashboard-blue text-white">
              {user?.name?.charAt(0) || 'C'}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground text-sm font-medium truncate">{user?.name || 'Usuario'}</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Bell className="h-3 w-3 text-sidebar-foreground/60" />
                  <span className="text-xs text-sidebar-foreground/60">0</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-0 text-sidebar-foreground/60 hover:text-sidebar-foreground"
                  onClick={handleLogout}
                  title="Cerrar sesión"
                >
                  <LogOut className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
        {!collapsed && (
          <Button 
            variant="ghost" 
            className="w-full mt-2 text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground justify-start"
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        )}
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
