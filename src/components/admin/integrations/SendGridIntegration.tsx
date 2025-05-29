
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle, XCircle } from 'lucide-react';

interface SendGridIntegration {
  enabled: boolean;
  apiKey: string;
  fromEmail: string;
  status: string;
}

interface SendGridIntegrationProps {
  integration: SendGridIntegration;
  setIntegrations: (fn: (prev: any) => any) => void;
  loading: boolean;
  onSaveIntegration: (integration: string) => void;
  onTestConnection: (integration: string) => void;
}

const SendGridIntegration = ({ 
  integration, 
  setIntegrations, 
  loading, 
  onSaveIntegration, 
  onTestConnection 
}: SendGridIntegrationProps) => {
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
            <Mail className="h-5 w-5 text-blue-600" />
            SendGrid Integration
          </span>
          <div className="flex items-center gap-2">
            {getStatusBadge(integration.status)}
            <Switch
              checked={integration.enabled}
              onCheckedChange={(checked) => 
                setIntegrations(prev => ({ 
                  ...prev, 
                  sendgrid: { ...prev.sendgrid, enabled: checked } 
                }))
              }
            />
          </div>
        </CardTitle>
        <CardDescription>
          Configure SendGrid for transactional emails and notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sendgrid-key">API Key</Label>
            <Input
              id="sendgrid-key"
              type="password"
              placeholder="SG..."
              value={integration.apiKey}
              onChange={(e) => 
                setIntegrations(prev => ({ 
                  ...prev, 
                  sendgrid: { ...prev.sendgrid, apiKey: e.target.value } 
                }))
              }
              disabled={!integration.enabled}
            />
          </div>
          <div>
            <Label htmlFor="sendgrid-from">From Email</Label>
            <Input
              id="sendgrid-from"
              type="email"
              placeholder="noreply@example.com"
              value={integration.fromEmail}
              onChange={(e) => 
                setIntegrations(prev => ({ 
                  ...prev, 
                  sendgrid: { ...prev.sendgrid, fromEmail: e.target.value } 
                }))
              }
              disabled={!integration.enabled}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => onSaveIntegration('sendgrid')}
            disabled={!integration.enabled || loading}
          >
            Save Configuration
          </Button>
          <Button 
            variant="outline"
            onClick={() => onTestConnection('sendgrid')}
            disabled={!integration.enabled || loading}
          >
            Test Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SendGridIntegration;
