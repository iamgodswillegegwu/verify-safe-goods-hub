
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Manufacturer {
  id: string;
  company_name: string;
  email: string;
}

interface CreateProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  manufacturers: Manufacturer[];
  onProductCreated: () => void;
}

const CreateProductDialog = ({ isOpen, onClose, categories, manufacturers, onProductCreated }: CreateProductDialogProps) => {
  const [createFormData, setCreateFormData] = useState({
    name: '',
    description: '',
    ingredients: '',
    manufacturing_date: '',
    expiry_date: '',
    batch_number: '',
    certification_number: '',
    manufacturer_id: '',
    category_id: '',
    country: '',
    state: '',
    city: '',
    allergens: '',
    nutri_score: '',
  });
  const { toast } = useToast();

  const handleCreateProduct = async () => {
    try {
      console.log('Creating new product:', createFormData.name);
      
      const allergensList = createFormData.allergens 
        ? createFormData.allergens.split(',').map(item => item.trim()).filter(item => item)
        : [];

      const productData = {
        name: createFormData.name,
        description: createFormData.description,
        ingredients: createFormData.ingredients,
        manufacturing_date: createFormData.manufacturing_date,
        expiry_date: createFormData.expiry_date,
        batch_number: createFormData.batch_number,
        certification_number: createFormData.certification_number || null,
        manufacturer_id: createFormData.manufacturer_id || null,
        category_id: createFormData.category_id || null,
        country: createFormData.country || null,
        state: createFormData.state || null,
        city: createFormData.city || null,
        allergens: allergensList.length > 0 ? allergensList : null,
        nutri_score: createFormData.nutri_score || null,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) {
        console.error('Error creating product:', error);
        toast({
          title: "Error",
          description: `Failed to create product: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Product created successfully');
      toast({
        title: "Success",
        description: "Product created successfully",
      });

      onClose();
      setCreateFormData({
        name: '',
        description: '',
        ingredients: '',
        manufacturing_date: '',
        expiry_date: '',
        batch_number: '',
        certification_number: '',
        manufacturer_id: '',
        category_id: '',
        country: '',
        state: '',
        city: '',
        allergens: '',
        nutri_score: '',
      });
      onProductCreated();
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="create_name">Product Name *</Label>
              <Input
                id="create_name"
                value={createFormData.name}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="create_batch">Batch Number *</Label>
              <Input
                id="create_batch"
                value={createFormData.batch_number}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, batch_number: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="create_description">Description *</Label>
            <Textarea
              id="create_description"
              value={createFormData.description}
              onChange={(e) => setCreateFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="create_ingredients">Ingredients *</Label>
            <Textarea
              id="create_ingredients"
              value={createFormData.ingredients}
              onChange={(e) => setCreateFormData(prev => ({ ...prev, ingredients: e.target.value }))}
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="create_manufacturing_date">Manufacturing Date *</Label>
              <Input
                id="create_manufacturing_date"
                type="date"
                value={createFormData.manufacturing_date}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, manufacturing_date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="create_expiry_date">Expiry Date *</Label>
              <Input
                id="create_expiry_date"
                type="date"
                value={createFormData.expiry_date}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="create_manufacturer">Manufacturer</Label>
              <Select value={createFormData.manufacturer_id} onValueChange={(value) => setCreateFormData(prev => ({ ...prev, manufacturer_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select manufacturer" />
                </SelectTrigger>
                <SelectContent>
                  {manufacturers.map((manufacturer) => (
                    <SelectItem key={manufacturer.id} value={manufacturer.id}>
                      {manufacturer.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="create_category">Category</Label>
              <Select value={createFormData.category_id} onValueChange={(value) => setCreateFormData(prev => ({ ...prev, category_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="create_country">Country</Label>
              <Input
                id="create_country"
                value={createFormData.country}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, country: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="create_state">State</Label>
              <Input
                id="create_state"
                value={createFormData.state}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, state: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="create_city">City</Label>
              <Input
                id="create_city"
                value={createFormData.city}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, city: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="create_certification">Certification Number</Label>
              <Input
                id="create_certification"
                value={createFormData.certification_number}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, certification_number: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="create_nutri_score">Nutri-Score</Label>
              <Select value={createFormData.nutri_score} onValueChange={(value) => setCreateFormData(prev => ({ ...prev, nutri_score: value }))}>
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
          </div>
          <div>
            <Label htmlFor="create_allergens">Allergens (comma-separated)</Label>
            <Input
              id="create_allergens"
              value={createFormData.allergens}
              onChange={(e) => setCreateFormData(prev => ({ ...prev, allergens: e.target.value }))}
              placeholder="e.g., Nuts, Dairy, Gluten"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleCreateProduct} 
              className="flex-1"
              disabled={!createFormData.name || !createFormData.description || !createFormData.ingredients || !createFormData.manufacturing_date || !createFormData.expiry_date || !createFormData.batch_number}
            >
              Create Product
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

export default CreateProductDialog;
