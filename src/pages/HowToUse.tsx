
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Search, Shield, CheckCircle, Camera, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HowToUse = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Camera,
      title: 'Scan or Search',
      description: 'Use your device camera to scan product barcodes or manually search by product name',
      details: [
        'Point camera at barcode',
        'Ensure good lighting',
        'Hold steady until scanned',
        'Or type product name manually'
      ]
    },
    {
      icon: Search,
      title: 'Verification Process',
      description: 'Our system searches multiple databases including NAFDAC registry',
      details: [
        'Cross-reference with NAFDAC database',
        'Check manufacturer records',
        'Validate registration status',
        'Analyze product information'
      ]
    },
    {
      icon: Shield,
      title: 'Get Results',
      description: 'Receive instant verification results with confidence scores',
      details: [
        'Clear verification status',
        'Confidence percentage',
        'Product authenticity score',
        'Detailed product information'
      ]
    },
    {
      icon: CheckCircle,
      title: 'Make Informed Decisions',
      description: 'Use the verification results to make safe purchasing decisions',
      details: [
        'View product safety status',
        'Check expiry dates',
        'Verify manufacturer details',
        'Save to favorites for future reference'
      ]
    }
  ];

  const tips = [
    {
      title: 'Best Scanning Practices',
      items: [
        'Ensure adequate lighting when scanning',
        'Hold the device steady for clear barcode capture',
        'Clean the barcode surface if dirty or damaged',
        'Try different angles if the first scan fails'
      ]
    },
    {
      title: 'Understanding Results',
      items: [
        'Green status means verified and safe',
        'Yellow status requires caution',
        'Red status indicates potential counterfeit',
        'Confidence scores help assess reliability'
      ]
    },
    {
      title: 'When to Be Cautious',
      items: [
        'Product not found in any database',
        'Mismatched manufacturer information',
        'Expired registration or certification',
        'Unusual pricing or suspicious packaging'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">How to Use SafeGoods</h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Learn how to effectively use our product verification system to protect yourself 
            from counterfeit products in just a few simple steps.
          </p>
        </div>

        {/* Step-by-step guide */}
        <div className="grid gap-8 max-w-4xl mx-auto mb-16">
          {steps.map((step, index) => (
            <Card key={index} className="bg-white border border-blue-100 hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">{index + 1}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <step.icon className="h-8 w-8 text-blue-600" />
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-800">{step.title}</CardTitle>
                      <CardDescription className="text-slate-600">{step.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                      <span className="text-slate-700 text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips and Best Practices */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Tips & Best Practices</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {tips.map((tip, index) => (
              <Card key={index} className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-800">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tip.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-slate-600 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Ready to Start Verifying?</h2>
          <p className="text-xl text-slate-600 mb-6">
            Try our product verification system now and protect yourself from counterfeit products
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Start Scanning Products
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/services')}
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
            >
              Learn More About Services
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowToUse;
