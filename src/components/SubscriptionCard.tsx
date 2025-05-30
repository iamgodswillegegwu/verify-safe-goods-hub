
import { useState } from 'react';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  scan_limit: number | null;
  is_active: boolean;
}

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  isAnnual: boolean;
  isPopular?: boolean;
  currentPlan?: boolean;
}

const SubscriptionCard = ({ plan, isAnnual, isPopular, currentPlan }: SubscriptionCardProps) => {
  const { createCheckoutSession, openCustomerPortal, loading } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);

  const getIcon = () => {
    switch (plan.name.toLowerCase()) {
      case 'free': return Star;
      case 'premium': return Zap;
      case 'enterprise': return Crown;
      default: return Star;
    }
  };

  const getColor = () => {
    switch (plan.name.toLowerCase()) {
      case 'free': return 'gray';
      case 'premium': return 'blue';
      case 'enterprise': return 'purple';
      default: return 'gray';
    }
  };

  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      if (currentPlan && plan.name !== 'Free') {
        await openCustomerPortal();
      } else {
        await createCheckoutSession(plan.id, isAnnual);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const getPrice = () => {
    if (plan.price === 0) return 0;
    return isAnnual ? plan.price * 12 * 0.83 : plan.price; // 17% discount for annual
  };

  const Icon = getIcon();
  const color = getColor();
  const price = getPrice();

  const colorClasses = {
    gray: 'border-gray-200 bg-gray-50',
    blue: 'border-blue-200 bg-blue-50',
    purple: 'border-purple-200 bg-purple-50'
  };

  const buttonClasses = {
    gray: 'bg-gray-600 hover:bg-gray-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
    purple: 'bg-purple-600 hover:bg-purple-700'
  };

  return (
    <Card className={`relative ${colorClasses[color]} border-2 transition-transform hover:scale-105 duration-200 ${
      isPopular ? 'ring-2 ring-blue-400 ring-offset-2' : ''
    } ${currentPlan ? 'ring-2 ring-green-400 ring-offset-2' : ''}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-600 text-white px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}

      {currentPlan && (
        <div className="absolute -top-4 right-4">
          <Badge className="bg-green-600 text-white px-4 py-1">
            Current Plan
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <Icon className={`h-12 w-12 ${
            color === 'gray' ? 'text-gray-600' :
            color === 'blue' ? 'text-blue-600' : 'text-purple-600'
          }`} />
        </div>
        <CardTitle className="text-2xl font-bold text-slate-800">{plan.name}</CardTitle>
        <CardDescription className="text-slate-600">
          {plan.name === 'Free' ? 'Perfect for occasional users' :
           plan.name === 'Premium' ? 'For regular users and small businesses' :
           'For manufacturers and large organizations'}
        </CardDescription>
        
        <div className="mt-4">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-slate-800">
              ${price.toFixed(2)}
            </span>
            <span className="text-slate-500">
              /{isAnnual ? 'year' : 'month'}
            </span>
          </div>
          {isAnnual && plan.price > 0 && (
            <p className="text-sm text-slate-500 mt-1">
              Save 17% with annual billing
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Button 
          className={`w-full ${buttonClasses[color]} text-white font-semibold py-3`}
          size="lg"
          onClick={handleSubscribe}
          disabled={loading || isProcessing}
        >
          {currentPlan && plan.name !== 'Free' ? 'Manage Subscription' :
           plan.price === 0 ? 'Get Started' : 'Subscribe Now'}
        </Button>

        <div>
          <h4 className="font-semibold text-slate-800 mb-3">Features included:</h4>
          <ul className="space-y-2">
            {Array.isArray(plan.features) && plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
