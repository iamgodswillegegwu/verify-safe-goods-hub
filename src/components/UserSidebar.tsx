
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
} from '@/components/ui/sidebar';
import {
  User,
  Settings,
  Heart,
  Clock,
  Search,
  CreditCard,
  Bell,
  Shield,
  Activity,
  BarChart3,
  Home
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Search Products', url: '/', icon: Search },
  { title: 'Profile', url: '/profile', icon: User },
  { title: 'Favorites', url: '/favorites', icon: Heart },
  { title: 'History', url: '/profile/history', icon: Clock },
  { title: 'Activity', url: '/profile/activity', icon: Activity },
  { title: 'Subscription', url: '/subscription', icon: CreditCard },
  { title: 'Settings', url: '/profile/settings', icon: Settings },
];

export function UserSidebar() {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isExpanded = menuItems.some((item) => isActive(item.url));

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-blue-100 text-blue-700 font-medium border-r-2 border-blue-600" 
      : "hover:bg-slate-100 text-slate-600";

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-60"}
      collapsible
    >
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <SidebarGroup
          open={isExpanded}
          onOpenChange={() => {}}
        >
          <SidebarGroupLabel className="text-blue-600 font-semibold">
            User Dashboard
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
