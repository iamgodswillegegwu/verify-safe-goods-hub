
import { useState } from 'react';
import { Camera, Search, Shield, Users, BarChart3, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ProductScanner from '@/components/ProductScanner';
import VerificationResult from '@/components/VerificationResult';
import FeatureCards from '@/components/FeatureCards';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    // Simulate API call for product verification
    console.log('Searching for product:', searchQuery);
    
    // Mock verification result
    const mockResult = {
      productName: searchQuery,
      isVerified: Math.random() > 0.5,
      manufacturer: 'Sample Manufacturer',
      registrationDate: '2024-01-15',
      certificationNumber: 'CERT-2024-001',
      similarProducts: [
        { name: 'Similar Product 1', manufacturer: 'Verified Brand A', verified: true },
        { name: 'Similar Product 2', manufacturer: 'Verified Brand B', verified: true },
      ]
    };
    
    setVerificationResult(mockResult);
  };

  const handleScanResult = (result) => {
    setVerificationResult(result);
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <Hero />
      
      <main className="container mx-auto px-4 py-12">
        {/* Product Verification Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Verify Your Products</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Scan or search for cosmetic and food products to verify their authenticity and safety
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-blue-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50">
                <CardTitle className="text-center text-slate-800">Product Verification</CardTitle>
                <CardDescription className="text-center">
                  Choose your preferred method to verify products
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Search Input */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                      <Search className="h-5 w-5 text-blue-600" />
                      Search by Name
                    </h3>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter product name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 border-blue-200 focus:border-blue-400"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      <Button 
                        onClick={handleSearch}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Camera Scanner */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                      <Camera className="h-5 w-5 text-green-600" />
                      Scan Product
                    </h3>
                    <Button
                      onClick={() => setIsScanning(!isScanning)}
                      variant="outline"
                      className="w-full border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {isScanning ? 'Stop Scanner' : 'Start Scanner'}
                    </Button>
                  </div>
                </div>

                {/* Scanner Component */}
                {isScanning && (
                  <div className="mt-6">
                    <ProductScanner onResult={handleScanResult} />
                  </div>
                )}

                {/* Verification Result */}
                {verificationResult && (
                  <div className="mt-6">
                    <VerificationResult result={verificationResult} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Feature Cards */}
        <FeatureCards />

        {/* Statistics Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Platform Statistics</h2>
            <p className="text-slate-600">Real-time data about our verification platform</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-800">15,847</div>
                <div className="text-sm text-blue-600">Products Verified</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-800">12,439</div>
                <div className="text-sm text-green-600">Authentic Products</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-800">8,923</div>
                <div className="text-sm text-orange-600">Registered Users</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-800">2,847</div>
                <div className="text-sm text-purple-600">Daily Scans</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-sky-600 text-white border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Join thousands of users who trust our platform for product verification. 
                Sign up now for free access and premium features.
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/signup')}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  Sign Up Free
                </Button>
                <Button 
                  onClick={() => navigate('/subscription')}
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  View Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Index;
