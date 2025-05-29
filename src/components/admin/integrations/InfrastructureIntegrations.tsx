
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Globe, Database, CheckCircle, XCircle } from 'lucide-react';

interface GoogleMapsIntegration {
  enabled: boolean;
  apiKey: string;
  status: string;
}

interface AWSIntegration {
  enabled: boolean;
  accessKey: string;
  secretKey: string;
  region: string;
  status: string;
}

interface InfrastructureIntegrationsProps {
  integrations: {
    googlemaps: GoogleMapsIntegration;
    aws: AWSIntegration;
  };
  setIntegrations: (fn: (prev: any) => any) => void;
  loading: boolean;
  onSaveIntegration: (integration: string) => void;
  onTestConnection: (integration: string) => void;
}

const InfrastructureIntegrations = ({ 
  integrations, 
  setIntegrations, 
  loading, 
  onSaveIntegration, 
  onTestConnection 
}: InfrastructureIntegrationsProps) => {
  const getStatusBadge = (status: string) => {
    if (status === 'connected') {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Connected</Badge>;
    }
    return <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" />Disconnected</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Google Maps Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-600" />
              Google Maps Integration
            </span>
            <div className="flex items-center gap-2">
              {getStatusBadge(integrations.googlemaps.status)}
              <Switch
                checked={integrations.googlemaps.enabled}
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
              value={integrations.googlemaps.apiKey}
              onChange={(e) => 
                setIntegrations(prev => ({ 
                  ...prev, 
                  googlemaps: { ...prev.googlemaps, apiKey: e.target.value } 
                }))
              }
              disabled={!integrations.googlemaps.enabled}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => onSaveIntegration('googlemaps')}
              disabled={!integrations.googlemaps.enabled || loading}
            >
              Save Configuration
            </Button>
            <Button 
              variant="outline"
              onClick={() => onTestConnection('googlemaps')}
              disabled={!integrations.googlemaps.enabled || loading}
            >
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AWS Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Database className="h-5 w-5 text-orange-600" />
              AWS Integration
            </span>
            <div className="flex items-center gap-2">
              {getStatusBadge(integrations.aws.status)}
              <Switch
                checked={integrations.aws.enabled}
                onCheckedChange={(checked) => 
                  setIntegrations(prev => ({ 
                    ...prev, 
                    aws: { ...prev.aws, enabled: checked } 
                  }))
                }
              />
            </div>
          </CardTitle>
          <CardDescription>
            Configure AWS services for cloud storage and computing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="aws-access">Access Key ID</Label>
              <Input
                id="aws-access"
                placeholder="AKIA..."
                value={integrations.aws.accessKey}
                onChange={(e) => 
                  setIntegrations(prev => ({ 
                    ...prev, 
                    aws: { ...prev.aws, accessKey: e.target.value } 
                  }))
                }
                disabled={!integrations.aws.enabled}
              />
            </div>
            <div>
              <Label htmlFor="aws-secret">Secret Access Key</Label>
              <Input
                id="aws-secret"
                type="password"
                placeholder="Secret Key"
                value={integrations.aws.secretKey}
                onChange={(e) => 
                  setIntegrations(prev => ({ 
                    ...prev, 
                    aws: { ...prev.aws, secretKey: e.target.value } 
                  }))
                }
                disabled={!integrations.aws.enabled}
              />
            </div>
            <div>
              <Label htmlFor="aws-region">Region</Label>
              <Input
                id="aws-region"
                placeholder="us-east-1"
                value={integrations.aws.region}
                onChange={(e) => 
                  setIntegrations(prev => ({ 
                    ...prev, 
                    aws: { ...prev.aws, region: e.target.value } 
                  }))
                }
                disabled={!integrations.aws.enabled}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => onSaveIntegration('aws')}
              disabled={!integrations.aws.enabled || loading}
            >
              Save Configuration
            </Button>
            <Button 
              variant="outline"
              onClick={() => onTestConnection('aws')}
              disabled={!integrations.aws.enabled || loading}
            >
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfrastructureIntegrations;
