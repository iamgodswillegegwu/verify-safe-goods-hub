
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CreditCard, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Search,
  Filter,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PaymentTransaction, Subscriber, SubscriptionPlan } from '@/types/payment';

const PaymentManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      
      // Load subscription plans
      const { data: plansData, error: plansError } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price_monthly', { ascending: true });

      if (plansError) throw plansError;
      setSubscriptionPlans(plansData || []);

      // Note: These tables don't exist yet in the database types, so we'll handle gracefully
      try {
        // Try to load payment transactions if table exists
        const { data: transactionsData } = await supabase
          .from('payment_transactions' as any)
          .select(`
            *,
            profiles:user_id (
              first_name,
              last_name,
              email
            )
          `)
          .order('created_at', { ascending: false })
          .limit(100);

        setTransactions(transactionsData || []);
      } catch (error) {
        console.log('Payment transactions table not available yet');
        setTransactions([]);
      }

      try {
        // Try to load subscribers if table exists
        const { data: subscribersData } = await supabase
          .from('subscribers' as any)
          .select(`
            *,
            subscription_plans (*),
            profiles:user_id (
              first_name,
              last_name,
              email
            )
          `)
          .order('created_at', { ascending: false });

        setSubscribers(subscribersData || []);
      } catch (error) {
        console.log('Subscribers table not available yet');
        setSubscribers([]);
      }

    } catch (error) {
      console.error('Error loading payment data:', error);
      toast({
        title: "Error",
        description: "Failed to load payment data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStats = () => {
    const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const successfulTransactions = transactions.filter(t => t.status === 'succeeded').length;
    const activeSubscribers = subscribers.filter(s => s.status === 'active').length;
    
    return {
      totalRevenue,
      totalTransactions: transactions.length,
      successfulTransactions,
      activeSubscribers,
      totalSubscribers: subscribers.length
    };
  };

  const stats = getPaymentStats();

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm === '' || 
      transaction.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || transaction.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = searchTerm === '' || 
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || subscriber.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Payment Management</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Payment Statistics */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6 text-center">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">
              ${stats.totalRevenue.toFixed(2)}
            </div>
            <div className="text-sm text-green-600">Total Revenue</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6 text-center">
            <CreditCard className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-800">{stats.totalTransactions}</div>
            <div className="text-sm text-blue-600">Total Transactions</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-800">{stats.successfulTransactions}</div>
            <div className="text-sm text-purple-600">Successful Payments</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-800">{stats.activeSubscribers}</div>
            <div className="text-sm text-orange-600">Active Subscribers</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-slate-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">{stats.totalSubscribers}</div>
            <div className="text-sm text-slate-600">Total Subscribers</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search by email, name, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="succeeded">Succeeded</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {/* Payment Management Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Payment Transactions</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Payment Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Customer</th>
                        <th className="text-left p-2">Amount</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Description</th>
                        <th className="text-left p-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b">
                          <td className="p-2">
                            <div>
                              <div className="font-medium">
                                {transaction.profiles?.first_name} {transaction.profiles?.last_name}
                              </div>
                              <div className="text-sm text-slate-600">
                                {transaction.profiles?.email}
                              </div>
                            </div>
                          </td>
                          <td className="p-2">
                            <span className="font-medium">
                              ${transaction.amount?.toFixed(2)} {transaction.currency?.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-2">
                            <Badge 
                              variant={transaction.status === 'succeeded' ? 'default' : 'destructive'}
                              className={transaction.status === 'succeeded' ? 'bg-green-600' : ''}
                            >
                              {transaction.status}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <span className="text-sm">{transaction.description || 'N/A'}</span>
                          </td>
                          <td className="p-2">
                            <span className="text-sm">
                              {new Date(transaction.created_at).toLocaleDateString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">No payment transactions found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscribers">
          <Card>
            <CardHeader>
              <CardTitle>Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSubscribers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Customer</th>
                        <th className="text-left p-2">Plan</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Period</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubscribers.map((subscriber) => (
                        <tr key={subscriber.id} className="border-b">
                          <td className="p-2">
                            <div>
                              <div className="font-medium">
                                {subscriber.profiles?.first_name} {subscriber.profiles?.last_name}
                              </div>
                              <div className="text-sm text-slate-600">
                                {subscriber.email}
                              </div>
                            </div>
                          </td>
                          <td className="p-2">
                            <div>
                              <div className="font-medium">
                                {subscriber.subscription_plans?.name || 'N/A'}
                              </div>
                              <div className="text-sm text-slate-600">
                                ${subscriber.subscription_plans?.price_monthly}/month
                              </div>
                            </div>
                          </td>
                          <td className="p-2">
                            <Badge 
                              variant={subscriber.status === 'active' ? 'default' : 'destructive'}
                              className={subscriber.status === 'active' ? 'bg-green-600' : ''}
                            >
                              {subscriber.status}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <div className="text-sm">
                              {subscriber.current_period_start && (
                                <div>
                                  Start: {new Date(subscriber.current_period_start).toLocaleDateString()}
                                </div>
                              )}
                              {subscriber.current_period_end && (
                                <div>
                                  End: {new Date(subscriber.current_period_end).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">No subscribers found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {subscriptionPlans.map((plan) => (
                  <Card key={plan.id} className="relative">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {plan.name}
                        <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                          {plan.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="text-2xl font-bold">${plan.price_monthly}/month</div>
                          <div className="text-sm text-slate-600">${plan.price_yearly}/year</div>
                        </div>
                        
                        {plan.scan_limit && (
                          <div className="text-sm">
                            <strong>Scan Limit:</strong> {plan.scan_limit} per day
                          </div>
                        )}
                        
                        <div className="space-y-1">
                          <div className="font-medium text-sm">Features:</div>
                          <ul className="text-sm text-slate-600 space-y-1">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-green-600">✓</span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <Button variant="outline" size="sm" className="w-full">
                          Edit Plan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentManagement;
