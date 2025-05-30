
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { useEnhancedVerification } from '@/hooks/useEnhancedVerification';
import SearchInterface from './verification/SearchInterface';
import VerificationButtons from './verification/VerificationButtons';
import ResultsSection from './verification/ResultsSection';
import ExternalValidationDialog from './ExternalValidationDialog';

const EnhancedProductVerification = () => {
  const [showExternalDialog, setShowExternalDialog] = useState(false);
  
  const {
    searchQuery,
    barcode,
    setBarcode,
    verificationResult,
    externalResult,
    loading,
    externalLoading,
    handleProductSelect,
    handleInternalVerification,
    handleExternalVerification,
    handleCombinedVerification
  } = useEnhancedVerification();

  const handleShowExternalDialog = () => {
    setShowExternalDialog(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Enhanced Product Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <SearchInterface
            searchQuery={searchQuery}
            barcode={barcode}
            onBarcodeChange={setBarcode}
            onProductSelect={handleProductSelect}
          />

          <VerificationButtons
            onInternalVerification={handleInternalVerification}
            onExternalVerification={handleExternalVerification}
            onCombinedVerification={handleCombinedVerification}
            onShowExternalDialog={handleShowExternalDialog}
            loading={loading}
            externalLoading={externalLoading}
          />
        </CardContent>
      </Card>

      {/* Results Section */}
      <ResultsSection
        verificationResult={verificationResult}
        externalResult={externalResult}
      />

      {/* External Validation Dialog */}
      <ExternalValidationDialog
        isOpen={showExternalDialog}
        onClose={() => setShowExternalDialog(false)}
        productName={searchQuery}
        barcode={barcode}
      />
    </div>
  );
};

export default EnhancedProductVerification;
