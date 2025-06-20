
import SendGridIntegrationComponent from './SendGridIntegration';
import TwilioIntegrationComponent from './TwilioIntegration';

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
  return (
    <div className="space-y-6">
      <SendGridIntegrationComponent
        integration={integrations.sendgrid}
        setIntegrations={setIntegrations}
        loading={loading}
        onSaveIntegration={onSaveIntegration}
        onTestConnection={onTestConnection}
      />
      
      <TwilioIntegrationComponent
        integration={integrations.twilio}
        setIntegrations={setIntegrations}
        loading={loading}
        onSaveIntegration={onSaveIntegration}
        onTestConnection={onTestConnection}
      />
    </div>
  );
};

export default CommunicationIntegrations;
