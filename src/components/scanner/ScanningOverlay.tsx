
interface ScanningOverlayProps {
  children?: React.ReactNode;
}

const ScanningOverlay = ({ children }: ScanningOverlayProps) => {
  return (
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

      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black bg-opacity-70 text-white text-sm p-2 rounded text-center">
          Position product within the scanning area
        </div>
      </div>

      {children}
    </div>
  );
};

export default ScanningOverlay;
