
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Search, Database, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Search,
      title: 'Product Verification',
      description: 'Instantly verify product authenticity using our comprehensive database',
      features: [
        'Barcode scanning technology',
        'Real-time verification results',
        'Multiple database sources',
        'Confidence scoring system'
      ],
      color: 'blue'
    },
    {
      icon: Database,
      title: 'NAFDAC Integration',
      description: 'Direct access to official NAFDAC product registration database',
      features: [
        'Official regulatory data',
        'Registration status checks',
        'Expiry date verification',
        'Manufacturer validation'
      ],
      color: 'green'
    },
    {
      icon: Shield,
      title: 'Counterfeit Detection',
      description: 'Advanced algorithms to identify fake and counterfeit products',
      features: [
        'AI-powered analysis',
        'Pattern recognition',
        'Risk assessment',
        'Alert notifications'
      ],
      color: 'red'
    },
    {
      icon: Users,
      title: 'Business Solutions',
      description: 'Comprehensive verification tools for businesses and manufacturers',
      features: [
        'Bulk verification capabilities',
        'API integration options',
        'Custom reporting dashboards',
        'White-label solutions'
      ],
      color: 'purple'
    }
  ];

  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50 text-blue-600',
    green: 'border-green-200 bg-green-50 text-green-600',
    red: 'border-red-200 bg-red-50 text-red-600',
    purple: 'border-purple-200 bg-purple-50 text-purple-600'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Our Services</h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Comprehensive product verification solutions to protect consumers and businesses 
            from counterfeit products in the Nigerian market.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {services.map((service, index) => (
            <Card key={index} className={`${colorClasses[service.color]} border-2 hover:shadow-lg transition-shadow duration-200`}>
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <service.icon className={`h-16 w-16 ${service.color === 'blue' ? 'text-blue-600' : 
                    service.color === 'green' ? 'text-green-600' : 
                    service.color === 'red' ? 'text-red-600' : 'text-purple-600'}`} />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800">{service.title}</CardTitle>
                <CardDescription className="text-slate-600 text-base">{service.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-slate-600 mb-6">
            Join thousands of users who trust SafeGoods for product verification
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Start Verifying Products
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/subscription')}
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
            >
              View Pricing Plans
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Services;
