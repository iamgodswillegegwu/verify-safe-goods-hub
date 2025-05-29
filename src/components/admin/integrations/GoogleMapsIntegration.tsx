
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Globe, CheckCircle, XCircle } from 'lucide-react';

interface GoogleMapsIntegration {
  enabled: boolean;
  apiKey: string;
  status: string;
}

interface GoogleMapsIntegrationProps {
  integration: GoogleMapsIntegration;
  setIntegrations: (fn: (prev: any) => any) => void;
  loading: boolean;
  onSaveIntegration: (integration: string) => void;
  onTestConnection: (integration: string) => void;
}

const GoogleMapsIntegration = ({ 
  integration, 
  setIntegrations, 
  loading, 
  onSaveIntegration, 
  onTestConnection 
}: GoogleMapsIntegrationProps) => {
  const getStatusBadge = (status: string) => {
    if (status === 'connected') {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Connected</Badge>;
    }
    return <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" />Disconnected</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-600" />
            Google Maps Integration
          </span>
          <div className="flex items-center gap-2">
            {getStatusBadge(integration.status)}
            <Switch
              checked={integration.enabled}
              onCheckedChange={(checked) => 
                setIntegrations(prev => ({ 
                  ...prev, 
                  googlemaps: { ...prev.googlemaps, enabled: checked } 
                }))
              }
            />
          </div>
        </CardTitle>
        <CardDescription>
          Configure Google Maps API for location-based features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="googlemaps-key">API Key</Label>
          <Input
            id="googlemaps-key"
            type="password"
            placeholder="AIza..."
            value={integration.apiKey}
            onChange={(e) => 
              setIntegrations(prev => ({ 
                ...prev, 
                googlemaps: { ...prev.googlemaps, apiKey: e.target.value } 
              }))
            }
            disabled={!integration.enabled}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => onSaveIntegration('googlemaps')}
            disabled={!integration.enabled || loading}
          >
            Save Configuration
          </Button>
          <Button 
            variant="outline"
            onClick={() => onTestConnection('googlemaps')}
            disabled={!integration.enabled || loading}
          >
            Test Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleMapsIntegration;
