
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  ingredients: string;
  manufacturing_date: string;
  expiry_date: string;
  batch_number: string;
  certification_number?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  nutri_score?: string | null;
  country?: string;
  state?: string;
  city?: string;
  allergens?: string[];
  created_at: string;
  updated_at: string;
  manufacturer?: {
    id: string;
    company_name: string;
    email: string;
  };
  category?: {
    id: string;
    name: string;
  };
  manufacturer_id?: string;
  category_id?: string;
}

interface ViewProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const ViewProductDialog = ({ isOpen, onClose, product }: ViewProductDialogProps) => {
  const getStatusBadgeColor = (status: Product['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Product['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-3 w-3" />;
      case 'rejected':
        return <XCircle className="h-3 w-3" />;
      case 'under_review':
        return <Clock className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        {product && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Product Name</Label>
                <p className="text-sm text-gray-600">{product.name}</p>
              </div>
              <div>
                <Label className="font-semibold">Status</Label>
                <Badge className={getStatusBadgeColor(product.status)}>
                  {getStatusIcon(product.status)}
                  {product.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="font-semibold">Description</Label>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>
            <div>
              <Label className="font-semibold">Ingredients</Label>
              <p className="text-sm text-gray-600">{product.ingredients}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Manufacturing Date</Label>
                <p className="text-sm text-gray-600">{new Date(product.manufacturing_date).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="font-semibold">Expiry Date</Label>
                <p className="text-sm text-gray-600">{new Date(product.expiry_date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Batch Number</Label>
                <p className="text-sm text-gray-600">{product.batch_number}</p>
              </div>
              {product.certification_number && (
                <div>
                  <Label className="font-semibold">Certification Number</Label>
                  <p className="text-sm text-gray-600">{product.certification_number}</p>
                </div>
              )}
            </div>
            {product.manufacturer && (
              <div>
                <Label className="font-semibold">Manufacturer</Label>
                <p className="text-sm text-gray-600">{product.manufacturer.company_name}</p>
              </div>
            )}
            {product.category && (
              <div>
                <Label className="font-semibold">Category</Label>
                <p className="text-sm text-gray-600">{product.category.name}</p>
              </div>
            )}
            {product.country && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="font-semibold">Country</Label>
                  <p className="text-sm text-gray-600">{product.country}</p>
                </div>
                {product.state && (
                  <div>
                    <Label className="font-semibold">State</Label>
                    <p className="text-sm text-gray-600">{product.state}</p>
                  </div>
                )}
                {product.city && (
                  <div>
                    <Label className="font-semibold">City</Label>
                    <p className="text-sm text-gray-600">{product.city}</p>
                  </div>
                )}
              </div>
            )}
            {product.allergens && product.allergens.length > 0 && (
              <div>
                <Label className="font-semibold">Allergens</Label>
                <p className="text-sm text-gray-600">{product.allergens.join(', ')}</p>
              </div>
            )}
            {product.nutri_score && (
              <div>
                <Label className="font-semibold">Nutri-Score</Label>
                <p className="text-sm text-gray-600">{product.nutri_score}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewProductDialog;
