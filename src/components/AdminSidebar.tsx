
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
  Users,
  Package,
  Settings,
  BarChart3,
  Shield,
  CreditCard,
  DollarSign
} from 'lucide-react';

const menuItems = [
  { title: 'Overview', url: '/admin', icon: BarChart3, end: true },
  { title: 'User Management', url: '/admin/users', icon: Users },
  { title: 'Product Management', url: '/admin/products', icon: Package },
  { title: 'Payment Management', url: '/admin/payments', icon: CreditCard },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string, end?: boolean) => 
    end ? currentPath === path : currentPath.startsWith(path);

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-blue-100 text-blue-700 font-medium border-r-2 border-blue-600" 
      : "hover:bg-slate-100 text-slate-600";

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-60"}
      collapsible="icon"
    >
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-600 font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {!collapsed && "Admin Dashboard"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.end}
                      className={({ isActive }) => getNavCls({ isActive: isActive })}
                    >
                      <item.icon className="h-4 w-4" />
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

// Add default export to fix SuperAdmin.tsx import
export default AdminSidebar;
