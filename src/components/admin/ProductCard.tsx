
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, CheckCircle, XCircle, Clock, Eye, Edit, Trash2 } from 'lucide-react';

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

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onQuickStatusUpdate: (productId: string, newStatus: Product['status']) => void;
}

const ProductCard = ({ product, onView, onEdit, onDelete, onQuickStatusUpdate }: ProductCardProps) => {
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

  const getNutriScoreBadgeColor = (score?: string | null) => {
    switch (score) {
      case 'A':
        return 'bg-green-500 text-white';
      case 'B':
        return 'bg-lime-500 text-white';
      case 'C':
        return 'bg-yellow-500 text-white';
      case 'D':
        return 'bg-orange-500 text-white';
      case 'E':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 ml-13">
            <span>Batch: {product.batch_number}</span>
            {product.manufacturer && (
              <span>By: {product.manufacturer.company_name}</span>
            )}
            {product.category && (
              <span>Category: {product.category.name}</span>
            )}
            <span>Expires: {new Date(product.expiry_date).toLocaleDateString()}</span>
            <Badge className={getStatusBadgeColor(product.status)}>
              {getStatusIcon(product.status)}
              {product.status.replace('_', ' ').toUpperCase()}
            </Badge>
            {product.nutri_score && (
              <Badge className={getNutriScoreBadgeColor(product.nutri_score)}>
                Nutri-Score: {product.nutri_score}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={product.status} onValueChange={(value: Product['status']) => onQuickStatusUpdate(product.id, value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(product)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(product.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
