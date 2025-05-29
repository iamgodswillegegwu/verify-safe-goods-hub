
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, CheckCircle, XCircle } from 'lucide-react';

interface Integration {
  enabled: boolean;
  apiKey: string;
  status: string;
}

interface AIIntegrationsProps {
  integrations: {
    openai: Integration;
  };
  setIntegrations: (fn: (prev: any) => any) => void;
  loading: boolean;
  onSaveIntegration: (integration: string) => void;
  onTestConnection: (integration: string) => void;
}

const AIIntegrations = ({ 
  integrations, 
  setIntegrations, 
  loading, 
  onSaveIntegration, 
  onTestConnection 
}: AIIntegrationsProps) => {
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
            <MessageSquare className="h-5 w-5 text-green-600" />
            OpenAI Integration
          </span>
          <div className="flex items-center gap-2">
            {getStatusBadge(integrations.openai.status)}
            <Switch
              checked={integrations.openai.enabled}
              onCheckedChange={(checked) => 
                setIntegrations(prev => ({ 
                  ...prev, 
                  openai: { ...prev.openai, enabled: checked } 
                }))
              }
            />
          </div>
        </CardTitle>
        <CardDescription>
          Configure OpenAI API for AI-powered features like product verification assistance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="openai-key">API Key</Label>
          <Input
            id="openai-key"
            type="password"
            placeholder="sk-..."
            value={integrations.openai.apiKey}
            onChange={(e) => 
              setIntegrations(prev => ({ 
                ...prev, 
                openai: { ...prev.openai, apiKey: e.target.value } 
              }))
            }
            disabled={!integrations.openai.enabled}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => onSaveIntegration('openai')}
            disabled={!integrations.openai.enabled || loading}
          >
            Save Configuration
          </Button>
          <Button 
            variant="outline"
            onClick={() => onTestConnection('openai')}
            disabled={!integrations.openai.enabled || loading}
          >
            Test Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIIntegrations;
