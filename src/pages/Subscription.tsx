
import { useState } from 'react';
import { Check, Star, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Navigation from '@/components/Navigation';

const Subscription = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for occasional users',
      price: { monthly: 0, annual: 0 },
      icon: Star,
      color: 'gray',
      features: [
        '5 product scans per day',
        'Basic product search',
        'Standard verification results',
        'Community support'
      ],
      limitations: [
        'Limited daily scans',
        'No priority support',
        'Basic features only'
      ]
    },
    {
      name: 'Premium',
      description: 'For regular users and small businesses',
      price: { monthly: 9.99, annual: 99.99 },
      icon: Zap,
      color: 'blue',
      popular: true,
      features: [
        'Unlimited product scans',
        'Advanced search filters',
        'Detailed verification reports',
        'Priority customer support',
        'Batch scanning capabilities',
        'Export scan history',
        'Email notifications'
      ]
    },
    {
      name: 'Enterprise',
      description: 'For manufacturers and large organizations',
      price: { monthly: 49.99, annual: 499.99 },
      icon: Crown,
      color: 'purple',
      features: [
        'Everything in Premium',
        'Product registration portal',
        'Admin dashboard access',
        'Custom API integration',
        'White-label options',
        'Dedicated account manager',
        'Custom compliance reports',
        'Bulk product management'
      ]
    }
  ];

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
            <Card 
              key={index} 
              className={`relative ${colorClasses[plan.color]} border-2 transition-transform hover:scale-105 duration-200 ${
                plan.popular ? 'ring-2 ring-blue-400 ring-offset-2' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  <plan.icon className={`h-12 w-12 ${
                    plan.color === 'gray' ? 'text-gray-600' :
                    plan.color === 'blue' ? 'text-blue-600' : 'text-purple-600'
                  }`} />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800">{plan.name}</CardTitle>
                <CardDescription className="text-slate-600">{plan.description}</CardDescription>
                
                <div className="mt-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-slate-800">
                      ${isAnnual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className="text-slate-500">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  </div>
                  {isAnnual && plan.price.monthly > 0 && (
                    <p className="text-sm text-slate-500 mt-1">
                      ${(plan.price.monthly * 12).toFixed(2)} billed annually
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <Button 
                  className={`w-full ${buttonClasses[plan.color]} text-white font-semibold py-3`}
                  size="lg"
                >
                  {plan.price.monthly === 0 ? 'Get Started Free' : 'Start Free Trial'}
                </Button>

                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Features included:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-slate-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-slate-800 mb-3">Limitations:</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="flex items-start gap-2">
                          <span className="h-5 w-5 text-orange-500 shrink-0 mt-0.5">×</span>
                          <span className="text-slate-500 text-sm">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

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
