
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CameraPermissionHandler from './scanner/CameraPermissionHandler';
import CameraVideo from './scanner/CameraVideo';

interface ProductScannerProps {
  onResult: (result: any) => void;
}

const ProductScanner = ({ onResult }: ProductScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleStartScanning = () => {
    setHasPermission(null);
    setError('');
    setIsScanning(true);
  };

  const handleStopScanning = () => {
    setIsScanning(false);
    setStream(null);
  };

  const captureImage = () => {
    console.log('Capturing and processing image...');
    
    // For now, simulate a successful scan
    const mockScanResult = {
      productName: 'Scanned Product Example',
      isVerified: Math.random() > 0.3,
      manufacturer: 'Sample Manufacturer',
      registrationDate: '2024-01-10',
      certificationNumber: 'SCAN-2024-002',
      similarProducts: [
        { name: 'Similar Product 1', manufacturer: 'Brand A', verified: true },
        { name: 'Similar Product 2', manufacturer: 'Brand B', verified: true },
      ]
    };
    
    onResult(mockScanResult);
    setIsScanning(false);
  };

  return (
    <Card className="bg-slate-50 border-dashed border-2 border-blue-300">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          {/* Camera active and working */}
          {isScanning && hasPermission === true && !error ? (
            <CameraVideo
              stream={stream}
              onCapture={captureImage}
              onStop={handleStopScanning}
            />
          ) : (
            <CameraPermissionHandler
              isScanning={isScanning}
              hasPermission={hasPermission}
              error={error}
              onPermissionChange={setHasPermission}
              onError={setError}
              onStreamReady={setStream}
              onStartScanning={handleStartScanning}
              onStopScanning={handleStopScanning}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductScanner;
