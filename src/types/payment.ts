
export interface PaymentTransaction {
  id: string;
  user_id: string;
  stripe_payment_intent_id?: string;
  stripe_session_id?: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    email: string;
  };
}

export interface Subscriber {
  id: string;
  user_id: string;
  email: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_plan_id?: string;
  status: string;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
  created_at: string;
  updated_at: string;
  subscription_plans?: {
    name: string;
    price_monthly: number;
    price_yearly: number;
  };
  profiles?: {
    first_name?: string;
    last_name?: string;
    email: string;
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  stripe_price_id_monthly?: string;
  stripe_price_id_yearly?: string;
  features: string[];
  scan_limit?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
