
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Package, Shield, Database, Key, BarChart3 } from 'lucide-react';

interface OverviewProps {
  stats: {
    totalUsers: number;
    totalProducts: number;
    verifiedProducts: number;
    pendingApprovals: number;
    activeManufacturers: number;
    dailyScans: number;
  };
  onSectionChange: (section: string) => void;
}

const Overview = ({ stats, onSectionChange }: OverviewProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Dashboard Overview
        </h2>
        <p className="text-gray-600 mt-2">System administration and configuration panel</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Users</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Products</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalProducts.toLocaleString()}</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-slate-800">{stats.pendingApprovals}</p>
              </div>
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Verified Products</p>
                <p className="text-2xl font-bold text-slate-800">{stats.verifiedProducts.toLocaleString()}</p>
              </div>
              <Database className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Manufacturers</p>
                <p className="text-2xl font-bold text-slate-800">{stats.activeManufacturers}</p>
              </div>
              <Key className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Daily Scans</p>
                <p className="text-2xl font-bold text-slate-800">{stats.dailyScans.toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-cyan-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSectionChange('auth-settings')}
        >
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold">Authentication</h3>
            <p className="text-sm text-gray-600">Configure social login</p>
            <Badge variant="secondary" className="mt-2">4 providers</Badge>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSectionChange('api-integrations')}
        >
          <CardContent className="p-4 text-center">
            <Key className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold">API Integrations</h3>
            <p className="text-sm text-gray-600">Manage external APIs</p>
            <Badge variant="secondary" className="mt-2">6 services</Badge>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSectionChange('users')}
        >
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold">User Management</h3>
            <p className="text-sm text-gray-600">Manage user accounts</p>
            <Badge variant="secondary" className="mt-2">{stats.totalUsers.toLocaleString()} users</Badge>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSectionChange('products')}
        >
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <h3 className="font-semibold">Product Queue</h3>
            <p className="text-sm text-gray-600">Review pending products</p>
            <Badge variant="destructive" className="mt-2">{stats.pendingApprovals} pending</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
