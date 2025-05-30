
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ProductVerificationSection from '@/components/ProductVerificationSection';
import FeatureCards from '@/components/FeatureCards';
import PersonalizedRecommendations from '@/components/PersonalizedRecommendations';
import StatisticsSection from '@/components/StatisticsSection';
import CTASection from '@/components/CTASection';
import { useProductVerification } from '@/hooks/useProductVerification';

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    searchQuery,
    setSearchQuery,
    searchFilters,
    setSearchFilters,
    verificationResult,
    setVerificationResult,
    isLoading,
    handleSearch,
    handleProductSelect
  } = useProductVerification();

  // Check for startScanning parameter on component mount
  useEffect(() => {
    const shouldStartScanning = searchParams.get('startScanning');
    if (shouldStartScanning === 'true') {
      setIsScanning(true);
      // Clean up the URL parameter
      navigate('/', { replace: true });
    }
  }, [searchParams, navigate]);

  const handleScanResult = async (result) => {
    setVerificationResult(result);
    setIsScanning(false);
    
    // If this was a real scan, we would verify it the same way
    if (result?.productName) {
      setSearchQuery(result.productName);
      await handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <Hero />
      
      <main className="container mx-auto px-4 py-12">
        {/* Product Verification Section - Centralized */}
        <ProductVerificationSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchFilters={searchFilters}
          setSearchFilters={setSearchFilters}
          verificationResult={verificationResult}
          isScanning={isScanning}
          setIsScanning={setIsScanning}
          isLoading={isLoading}
          showAdvancedSearch={showAdvancedSearch}
          setShowAdvancedSearch={setShowAdvancedSearch}
          handleSearch={handleSearch}
          handleScanResult={handleScanResult}
          handleProductSelect={handleProductSelect}
        />

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
        <StatisticsSection />

        {/* CTA Section */}
        <CTASection />
      </main>
    </div>
  );
};

export default Index;
