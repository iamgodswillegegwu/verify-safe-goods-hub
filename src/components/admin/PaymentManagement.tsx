
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, DollarSign, Users, TrendingUp, Search, Filter } from 'lucide-react';

interface PaymentTransaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  stripe_session_id?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface Subscriber {
  id: string;
  user_id: string;
  email: string;
  status: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_plan_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

const PaymentManagement = () => {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeSubscribers: 0,
    totalTransactions: 0,
    successRate: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch transactions
      const { data: transactionData, error: transactionError } = await supabase
        .from('payment_transactions')
        .select(`
          *,
          profiles:user_id(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (transactionError) {
        console.error('Error fetching transactions:', transactionError);
      } else {
        // Transform the data to handle the join structure
        const transformedTransactions = transactionData?.map(t => ({
          ...t,
          profiles: Array.isArray(t.profiles) ? t.profiles[0] : t.profiles
        })) || [];
        setTransactions(transformedTransactions);
      }

      // Fetch subscribers
      const { data: subscriberData, error: subscriberError } = await supabase
        .from('subscribers')
        .select(`
          *,
          profiles:user_id(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (subscriberError) {
        console.error('Error fetching subscribers:', subscriberError);
      } else {
        // Transform the data to handle the join structure
        const transformedSubscribers = subscriberData?.map(s => ({
          ...s,
          profiles: Array.isArray(s.profiles) ? s.profiles[0] : s.profiles
        })) || [];
        setSubscribers(transformedSubscribers);
      }

      // Calculate stats
      if (transactionData && subscriberData) {
        const totalRevenue = transactionData
          .filter(t => t.status === 'completed')
          .reduce((sum, t) => sum + (t.amount || 0), 0);
        
        const activeSubscribers = subscriberData.filter(s => s.status === 'active').length;
        const successfulTransactions = transactionData.filter(t => t.status === 'completed').length;
        const successRate = transactionData.length > 0 ? (successfulTransactions / transactionData.length) * 100 : 0;

        setStats({
          totalRevenue: totalRevenue / 100, // Convert from cents
          activeSubscribers,
          totalTransactions: transactionData.length,
          successRate
        });
      }

    } catch (error) {
      console.error('Error fetching payment data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payment data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = 
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${subscriber.profiles?.first_name || ''} ${subscriber.profiles?.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || subscriber.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatAmount = (amount: number, currency: string = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            Payment Management
          </h2>
          <p className="text-gray-600 mt-2">Loading payment data...</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="h-6 w-6" />
          Payment Management
        </h2>
        <p className="text-gray-600 mt-2">Monitor transactions, subscriptions, and revenue</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeSubscribers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.successRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by email, transaction ID, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchData}>
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Transactions and Subscribers */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Payment Transactions ({filteredTransactions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No transactions found matching your criteria
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {formatAmount(transaction.amount, transaction.currency)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {transaction.profiles?.email || 'Unknown user'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 ml-8">
                            <span>ID: {transaction.id.slice(0, 8)}...</span>
                            <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
                            {transaction.description && (
                              <span>{transaction.description}</span>
                            )}
                          </div>
                        </div>
                        <Badge variant={getStatusBadgeVariant(transaction.status)}>
                          {transaction.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscribers">
          <Card>
            <CardHeader>
              <CardTitle>Subscribers ({filteredSubscribers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSubscribers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No subscribers found matching your criteria
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSubscribers.map((subscriber) => (
                    <div key={subscriber.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Users className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {subscriber.profiles?.first_name && subscriber.profiles?.last_name
                                  ? `${subscriber.profiles.first_name} ${subscriber.profiles.last_name}`
                                  : 'Unknown user'}
                              </p>
                              <p className="text-sm text-gray-500">{subscriber.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 ml-8">
                            <span>Started: {new Date(subscriber.created_at).toLocaleDateString()}</span>
                            {subscriber.current_period_end && (
                              <span>
                                Expires: {new Date(subscriber.current_period_end).toLocaleDateString()}
                              </span>
                            )}
                            {subscriber.cancel_at_period_end && (
                              <span className="text-orange-600">Cancelling at period end</span>
                            )}
                          </div>
                        </div>
                        <Badge variant={getStatusBadgeVariant(subscriber.status)}>
                          {subscriber.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentManagement;
