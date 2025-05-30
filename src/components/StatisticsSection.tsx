
import { Shield, Users, BarChart3, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const StatisticsSection = () => {
  return (
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
  );
};

export default StatisticsSection;
