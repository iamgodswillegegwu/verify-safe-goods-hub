
import { Button } from '@/components/ui/button';
import { Database, Globe, Zap, ExternalLink } from 'lucide-react';

interface VerificationButtonsProps {
  onInternalVerification: () => void;
  onExternalVerification: () => void;
  onCombinedVerification: () => void;
  onShowExternalDialog: () => void;
  loading: boolean;
  externalLoading: boolean;
}

const VerificationButtons = ({
  onInternalVerification,
  onExternalVerification,
  onCombinedVerification,
  onShowExternalDialog,
  loading,
  externalLoading
}: VerificationButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Button 
        onClick={onInternalVerification}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Database className="h-4 w-4 mr-2" />
        {loading ? 'Verifying...' : 'Internal Database'}
      </Button>

      <Button 
        onClick={onExternalVerification}
        disabled={externalLoading}
        variant="outline"
        className="border-green-600 text-green-600 hover:bg-green-50"
      >
        <Globe className="h-4 w-4 mr-2" />
        {externalLoading ? 'Validating...' : 'External APIs'}
      </Button>

      <Button 
        onClick={onCombinedVerification}
        disabled={loading || externalLoading}
        variant="outline"
        className="border-purple-600 text-purple-600 hover:bg-purple-50"
      >
        <Zap className="h-4 w-4 mr-2" />
        {(loading || externalLoading) ? 'Processing...' : 'Combined Search'}
      </Button>

      <Button 
        onClick={onShowExternalDialog}
        variant="outline"
        className="border-orange-600 text-orange-600 hover:bg-orange-50"
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Advanced External
      </Button>
    </div>
  );
};

export default VerificationButtons;
