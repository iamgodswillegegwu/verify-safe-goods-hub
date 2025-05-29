
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

interface SendGridIntegration {
  enabled: boolean;
  apiKey: string;
  fromEmail: string;
  status: string;
}

interface TwilioIntegration {
  enabled: boolean;
  accountSid: string;
  authToken: string;
  fromNumber: string;
  status: string;
}

interface CommunicationIntegrationsProps {
  integrations: {
    sendgrid: SendGridIntegration;
    twilio: TwilioIntegration;
  };
  setIntegrations: (fn: (prev: any) => any) => void;
  loading: boolean;
  onSaveIntegration: (integration: string) => void;
  onTestConnection: (integration: string) => void;
}

const CommunicationIntegrations = ({ 
  integrations, 
  setIntegrations, 
  loading, 
  onSaveIntegration, 
  onTestConnection 
}: CommunicationIntegrationsProps) => {
  const getStatusBadge = (status: string) => {
    if (status === 'connected') {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Connected</Badge>;
    }
    return <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" />Disconnected</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* SendGrid Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              SendGrid Integration
            </span>
            <div className="flex items-center gap-2">
              {getStatusBadge(integrations.sendgrid.status)}
              <Switch
                checked={integrations.sendgrid.enabled}
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
                value={integrations.sendgrid.apiKey}
                onChange={(e) => 
                  setIntegrations(prev => ({ 
                    ...prev, 
                    sendgrid: { ...prev.sendgrid, apiKey: e.target.value } 
                  }))
                }
                disabled={!integrations.sendgrid.enabled}
              />
            </div>
            <div>
              <Label htmlFor="sendgrid-from">From Email</Label>
              <Input
                id="sendgrid-from"
                type="email"
                placeholder="noreply@example.com"
                value={integrations.sendgrid.fromEmail}
                onChange={(e) => 
                  setIntegrations(prev => ({ 
                    ...prev, 
                    sendgrid: { ...prev.sendgrid, fromEmail: e.target.value } 
                  }))
                }
                disabled={!integrations.sendgrid.enabled}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => onSaveIntegration('sendgrid')}
              disabled={!integrations.sendgrid.enabled || loading}
            >
              Save Configuration
            </Button>
            <Button 
              variant="outline"
              onClick={() => onTestConnection('sendgrid')}
              disabled={!integrations.sendgrid.enabled || loading}
            >
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Twilio Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-red-600" />
              Twilio Integration
            </span>
            <div className="flex items-center gap-2">
              {getStatusBadge(integrations.twilio.status)}
              <Switch
                checked={integrations.twilio.enabled}
                onCheckedChange={(checked) => 
                  setIntegrations(prev => ({ 
                    ...prev, 
                    twilio: { ...prev.twilio, enabled: checked } 
                  }))
                }
              />
            </div>
          </CardTitle>
          <CardDescription>
            Configure Twilio for SMS notifications and verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="twilio-sid">Account SID</Label>
              <Input
                id="twilio-sid"
                placeholder="AC..."
                value={integrations.twilio.accountSid}
                onChange={(e) => 
                  setIntegrations(prev => ({ 
                    ...prev, 
                    twilio: { ...prev.twilio, accountSid: e.target.value } 
                  }))
                }
                disabled={!integrations.twilio.enabled}
              />
            </div>
            <div>
              <Label htmlFor="twilio-token">Auth Token</Label>
              <Input
                id="twilio-token"
                type="password"
                placeholder="Auth Token"
                value={integrations.twilio.authToken}
                onChange={(e) => 
                  setIntegrations(prev => ({ 
                    ...prev, 
                    twilio: { ...prev.twilio, authToken: e.target.value } 
                  }))
                }
                disabled={!integrations.twilio.enabled}
              />
            </div>
            <div>
              <Label htmlFor="twilio-from">From Number</Label>
              <Input
                id="twilio-from"
                placeholder="+1234567890"
                value={integrations.twilio.fromNumber}
                onChange={(e) => 
                  setIntegrations(prev => ({ 
                    ...prev, 
                    twilio: { ...prev.twilio, fromNumber: e.target.value } 
                  }))
                }
                disabled={!integrations.twilio.enabled}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => onSaveIntegration('twilio')}
              disabled={!integrations.twilio.enabled || loading}
            >
              Save Configuration
            </Button>
            <Button 
              variant="outline"
              onClick={() => onTestConnection('twilio')}
              disabled={!integrations.twilio.enabled || loading}
            >
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationIntegrations;
