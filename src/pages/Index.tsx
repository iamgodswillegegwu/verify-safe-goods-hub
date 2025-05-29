import { useState, useEffect } from 'react';
import { Camera, Search, Shield, Users, BarChart3, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { verifyProduct, getSimilarProducts } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ProductScanner from '@/components/ProductScanner';
import EnhancedVerificationResult from '@/components/EnhancedVerificationResult';
import FeatureCards from '@/components/FeatureCards';
import SearchFilters from '@/components/SearchFilters';
import PersonalizedRecommendations from '@/components/PersonalizedRecommendations';
import SmartSearchSuggestions from '@/components/SmartSearchSuggestions';
import AdvancedSearchInterface from '@/components/AdvancedSearchInterface';
import AutoSuggestSearch from '@/components/AutoSuggestSearch';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({});
  const [verificationResult, setVerificationResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  // Check for startScanning parameter on component mount
  useEffect(() => {
    const shouldStartScanning = searchParams.get('startScanning');
    if (shouldStartScanning === 'true') {
      setIsScanning(true);
      // Clean up the URL parameter
      navigate('/', { replace: true });
    }
  }, [searchParams, navigate]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setShowSuggestions(false);
    console.log('Searching for product:', searchQuery, 'with filters:', searchFilters);
    
    try {
      const verification = await verifyProduct(searchQuery, user?.id, searchFilters);
      
      let similarProducts = [];
      if (verification.result !== 'verified') {
        similarProducts = await getSimilarProducts(searchQuery, searchFilters);
      }

      const result = {
        productName: searchQuery,
        isVerified: verification.result === 'verified',
        manufacturer: verification.product?.manufacturer?.company_name || 'Unknown',
        registrationDate: verification.product?.created_at ? 
          new Date(verification.product.created_at).toLocaleDateString() : 'N/A',
        certificationNumber: verification.product?.certification_number || 'N/A',
        similarProducts: similarProducts.map(p => ({
          name: p.name,
          manufacturer: p.manufacturer?.company_name || 'Unknown',
          verified: true
        })),
        product: verification.product
      };
      
      setVerificationResult(result);

      // Show toast notification
      if (verification.result === 'verified') {
        toast({
          title: "Product Verified! ✓",
          description: "This product is authentic and safe to use.",
        });
      } else {
        toast({
          title: "Product Not Found",
          description: "This product is not in our verified database.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error verifying product:', error);
      toast({
        title: "Error",
        description: "Failed to verify product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanResult = async (result) => {
    setVerificationResult(result);
    setIsScanning(false);
    
    // If this was a real scan, we would verify it the same way
    if (result.productName) {
      await handleSearch();
    }
  };

  const handleProductSelect = async (productName: string, isExternal = false, product = null) => {
    setSearchQuery(productName);
    setShowSuggestions(false);
    
    if (isExternal && product) {
      // If it's an external product, show it directly
      const result = {
        productName,
        isVerified: product.verified,
        manufacturer: product.brand || 'External Source',
        registrationDate: 'N/A',
        certificationNumber: 'External Product',
        similarProducts: [],
        product: null
      };
      
      setVerificationResult(result);
      
      toast({
        title: "External Product Found",
        description: `Found ${productName} from ${product.source.toUpperCase()}`,
      });
    } else {
      // Search internal database
      await handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <Hero />
      
      <main className="container mx-auto px-4 py-12">
        {/* Product Verification Section - Centralized */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Verify Your Products</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Scan or search for cosmetic and food products to verify their authenticity and safety
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Search Mode Toggle */}
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-lg p-1 border border-gray-200">
                <Button
                  variant={!showAdvancedSearch ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowAdvancedSearch(false)}
                  className={!showAdvancedSearch ? "bg-blue-600 text-white" : ""}
                >
                  Quick Verification
                </Button>
                <Button
                  variant={showAdvancedSearch ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowAdvancedSearch(true)}
                  className={showAdvancedSearch ? "bg-blue-600 text-white" : ""}
                >
                  Advanced Search
                </Button>
              </div>
            </div>

            {!showAdvancedSearch ? (
              <div className="space-y-6">
                {/* Main Search and Verification Card */}
                <Card className="border-2 border-blue-100 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50">
                    <CardTitle className="text-center text-slate-800">Product Verification</CardTitle>
                    <CardDescription className="text-center">
                      Search with real-time suggestions or scan products
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {/* Auto-Suggest Search Input */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                          <Search className="h-5 w-5 text-blue-600" />
                          Search by Name
                        </h3>
                        <AutoSuggestSearch
                          onProductSelect={handleProductSelect}
                          placeholder="Start typing to see suggestions..."
                          className="w-full"
                        />
                        <Button 
                          onClick={handleSearch}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={isLoading || !searchQuery.trim()}
                        >
                          {isLoading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                          ) : (
                            <Search className="h-4 w-4 mr-2" />
                          )}
                          Search & Verify
                        </Button>
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
                          disabled={isLoading}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          {isScanning ? 'Stop Scanner' : 'Start Scanner'}
                        </Button>
                      </div>
                    </div>

                    {/* Advanced Filters */}
                    <SearchFilters 
                      filters={searchFilters}
                      onFiltersChange={setSearchFilters}
                    />

                    {/* Scanner Component */}
                    {isScanning && (
                      <div className="mt-6">
                        <ProductScanner onResult={handleScanResult} />
                      </div>
                    )}

                    {/* Verification Result */}
                    {verificationResult && (
                      <div className="mt-6">
                        <EnhancedVerificationResult result={verificationResult} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Advanced Search Interface */
              <AdvancedSearchInterface />
            )}
          </div>
        </section>

        {/* Personalized Recommendations Section - Moved below Product Verification */}
        {!showSuggestions && !verificationResult && (
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <PersonalizedRecommendations limit={5} />
            </div>
          </section>
        )}

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
