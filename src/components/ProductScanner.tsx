
import { useState, useRef, useEffect } from 'react';
import { Camera, Square, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ProductScanner = ({ onResult }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (isScanning) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isScanning]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      
      setHasPermission(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const captureImage = () => {
    // Simulate scanning process
    console.log('Capturing and processing image...');
    
    // Mock scan result
    const mockScanResult = {
      productName: 'Scanned Product Name',
      isVerified: Math.random() > 0.3,
      manufacturer: 'Scanned Manufacturer',
      registrationDate: '2024-01-10',
      certificationNumber: 'SCAN-2024-002',
      similarProducts: [
        { name: 'Similar Scanned Product 1', manufacturer: 'Verified Brand C', verified: true },
        { name: 'Similar Scanned Product 2', manufacturer: 'Verified Brand D', verified: true },
      ]
    };
    
    onResult(mockScanResult);
    setIsScanning(false);
  };

  return (
    <Card className="bg-slate-50 border-dashed border-2 border-blue-300">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          {hasPermission === null && (
            <div>
              <Camera className="h-16 w-16 mx-auto text-blue-400 mb-4" />
              <p className="text-slate-600">Click to start scanning</p>
              <Button 
                onClick={() => setIsScanning(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Start Camera
              </Button>
            </div>
          )}

          {hasPermission === false && (
            <div>
              <Camera className="h-16 w-16 mx-auto text-red-400 mb-4" />
              <p className="text-red-600 mb-4">Camera permission denied or not available</p>
              <p className="text-sm text-slate-500">
                Please allow camera access to use the scanning feature
              </p>
            </div>
          )}

          {hasPermission === true && (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Scanning overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-white border-dashed rounded-lg w-3/4 h-3/4 opacity-70">
                    <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-blue-400"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-blue-400"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-blue-400"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-blue-400"></div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={captureImage}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Capture & Verify
                </Button>
                <Button 
                  onClick={() => setIsScanning(false)}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop Scanning
                </Button>
              </div>

              <p className="text-sm text-slate-500">
                Position the product clearly within the scanning area
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductScanner;
