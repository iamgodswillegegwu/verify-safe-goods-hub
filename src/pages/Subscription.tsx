
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import SubscriptionCard from '@/components/SubscriptionCard';

interface Plan {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  scan_limit: number | null;
  is_active: boolean;
}

const Subscription = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { subscription } = useSubscription();

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true)
          .order('price_monthly', { ascending: true });

        if (error) throw error;
        
        if (data) {
          setPlans(data.map(plan => ({
            id: plan.id,
            name: plan.name,
            price_monthly: plan.price_monthly || 0,
            price_yearly: plan.price_yearly || 0,
            features: Array.isArray(plan.features) ? plan.features : [],
            scan_limit: plan.scan_limit,
            is_active: plan.is_active || false
          })));
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading subscription plans...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Select the perfect plan for your product verification needs. 
            Upgrade or downgrade anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`font-medium ${!isAnnual ? 'text-blue-600' : 'text-slate-500'}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-blue-600"
            />
            <span className={`font-medium ${isAnnual ? 'text-blue-600' : 'text-slate-500'}`}>
              Annual
            </span>
            {isAnnual && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Save 17%
              </Badge>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <SubscriptionCard
              key={plan.id}
              plan={plan}
              isAnnual={isAnnual}
              isPopular={plan.name === 'Premium'}
              currentPlan={subscription.plan?.id === plan.id}
            />
          ))}
        </div>

        {/* Current Subscription Status */}
        {user && subscription.subscribed && (
          <div className="mt-16 max-w-2xl mx-auto">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Current Subscription</CardTitle>
                <CardDescription>
                  You are currently subscribed to the {subscription.plan?.name} plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                {subscription.current_period_end && (
                  <p className="text-green-700">
                    {subscription.cancel_at_period_end 
                      ? `Your subscription will end on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                      : `Your subscription renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                    }
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Frequently Asked Questions</h2>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change my plan anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                  and we'll prorate any differences in your next billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Yes! All paid plans come with a 14-day free trial. No credit card required to start. 
                  You can explore all premium features during the trial period.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens if I exceed my scan limit?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Free users will need to wait until the next day for their daily scans to reset, 
                  or they can upgrade to a premium plan for unlimited scanning.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Subscription;
