
import { Shield, Scan, Search, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-sky-800 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <Shield className="h-16 w-16 mx-auto mb-4 text-blue-200" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Verify. Trust. Consume
              <span className="block text-blue-200">Safely.</span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
            Your trusted platform for verifying cosmetic and food products. 
            Scan or search to ensure authenticity and safety before consumption.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={() => navigate('/signup')}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg"
            >
              <Scan className="h-5 w-5 mr-2" />
              Start Verifying
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/manufacturer')}
              className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 text-lg"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Register Products
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Scan className="h-8 w-8 mx-auto mb-3 text-blue-200" />
              <h3 className="font-semibold text-lg mb-2">Smart Scanning</h3>
              <p className="text-blue-100 text-sm">
                Use your camera to instantly scan and verify product authenticity
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Search className="h-8 w-8 mx-auto mb-3 text-blue-200" />
              <h3 className="font-semibold text-lg mb-2">Quick Search</h3>
              <p className="text-blue-100 text-sm">
                Search by product name to get instant verification results
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Shield className="h-8 w-8 mx-auto mb-3 text-blue-200" />
              <h3 className="font-semibold text-lg mb-2">Safety First</h3>
              <p className="text-blue-100 text-sm">
                Comprehensive database of verified cosmetic and food products
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
