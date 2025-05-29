
import { useState } from 'react';
import { 
  Settings, 
  Users, 
  Package, 
  Shield, 
  Key, 
  Mail, 
  Database,
  BarChart3,
  Bell,
  Globe,
  CreditCard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AdminSidebar = ({ activeSection, onSectionChange }: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  console.log('AdminSidebar rendering, activeSection:', activeSection);

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      description: 'Dashboard overview'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      description: 'Manage users and roles'
    },
    {
      id: 'products',
      label: 'Product Management',
      icon: Package,
      description: 'Product verification queue'
    },
    {
      id: 'auth-settings',
      label: 'Authentication',
      icon: Shield,
      description: 'Social login & security'
    },
    {
      id: 'api-integrations',
      label: 'API Integrations',
      icon: Key,
      description: 'External API configurations'
    },
    {
      id: 'email-settings',
      label: 'Email Configuration',
      icon: Mail,
      description: 'Email service setup'
    },
    {
      id: 'database',
      label: 'Database Settings',
      icon: Database,
      description: 'Database configuration'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'System notifications'
    },
    {
      id: 'global-settings',
      label: 'Global Settings',
      icon: Globe,
      description: 'Application settings'
    },
    {
      id: 'billing',
      label: 'Billing & Plans',
      icon: CreditCard,
      description: 'Subscription management'
    },
    {
      id: 'system-settings',
      label: 'System Settings',
      icon: Settings,
      description: 'Advanced configurations'
    }
  ];

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 h-full transition-all duration-300 flex flex-col shadow-sm",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto hover:bg-gray-200"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  console.log('Menu item clicked:', item.id);
                  onSectionChange(item.id);
                }}
                className={cn(
                  "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200",
                  "hover:bg-blue-50 hover:text-blue-700",
                  isActive 
                    ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900",
                  isCollapsed ? "justify-center" : "justify-start"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", isCollapsed ? "" : "mr-3")} />
                {!isCollapsed && (
                  <div className="flex flex-col items-start min-w-0">
                    <span className="truncate">{item.label}</span>
                    <span className="text-xs text-gray-400 font-normal truncate">
                      {item.description}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
