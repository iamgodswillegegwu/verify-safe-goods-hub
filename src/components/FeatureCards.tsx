
import { Shield, Scan, Users, Award, Globe, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FeatureCards = () => {
  const features = [
    {
      icon: Shield,
      title: 'Product Safety',
      description: 'Comprehensive verification of cosmetic and food products for consumer safety',
      color: 'blue'
    },
    {
      icon: Scan,
      title: 'Smart Scanning',
      description: 'AI-powered scanning technology for instant product recognition and verification',
      color: 'green'
    },
    {
      icon: Users,
      title: 'Manufacturer Portal',
      description: 'Dedicated platform for manufacturers to register and manage their products',
      color: 'purple'
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Rigorous lab testing and certification requirements for product approval',
      color: 'orange'
    },
    {
      icon: Globe,
      title: 'Global Database',
      description: 'Comprehensive database organized by countries, states, and cities worldwide',
      color: 'cyan'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Live product verification with instant access to the latest safety information',
      color: 'pink'
    }
  ];

  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-600',
    green: 'from-green-50 to-green-100 border-green-200 text-green-600',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-600',
    orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-600',
    cyan: 'from-cyan-50 to-cyan-100 border-cyan-200 text-cyan-600',
    pink: 'from-pink-50 to-pink-100 border-pink-200 text-pink-600'
  };

  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Choose SafeGoods?</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Our comprehensive platform ensures product safety and authenticity through advanced technology and rigorous verification processes
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className={`bg-gradient-to-br ${colorClasses[feature.color]} transition-transform hover:scale-105 duration-200`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <feature.icon className={`h-8 w-8 ${colorClasses[feature.color].split(' ')[2]}`} />
                <CardTitle className="text-slate-800">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-600">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;
