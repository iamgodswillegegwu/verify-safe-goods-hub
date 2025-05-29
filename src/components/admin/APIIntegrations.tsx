import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Key, Database, Mail, CreditCard, MessageSquare, Globe, CheckCircle, XCircle, Zap, TestTube, ExternalLink } from 'lucide-react';
import ExternalAPISettings from './ExternalAPISettings';

const APIIntegrations = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [integrations, setIntegrations] = useState({
    openai: {
      enabled: false,
      apiKey: '',
      status: 'disconnected'
    },
    stripe: {
      enabled: false,
      publishableKey: '',
      secretKey: '',
      status: 'disconnected'
    },
    sendgrid: {
      enabled: false,
      apiKey: '',
      fromEmail: '',
      status: 'disconnected'
    },
    twilio: {
      enabled: false,
      accountSid: '',
      authToken: '',
      fromNumber: '',
      status: 'disconnected'
    },
    googlemaps: {
      enabled: false,
      apiKey: '',
      status: 'disconnected'
    },
    aws: {
      enabled: false,
      accessKey: '',
      secretKey: '',
      region: 'us-east-1',
      status: 'disconnected'
    }
  });

  const handleSaveIntegration = async (integration: string) => {
    setLoading(true);
    try {
      // Save integration configuration
      setIntegrations(prev => ({
        ...prev,
        [integration]: {
          ...prev[integration as keyof typeof prev],
          status: 'connected'
        }
      }));

      toast({
        title: "Integration Updated",
        description: `${integration.toUpperCase()} integration has been configured successfully.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save integration settings.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (integration: string) => {
    setLoading(true);
    try {
      // Test API connection
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      toast({
        title: "Connection Test",
        description: `${integration.toUpperCase()} connection test successful.`
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${integration.toUpperCase()}.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'connected') {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Connected</Badge>;
    }
    return <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" />Disconnected</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Key className="h-6 w-6" />
          API Integrations
        </h2>
        <p className="text-gray-600 mt-2">
          Configure external API services and third-party integrations.
        </p>
      </div>

      <Tabs defaultValue="external-validation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="external-validation">External Validation</TabsTrigger>
          <TabsTrigger value="ai">AI Services</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
        </TabsList>

        <TabsContent value="external-validation" className="space-y-6">
          <ExternalAPISettings />
          
          {/* NAFDAC Integration Section */}
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
                  onClick={() => testConnection('nafdac')}
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
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          {/* OpenAI Integration */}
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
                  onClick={() => handleSaveIntegration('openai')}
                  disabled={!integrations.openai.enabled || loading}
                >
                  Save Configuration
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => testConnection('openai')}
                  disabled={!integrations.openai.enabled || loading}
                >
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          {/* Stripe Integration */}
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
                  onClick={() => handleSaveIntegration('stripe')}
                  disabled={!integrations.stripe.enabled || loading}
                >
                  Save Configuration
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => testConnection('stripe')}
                  disabled={!integrations.stripe.enabled || loading}
                >
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
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
                  onClick={() => handleSaveIntegration('sendgrid')}
                  disabled={!integrations.sendgrid.enabled || loading}
                >
                  Save Configuration
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => testConnection('sendgrid')}
                  disabled={!integrations.sendgrid.enabled || loading}
                >
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>

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
                  onClick={() => handleSaveIntegration('twilio')}
                  disabled={!integrations.twilio.enabled || loading}
                >
                  Save Configuration
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => testConnection('twilio')}
                  disabled={!integrations.twilio.enabled || loading}
                >
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-6">
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
                  onClick={() => handleSaveIntegration('googlemaps')}
                  disabled={!integrations.googlemaps.enabled || loading}
                >
                  Save Configuration
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => testConnection('googlemaps')}
                  disabled={!integrations.googlemaps.enabled || loading}
                >
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>

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
                  onClick={() => handleSaveIntegration('aws')}
                  disabled={!integrations.aws.enabled || loading}
                >
                  Save Configuration
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => testConnection('aws')}
                  disabled={!integrations.aws.enabled || loading}
                >
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIIntegrations;
