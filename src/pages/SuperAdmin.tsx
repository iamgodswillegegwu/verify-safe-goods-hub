
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import AdminSidebar from '@/components/AdminSidebar';
import AuthenticationSettings from '@/components/admin/AuthenticationSettings';
import APIIntegrations from '@/components/admin/APIIntegrations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Package, BarChart3, Shield, Database, Mail, Key, Bell, Globe, CreditCard } from 'lucide-react';

const SuperAdmin = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 8923,
    totalProducts: 15847,
    verifiedProducts: 12439,
    pendingApprovals: 234,
    activeManufacturers: 156,
    dailyScans: 2847
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    // In a real app, you'd check if the user has admin role
    // For now, we'll allow any authenticated user to access this
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'auth-settings':
        return <AuthenticationSettings />;
      case 'api-integrations':
        return <APIIntegrations />;
      case 'users':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-6 w-6" />
                User Management
              </h2>
              <p className="text-gray-600 mt-2">Manage user accounts, roles, and permissions</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">User management features would be implemented here, including:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
                  <li>View and search all users</li>
                  <li>Manage user roles and permissions</li>
                  <li>Suspend or activate user accounts</li>
                  <li>View user activity logs</li>
                  <li>Export user data</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );
      case 'products':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="h-6 w-6" />
                Product Management
              </h2>
              <p className="text-gray-600 mt-2">Manage product database and verification queue</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">Product management features would include:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
                  <li>Review and approve new product submissions</li>
                  <li>Manage product categories</li>
                  <li>Bulk import/export product data</li>
                  <li>Monitor verification accuracy</li>
                  <li>Handle product disputes</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );
      default:
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
                onClick={() => setActiveSection('auth-settings')}
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
                onClick={() => setActiveSection('api-integrations')}
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
                onClick={() => setActiveSection('users')}
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
                onClick={() => setActiveSection('products')}
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <AdminSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default SuperAdmin;
