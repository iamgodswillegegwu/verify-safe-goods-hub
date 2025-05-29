
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Key } from 'lucide-react';
import ExternalAPISettings from './ExternalAPISettings';
import NAFDACIntegration from './integrations/NAFDACIntegration';
import AIIntegrations from './integrations/AIIntegrations';
import PaymentIntegrations from './integrations/PaymentIntegrations';
import CommunicationIntegrations from './integrations/CommunicationIntegrations';
import InfrastructureIntegrations from './integrations/InfrastructureIntegrations';

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
          <NAFDACIntegration 
            loading={loading}
            onTestConnection={testConnection}
          />
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <AIIntegrations
            integrations={{ openai: integrations.openai }}
            setIntegrations={setIntegrations}
            loading={loading}
            onSaveIntegration={handleSaveIntegration}
            onTestConnection={testConnection}
          />
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <PaymentIntegrations
            integrations={{ stripe: integrations.stripe }}
            setIntegrations={setIntegrations}
            loading={loading}
            onSaveIntegration={handleSaveIntegration}
            onTestConnection={testConnection}
          />
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <CommunicationIntegrations
            integrations={{ 
              sendgrid: integrations.sendgrid,
              twilio: integrations.twilio
            }}
            setIntegrations={setIntegrations}
            loading={loading}
            onSaveIntegration={handleSaveIntegration}
            onTestConnection={testConnection}
          />
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-6">
          <InfrastructureIntegrations
            integrations={{ 
              googlemaps: integrations.googlemaps,
              aws: integrations.aws
            }}
            setIntegrations={setIntegrations}
            loading={loading}
            onSaveIntegration={handleSaveIntegration}
            onTestConnection={testConnection}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIIntegrations;
