
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Package, 
  Building2, 
  TrendingUp, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OverviewStats {
  totalUsers: number;
  totalProducts: number;
  totalManufacturers: number;
  totalVerifications: number;
  pendingProducts: number;
  recentActivity: any[];
}

interface OverviewProps {
  stats: OverviewStats;
  onSectionChange: (section: string) => void;
}

const Overview = ({ stats, onSectionChange }: OverviewProps) => {
  const [loading, setLoading] = useState(false);
  const [systemAlerts, setSystemAlerts] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchSystemAlerts();
  }, []);

  const fetchSystemAlerts = async () => {
    try {
      // Fetch recent critical activities or issues
      const { data: pendingProducts } = await supabase
        .from('products')
        .select('name, created_at')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: recentReports } = await supabase
        .from('product_reports')
        .select('reason, created_at')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(3);

      const alerts = [
        ...(pendingProducts?.map(p => ({
          type: 'warning',
          message: `Product "${p.name}" is pending approval`,
          timestamp: p.created_at
        })) || []),
        ...(recentReports?.map(r => ({
          type: 'error',
          message: `New product report: ${r.reason}`,
          timestamp: r.created_at
        })) || [])
      ].slice(0, 8);

      setSystemAlerts(alerts);
    } catch (error) {
      console.error('Error fetching system alerts:', error);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600 mt-2">Overview of system metrics and recent activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSectionChange('users')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSectionChange('products')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                {stats.pendingProducts > 0 && (
                  <p className="text-sm text-orange-600">{stats.pendingProducts} pending</p>
                )}
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Manufacturers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalManufacturers}</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verifications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVerifications}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="alerts">System Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent System Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentActivity && stats.recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.activity_type}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No recent activity to display
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                System Alerts
                <Button variant="outline" size="sm" onClick={fetchSystemAlerts}>
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {systemAlerts.length > 0 ? (
                <div className="space-y-3">
                  {systemAlerts.map((alert, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge 
                        variant={alert.type === 'error' ? 'destructive' : alert.type === 'warning' ? 'secondary' : 'default'}
                        className="text-xs"
                      >
                        {alert.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No system alerts at this time
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => onSectionChange('users')}
            >
              <Users className="h-6 w-6" />
              Manage Users
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => onSectionChange('products')}
            >
              <Package className="h-6 w-6" />
              Review Products
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => onSectionChange('api-integrations')}
            >
              <TrendingUp className="h-6 w-6" />
              API Settings
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => onSectionChange('payments')}
            >
              <Activity className="h-6 w-6" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
