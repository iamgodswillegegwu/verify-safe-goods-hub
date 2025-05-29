
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';

interface Integration {
  enabled: boolean;
  publishableKey: string;
  secretKey: string;
  status: string;
}

interface PaymentIntegrationsProps {
  integrations: {
    stripe: Integration;
  };
  setIntegrations: (fn: (prev: any) => any) => void;
  loading: boolean;
  onSaveIntegration: (integration: string) => void;
  onTestConnection: (integration: string) => void;
}

const PaymentIntegrations = ({ 
  integrations, 
  setIntegrations, 
  loading, 
  onSaveIntegration, 
  onTestConnection 
}: PaymentIntegrationsProps) => {
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
            <CreditCard className="h-5 w-5 text-purple-600" />
            Stripe Integration
          </span>
          <div className="flex items-center gap-2">
            {getStatusBadge(integrations.stripe.status)}
            <Switch
              checked={integrations.stripe.enabled}
              onCheckedChange={(checked) => 
                setIntegrations(prev => ({ 
                  ...prev, 
                  stripe: { ...prev.stripe, enabled: checked } 
                }))
              }
            />
          </div>
        </CardTitle>
        <CardDescription>
          Configure Stripe for payment processing and subscription management
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="stripe-publishable">Publishable Key</Label>
            <Input
              id="stripe-publishable"
              placeholder="pk_..."
              value={integrations.stripe.publishableKey}
              onChange={(e) => 
                setIntegrations(prev => ({ 
                  ...prev, 
                  stripe: { ...prev.stripe, publishableKey: e.target.value } 
                }))
              }
              disabled={!integrations.stripe.enabled}
            />
          </div>
          <div>
            <Label htmlFor="stripe-secret">Secret Key</Label>
            <Input
              id="stripe-secret"
              type="password"
              placeholder="sk_..."
              value={integrations.stripe.secretKey}
              onChange={(e) => 
                setIntegrations(prev => ({ 
                  ...prev, 
                  stripe: { ...prev.stripe, secretKey: e.target.value } 
                }))
              }
              disabled={!integrations.stripe.enabled}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => onSaveIntegration('stripe')}
            disabled={!integrations.stripe.enabled || loading}
          >
            Save Configuration
          </Button>
          <Button 
            variant="outline"
            onClick={() => onTestConnection('stripe')}
            disabled={!integrations.stripe.enabled || loading}
          >
            Test Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentIntegrations;
