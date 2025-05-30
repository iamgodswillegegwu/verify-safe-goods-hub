
import { CheckCircle, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraControlsProps {
  onCapture: () => void;
  onStop: () => void;
}

const CameraControls = ({ onCapture, onStop }: CameraControlsProps) => {
  return (
    <div className="flex gap-3 justify-center">
      <Button 
        onClick={onCapture}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Capture & Verify
      </Button>
      <Button 
        onClick={onStop}
        variant="outline"
        className="border-red-200 text-red-600 hover:bg-red-50"
      >
        <Square className="h-4 w-4 mr-2" />
        Stop Scanning
      </Button>
    </div>
  );
};

export default CameraControls;
