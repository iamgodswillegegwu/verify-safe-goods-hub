
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, CheckCircle, XCircle } from 'lucide-react';

interface TwilioIntegration {
  enabled: boolean;
  accountSid: string;
  authToken: string;
  fromNumber: string;
  status: string;
}

interface TwilioIntegrationProps {
  integration: TwilioIntegration;
  setIntegrations: (fn: (prev: any) => any) => void;
  loading: boolean;
  onSaveIntegration: (integration: string) => void;
  onTestConnection: (integration: string) => void;
}

const TwilioIntegration = ({ 
  integration, 
  setIntegrations, 
  loading, 
  onSaveIntegration, 
  onTestConnection 
}: TwilioIntegrationProps) => {
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
            <MessageSquare className="h-5 w-5 text-red-600" />
            Twilio Integration
          </span>
          <div className="flex items-center gap-2">
            {getStatusBadge(integration.status)}
            <Switch
              checked={integration.enabled}
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
              value={integration.accountSid}
              onChange={(e) => 
                setIntegrations(prev => ({ 
                  ...prev, 
                  twilio: { ...prev.twilio, accountSid: e.target.value } 
                }))
              }
              disabled={!integration.enabled}
            />
          </div>
          <div>
            <Label htmlFor="twilio-token">Auth Token</Label>
            <Input
              id="twilio-token"
              type="password"
              placeholder="Auth Token"
              value={integration.authToken}
              onChange={(e) => 
                setIntegrations(prev => ({ 
                  ...prev, 
                  twilio: { ...prev.twilio, authToken: e.target.value } 
                }))
              }
              disabled={!integration.enabled}
            />
          </div>
          <div>
            <Label htmlFor="twilio-from">From Number</Label>
            <Input
              id="twilio-from"
              placeholder="+1234567890"
              value={integration.fromNumber}
              onChange={(e) => 
                setIntegrations(prev => ({ 
                  ...prev, 
                  twilio: { ...prev.twilio, fromNumber: e.target.value } 
                }))
              }
              disabled={!integration.enabled}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => onSaveIntegration('twilio')}
            disabled={!integration.enabled || loading}
          >
            Save Configuration
          </Button>
          <Button 
            variant="outline"
            onClick={() => onTestConnection('twilio')}
            disabled={!integration.enabled || loading}
          >
            Test Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TwilioIntegration;
