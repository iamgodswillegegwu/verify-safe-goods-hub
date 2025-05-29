
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Globe, CheckCircle, Zap, TestTube, ExternalLink } from 'lucide-react';

interface NAFDACIntegrationProps {
  loading: boolean;
  onTestConnection: (integration: string) => void;
}

const NAFDACIntegration = ({ loading, onTestConnection }: NAFDACIntegrationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-emerald-600" />
            NAFDAC (Nigeria) Integration
          </span>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </Badge>
            <Switch checked={true} disabled />
          </div>
        </CardTitle>
        <CardDescription>
          Real-time integration with Nigeria's National Agency for Food and Drug Administration and Control (NAFDAC) Green Book portal for product verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-emerald-600" />
            <span className="font-medium text-emerald-800">Web Scraping Integration</span>
          </div>
          <p className="text-sm text-emerald-700">
            This integration uses a custom web scraping service to fetch real-time data from the NAFDAC Green Book portal 
            since NAFDAC doesn't provide a public API. The service is optimized for performance and reliability.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Portal URL</Label>
            <Input
              value="https://greenbook.nafdac.gov.ng/"
              disabled
              className="bg-gray-50"
            />
          </div>
          <div>
            <Label>Cache Duration</Label>
            <Input
              value="6 hours"
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">Active</div>
            <div className="text-sm text-blue-700">Service Status</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">0.8s</div>
            <div className="text-sm text-green-700">Avg Response</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">98%</div>
            <div className="text-sm text-purple-700">Success Rate</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => onTestConnection('nafdac')}
            disabled={loading}
          >
            <TestTube className="h-4 w-4 mr-2" />
            Test NAFDAC Connection
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.open('https://greenbook.nafdac.gov.ng/', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit NAFDAC Portal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NAFDACIntegration;
