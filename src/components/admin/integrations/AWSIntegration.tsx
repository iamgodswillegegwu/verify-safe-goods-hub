
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Database, CheckCircle, XCircle } from 'lucide-react';

interface AWSIntegration {
  enabled: boolean;
  accessKey: string;
  secretKey: string;
  region: string;
  status: string;
}

interface AWSIntegrationProps {
  integration: AWSIntegration;
  setIntegrations: (fn: (prev: any) => any) => void;
  loading: boolean;
  onSaveIntegration: (integration: string) => void;
  onTestConnection: (integration: string) => void;
}

const AWSIntegration = ({ 
  integration, 
  setIntegrations, 
  loading, 
  onSaveIntegration, 
  onTestConnection 
}: AWSIntegrationProps) => {
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
            <Database className="h-5 w-5 text-orange-600" />
            AWS Integration
          </span>
          <div className="flex items-center gap-2">
            {getStatusBadge(integration.status)}
            <Switch
              checked={integration.enabled}
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
              value={integration.accessKey}
              onChange={(e) => 
                setIntegrations(prev => ({ 
                  ...prev, 
                  aws: { ...prev.aws, accessKey: e.target.value } 
                }))
              }
              disabled={!integration.enabled}
            />
          </div>
          <div>
            <Label htmlFor="aws-secret">Secret Access Key</Label>
            <Input
              id="aws-secret"
              type="password"
              placeholder="Secret Key"
              value={integration.secretKey}
              onChange={(e) => 
                setIntegrations(prev => ({ 
                  ...prev, 
                  aws: { ...prev.aws, secretKey: e.target.value } 
                }))
              }
              disabled={!integration.enabled}
            />
          </div>
          <div>
            <Label htmlFor="aws-region">Region</Label>
            <Input
              id="aws-region"
              placeholder="us-east-1"
              value={integration.region}
              onChange={(e) => 
                setIntegrations(prev => ({ 
                  ...prev, 
                  aws: { ...prev.aws, region: e.target.value } 
                }))
              }
              disabled={!integration.enabled}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => onSaveIntegration('aws')}
            disabled={!integration.enabled || loading}
          >
            Save Configuration
          </Button>
          <Button 
            variant="outline"
            onClick={() => onTestConnection('aws')}
            disabled={!integration.enabled || loading}
          >
            Test Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AWSIntegration;
