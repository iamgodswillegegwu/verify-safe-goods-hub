
import { useRef, useEffect } from 'react';
import ScanningOverlay from './ScanningOverlay';
import CameraControls from './CameraControls';

interface CameraVideoProps {
  stream: MediaStream | null;
  onCapture: () => void;
  onStop: () => void;
}

const CameraVideo = ({ stream, onCapture, onStop }: CameraVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      
      const video = videoRef.current;
      
      const handleLoadedMetadata = () => {
        console.log('Video metadata loaded, attempting to play...');
        video.play()
          .then(() => {
            console.log('Video playing successfully');
          })
          .catch((playError) => {
            console.error('Error playing video:', playError);
          });
      };

      const handleError = (videoError: Event) => {
        console.error('Video error:', videoError);
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('error', handleError);
      
      video.load();

      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('error', handleError);
      };
    }
  }, [stream]);

  if (!stream) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3', maxWidth: '100%', margin: '0 auto' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        <ScanningOverlay />
      </div>

      <CameraControls onCapture={onCapture} onStop={onStop} />
    </div>
  );
};

export default CameraVideo;
