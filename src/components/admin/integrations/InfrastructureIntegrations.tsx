
import GoogleMapsIntegrationComponent from './GoogleMapsIntegration';
import AWSIntegrationComponent from './AWSIntegration';

interface GoogleMapsIntegrationType {
  enabled: boolean;
  apiKey: string;
  status: string;
}

interface AWSIntegrationType {
  enabled: boolean;
  accessKey: string;
  secretKey: string;
  region: string;
  status: string;
}

interface InfrastructureIntegrationsProps {
  integrations: {
    googlemaps: GoogleMapsIntegrationType;
    aws: AWSIntegrationType;
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
  return (
    <div className="space-y-6">
      <GoogleMapsIntegrationComponent
        integration={integrations.googlemaps}
        setIntegrations={setIntegrations}
        loading={loading}
        onSaveIntegration={onSaveIntegration}
        onTestConnection={onTestConnection}
      />
      
      <AWSIntegrationComponent
        integration={integrations.aws}
        setIntegrations={setIntegrations}
        loading={loading}
        onSaveIntegration={onSaveIntegration}
        onTestConnection={onTestConnection}
      />
    </div>
  );
};

export default InfrastructureIntegrations;
