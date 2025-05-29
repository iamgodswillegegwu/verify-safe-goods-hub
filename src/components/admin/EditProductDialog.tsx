
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface EditProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onProductUpdated: () => void;
}

const EditProductDialog = ({ isOpen, onClose, product, onProductUpdated }: EditProductDialogProps) => {
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    status: 'pending' as Product['status'],
    nutri_score: '' as string,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setEditFormData({
        name: product.name,
        description: product.description,
        status: product.status,
        nutri_score: product.nutri_score || '',
      });
    }
  }, [product]);

  const handleUpdateProduct = async () => {
    if (!product) return;

    try {
      console.log('Updating product:', product.name, 'with data:', editFormData);
      
      const updateData: any = {
        name: editFormData.name,
        description: editFormData.description,
        status: editFormData.status,
        updated_at: new Date().toISOString()
      };

      if (editFormData.nutri_score && editFormData.nutri_score !== '') {
        updateData.nutri_score = editFormData.nutri_score;
      } else {
        updateData.nutri_score = null;
      }

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', product.id);

      if (error) {
        console.error('Error updating product:', error);
        toast({
          title: "Error",
          description: `Failed to update product: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Product updated successfully');
      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      onClose();
      onProductUpdated();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={editFormData.name}
              onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editFormData.description}
              onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={editFormData.status} onValueChange={(value: Product['status']) => setEditFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="nutri_score">Nutri-Score (Optional)</Label>
            <Select value={editFormData.nutri_score} onValueChange={(value: string) => setEditFormData(prev => ({ ...prev, nutri_score: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Nutri-Score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Score</SelectItem>
                <SelectItem value="A">A (Best)</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
                <SelectItem value="E">E (Worst)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleUpdateProduct} className="flex-1">
              Update Product
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
