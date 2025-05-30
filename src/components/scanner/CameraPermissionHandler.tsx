
import { useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraPermissionHandlerProps {
  isScanning: boolean;
  hasPermission: boolean | null;
  error: string;
  onPermissionChange: (permission: boolean | null) => void;
  onError: (error: string) => void;
  onStreamReady: (stream: MediaStream) => void;
  onStartScanning: () => void;
  onStopScanning: () => void;
}

const CameraPermissionHandler = ({
  isScanning,
  hasPermission,
  error,
  onPermissionChange,
  onError,
  onStreamReady,
  onStartScanning,
  onStopScanning
}: CameraPermissionHandlerProps) => {
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      onError('');
      onPermissionChange(null);
      console.log('Requesting camera access...');
      
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained:', stream);
      
      if (stream) {
        streamRef.current = stream;
        onStreamReady(stream);
        onPermissionChange(true);
      }
      
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      onPermissionChange(false);
      
      if (error.name === 'NotAllowedError') {
        onError('Camera permission denied. Please allow camera access and try again.');
      } else if (error.name === 'NotFoundError') {
        onError('No camera found on this device.');
      } else if (error.name === 'NotSupportedError') {
        onError('Camera not supported in this browser.');
      } else {
        onError('Failed to access camera. Please check your device and browser settings.');
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
    onPermissionChange(null);
  };

  useEffect(() => {
    if (isScanning) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isScanning]);

  // Initial state - ready to start
  if (!isScanning) {
    return (
      <div>
        <Camera className="h-16 w-16 mx-auto text-blue-400 mb-4" />
        <p className="text-slate-600">Click to start scanning products</p>
        <Button 
          onClick={onStartScanning}
          className="mt-4 bg-blue-600 hover:bg-blue-700"
        >
          <Camera className="h-4 w-4 mr-2" />
          Start Camera
        </Button>
      </div>
    );
  }

  // Loading state
  if (hasPermission === null && !error) {
    return (
      <div>
        <Camera className="h-16 w-16 mx-auto text-blue-400 mb-4 animate-pulse" />
        <p className="text-blue-600">Starting camera...</p>
      </div>
    );
  }

  // Permission denied or error
  if (error) {
    return (
      <div>
        <Camera className="h-16 w-16 mx-auto text-red-400 mb-4" />
        <p className="text-red-600 mb-2">{error}</p>
        <p className="text-sm text-slate-500 mb-4">
          Please ensure your browser has camera permissions enabled
        </p>
        <div className="flex gap-2 justify-center">
          <Button 
            onClick={onStartScanning}
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            Try Again
          </Button>
          <Button 
            onClick={onStopScanning}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default CameraPermissionHandler;
