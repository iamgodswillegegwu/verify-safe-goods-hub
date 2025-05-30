
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CTASection = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default CTASection;
