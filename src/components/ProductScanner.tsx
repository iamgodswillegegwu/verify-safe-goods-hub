
import { useState, useRef, useEffect } from 'react';
import { Camera, Square, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ProductScanner = ({ onResult }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [error, setError] = useState('');
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
      setError('');
      console.log('Requesting camera access...');
      
      // Request camera with better constraints
      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained:', stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Wait for video to load and then play
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          videoRef.current.play().then(() => {
            console.log('Video started playing');
            setHasPermission(true);
          }).catch((playError) => {
            console.error('Error playing video:', playError);
            setError('Failed to start video playback');
            setHasPermission(false);
          });
        };

        // Handle video errors
        videoRef.current.onerror = (videoError) => {
          console.error('Video error:', videoError);
          setError('Video playback error');
          setHasPermission(false);
        };
      }
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
      
      if (error.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access and try again.');
      } else if (error.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else if (error.name === 'NotSupportedError') {
        setError('Camera not supported in this browser.');
      } else {
        setError('Failed to access camera. Please check your device and browser settings.');
      }
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Camera track stopped');
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
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

  const handleStartScanning = () => {
    setHasPermission(null);
    setError('');
    setIsScanning(true);
  };

  return (
    <Card className="bg-slate-50 border-dashed border-2 border-blue-300">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          {/* Initial state - ready to start */}
          {hasPermission === null && !isScanning && (
            <div>
              <Camera className="h-16 w-16 mx-auto text-blue-400 mb-4" />
              <p className="text-slate-600">Click to start scanning products</p>
              <Button 
                onClick={handleStartScanning}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                <Camera className="h-4 w-4 mr-2" />
                Start Camera
              </Button>
            </div>
          )}

          {/* Loading state */}
          {isScanning && hasPermission === null && !error && (
            <div>
              <Camera className="h-16 w-16 mx-auto text-blue-400 mb-4 animate-pulse" />
              <p className="text-blue-600">Starting camera...</p>
            </div>
          )}

          {/* Permission denied or error */}
          {(hasPermission === false || error) && (
            <div>
              <Camera className="h-16 w-16 mx-auto text-red-400 mb-4" />
              <p className="text-red-600 mb-2">{error || 'Camera access failed'}</p>
              <p className="text-sm text-slate-500 mb-4">
                Please ensure your browser has camera permissions enabled
              </p>
              <Button 
                onClick={handleStartScanning}
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Camera active and working */}
          {hasPermission === true && (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }} // Mirror effect for better UX
                />
                
                {/* Scanning overlay with corner brackets */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative border-2 border-white border-dashed rounded-lg w-3/4 h-3/4 opacity-80">
                    {/* Corner brackets */}
                    <div className="absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 border-blue-400 rounded-tl-lg"></div>
                    <div className="absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 border-blue-400 rounded-tr-lg"></div>
                    <div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 border-blue-400 rounded-bl-lg"></div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-blue-400 rounded-br-lg"></div>
                    
                    {/* Center crosshair */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-6 h-6 border-2 border-blue-400 rounded-full bg-blue-400 bg-opacity-20"></div>
                    </div>
                  </div>
                </div>

                {/* Instructions overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black bg-opacity-70 text-white text-sm p-2 rounded">
                    Position product within the scanning area
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
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductScanner;
