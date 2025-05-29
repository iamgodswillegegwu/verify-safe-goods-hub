
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Settings, Users, Package, BarChart3, Shield, Database, Mail, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';

const SuperAdmin = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Super Admin Dashboard</h1>
          <p className="text-slate-600">System administration and configuration panel</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="system" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Configuration
                </CardTitle>
                <CardDescription>
                  Configure core system settings and features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Email Verification</h4>
                      <p className="text-sm text-slate-600 mb-3">Configure email verification for new users</p>
                      <Badge variant="secondary">Currently Enabled</Badge>
                      <Button variant="outline" size="sm" className="ml-2">Configure</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Product Verification</h4>
                      <p className="text-sm text-slate-600 mb-3">Manage product verification settings</p>
                      <Badge variant="secondary">Auto-Approval: Off</Badge>
                      <Button variant="outline" size="sm" className="ml-2">Configure</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Scan Limits</h4>
                      <p className="text-sm text-slate-600 mb-3">Set daily scan limits for users</p>
                      <Badge variant="secondary">Free: 10/day</Badge>
                      <Button variant="outline" size="sm" className="ml-2">Configure</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Maintenance Mode</h4>
                      <p className="text-sm text-slate-600 mb-3">Enable maintenance mode for system updates</p>
                      <Badge variant="outline">Disabled</Badge>
                      <Button variant="outline" size="sm" className="ml-2">Toggle</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage user accounts, roles, and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Recent User Activity</h4>
                    <Button variant="outline" size="sm">View All Users</Button>
                  </div>
                  <p className="text-slate-600">User management features would be implemented here, including:</p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-600">
                    <li>View and search all users</li>
                    <li>Manage user roles and permissions</li>
                    <li>Suspend or activate user accounts</li>
                    <li>View user activity logs</li>
                    <li>Export user data</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Product Management
                </CardTitle>
                <CardDescription>
                  Manage product database and verification queue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Pending Product Approvals</h4>
                    <Button variant="outline" size="sm">Review Queue</Button>
                  </div>
                  <p className="text-slate-600">Product management features would include:</p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-600">
                    <li>Review and approve new product submissions</li>
                    <li>Manage product categories</li>
                    <li>Bulk import/export product data</li>
                    <li>Monitor verification accuracy</li>
                    <li>Handle product disputes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys & Integrations
                </CardTitle>
                <CardDescription>
                  Configure external services and API integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Service (Resend)
                        </h4>
                        <p className="text-sm text-slate-600 mb-3">Configure email sending service</p>
                        <Badge variant="destructive">Not Configured</Badge>
                        <Button variant="outline" size="sm" className="ml-2">Configure</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Google OAuth</h4>
                        <p className="text-sm text-slate-600 mb-3">Configure Google sign-in</p>
                        <Badge variant="destructive">Not Configured</Badge>
                        <Button variant="outline" size="sm" className="ml-2">Configure</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Facebook OAuth</h4>
                        <p className="text-sm text-slate-600 mb-3">Configure Facebook sign-in</p>
                        <Badge variant="destructive">Not Configured</Badge>
                        <Button variant="outline" size="sm" className="ml-2">Configure</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Payment Processing</h4>
                        <p className="text-sm text-slate-600 mb-3">Configure Stripe payments</p>
                        <Badge variant="destructive">Not Configured</Badge>
                        <Button variant="outline" size="sm" className="ml-2">Configure</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure security policies and monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Password Policy</h4>
                        <p className="text-sm text-slate-600 mb-3">Configure password requirements</p>
                        <Badge variant="secondary">Strong Policy Active</Badge>
                        <Button variant="outline" size="sm" className="ml-2">Configure</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Two-Factor Auth</h4>
                        <p className="text-sm text-slate-600 mb-3">Enable 2FA for admin accounts</p>
                        <Badge variant="outline">Optional</Badge>
                        <Button variant="outline" size="sm" className="ml-2">Configure</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Session Management</h4>
                        <p className="text-sm text-slate-600 mb-3">Configure session timeouts</p>
                        <Badge variant="secondary">24h Timeout</Badge>
                        <Button variant="outline" size="sm" className="ml-2">Configure</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Audit Logs</h4>
                        <p className="text-sm text-slate-600 mb-3">View system audit logs</p>
                        <Badge variant="secondary">Enabled</Badge>
                        <Button variant="outline" size="sm" className="ml-2">View Logs</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SuperAdmin;
