
import GoogleMapsIntegration from './GoogleMapsIntegration';
import AWSIntegration from './AWSIntegration';

interface GoogleMapsIntegration {
  enabled: boolean;
  apiKey: string;
  status: string;
}

interface AWSIntegration {
  enabled: boolean;
  accessKey: string;
  secretKey: string;
  region: string;
  status: string;
}

interface InfrastructureIntegrationsProps {
  integrations: {
    googlemaps: GoogleMapsIntegration;
    aws: AWSIntegration;
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
      <GoogleMapsIntegration
        integration={integrations.googlemaps}
        setIntegrations={setIntegrations}
        loading={loading}
        onSaveIntegration={onSaveIntegration}
        onTestConnection={onTestConnection}
      />
      
      <AWSIntegration
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
