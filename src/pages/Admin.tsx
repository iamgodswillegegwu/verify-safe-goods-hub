
import { useState } from 'react';
import { BarChart3, Users, Package, Shield, TrendingUp, Calendar, Eye, CheckCircle, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/Navigation';

const Admin = () => {
  const [timeFrame, setTimeFrame] = useState('month');
  
  const stats = {
    totalUsers: 8923,
    totalProducts: 15847,
    verificationsToday: 2847,
    pendingApprovals: 23,
    dailyGrowth: '+12.5%',
    monthlyGrowth: '+23.8%'
  };

  const pendingProducts = [
    {
      id: 1,
      name: 'Organic Face Moisturizer',
      manufacturer: 'Green Beauty Co.',
      category: 'Cosmetics',
      submittedDate: '2024-01-28',
      status: 'Pending Review'
    },
    {
      id: 2,
      name: 'Natural Hair Shampoo',
      manufacturer: 'EcoHair Solutions',
      category: 'Hair Care',
      submittedDate: '2024-01-27',
      status: 'Documentation Required'
    },
    {
      id: 3,
      name: 'Vitamin D Supplements',
      manufacturer: 'HealthFirst Labs',
      category: 'Supplements',
      submittedDate: '2024-01-26',
      status: 'Lab Review'
    }
  ];

  const recentActivity = [
    { action: 'Product Approved', details: 'Premium Face Cream by BeautyTech', time: '2 hours ago', type: 'approval' },
    { action: 'New Registration', details: 'NaturalCare Ltd. submitted company docs', time: '4 hours ago', type: 'registration' },
    { action: 'Verification Spike', details: '1,250 products verified in last hour', time: '6 hours ago', type: 'activity' },
    { action: 'Product Rejected', details: 'Unsafe ingredients detected', time: '8 hours ago', type: 'rejection' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'approval': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejection': return <X className="h-4 w-4 text-red-600" />;
      case 'registration': return <Users className="h-4 w-4 text-blue-600" />;
      default: return <TrendingUp className="h-4 w-4 text-purple-600" />;
    }
  };

  const handleApprove = (productId) => {
    console.log('Approving product:', productId);
    // Handle product approval
  };

  const handleReject = (productId) => {
    console.log('Rejecting product:', productId);
    // Handle product rejection
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
              <p className="text-slate-600">Monitor platform activity and manage product approvals</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeFrame} onValueChange={setTimeFrame}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Users</p>
                    <p className="text-2xl font-bold text-blue-800">{stats.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-blue-600 mt-1">{stats.dailyGrowth} from yesterday</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Total Products</p>
                    <p className="text-2xl font-bold text-green-800">{stats.totalProducts.toLocaleString()}</p>
                    <p className="text-xs text-green-600 mt-1">{stats.monthlyGrowth} this month</p>
                  </div>
                  <Package className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Today's Verifications</p>
                    <p className="text-2xl font-bold text-purple-800">{stats.verificationsToday.toLocaleString()}</p>
                    <p className="text-xs text-purple-600 mt-1">+15% from yesterday</p>
                  </div>
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">Pending Approvals</p>
                    <p className="text-2xl font-bold text-orange-800">{stats.pendingApprovals}</p>
                    <p className="text-xs text-orange-600 mt-1">Requires attention</p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="approvals" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>

            {/* Pending Approvals Tab */}
            <TabsContent value="approvals" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Products Awaiting Approval</CardTitle>
                  <CardDescription>
                    Review and approve or reject product registrations from manufacturers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-slate-800">{product.name}</h3>
                          <p className="text-sm text-slate-600">{product.manufacturer}</p>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              Submitted: {new Date(product.submittedDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            {product.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApprove(product.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleReject(product.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Verification Trends</CardTitle>
                    <CardDescription>Product verification activity over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-500">Chart visualization would go here</p>
                        <p className="text-sm text-gray-400">Integration with charting library needed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>Platform user acquisition metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-500">User growth chart would go here</p>
                        <p className="text-sm text-gray-400">Integration with charting library needed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Product Categories</CardTitle>
                  <CardDescription>Distribution of verified products by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-800">4,523</div>
                      <div className="text-sm text-blue-600">Cosmetics</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-800">3,847</div>
                      <div className="text-sm text-green-600">Food Products</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-800">2,156</div>
                      <div className="text-sm text-purple-600">Personal Care</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recent Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Activity</CardTitle>
                  <CardDescription>Recent actions and system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg bg-white">
                        <div className="mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{activity.action}</p>
                          <p className="text-sm text-slate-600">{activity.details}</p>
                          <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;
