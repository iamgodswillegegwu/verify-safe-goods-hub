
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  scan_limit: number | null;
  is_active?: boolean;
}

interface SubscriptionData {
  subscribed: boolean;
  plan: SubscriptionPlan | null;
  status: string;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<SubscriptionData>({
    subscribed: false,
    plan: null,
    status: 'inactive'
  });
  const [loading, setLoading] = useState(false);

  const checkSubscription = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Check if user has an active subscription
      const { data: subscriberData, error: subscriberError } = await supabase
        .from('subscribers')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (subscriberError) throw subscriberError;

      if (subscriberData && subscriberData.subscription_plans) {
        setSubscription({
          subscribed: true,
          plan: subscriberData.subscription_plans as SubscriptionPlan,
          status: subscriberData.status,
          current_period_end: subscriberData.current_period_end,
          cancel_at_period_end: subscriberData.cancel_at_period_end
        });
      } else {
        setSubscription({
          subscribed: false,
          plan: null,
          status: 'inactive'
        });
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast({
        title: "Error",
        description: "Failed to check subscription status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCheckoutSession = async (planId: string, isAnnual: boolean = false) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // For now, just show a placeholder message
      toast({
        title: "Coming Soon",
        description: "Subscription checkout will be available soon!",
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // For now, just show a placeholder message
      toast({
        title: "Coming Soon",
        description: "Customer portal will be available soon!",
      });
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open customer portal",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  return {
    subscription,
    loading,
    checkSubscription,
    createCheckoutSession,
    openCustomerPortal,
  };
};
