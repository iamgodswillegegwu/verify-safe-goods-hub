
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AutoSuggestSearch from '../AutoSuggestSearch';

interface SearchInterfaceProps {
  searchQuery: string;
  barcode: string;
  onBarcodeChange: (barcode: string) => void;
  onProductSelect: (productName: string, isExternal?: boolean, product?: any) => void;
}

const SearchInterface = ({
  searchQuery,
  barcode,
  onBarcodeChange,
  onProductSelect
}: SearchInterfaceProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="search">Product Name (with Auto-Suggest)</Label>
        <AutoSuggestSearch
          onProductSelect={onProductSelect}
          placeholder="Start typing for suggestions..."
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="barcode">Barcode (Optional)</Label>
        <Input
          id="barcode"
          placeholder="Enter barcode..."
          value={barcode}
          onChange={(e) => onBarcodeChange(e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default SearchInterface;
