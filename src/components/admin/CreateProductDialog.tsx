
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
  const [formData, setFormData] = useState({
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
    nutri_score: '',
    allergens: [] as string[],
  });
  const { toast } = useToast();

  const handleCreateProduct = async () => {
    try {
      console.log('Creating product with data:', formData);
      
      const productData = {
        name: formData.name,
        description: formData.description,
        ingredients: formData.ingredients,
        manufacturing_date: formData.manufacturing_date,
        expiry_date: formData.expiry_date,
        batch_number: formData.batch_number,
        certification_number: formData.certification_number || null,
        manufacturer_id: formData.manufacturer_id || null,
        category_id: formData.category_id || null,
        country: formData.country || null,
        state: formData.state || null,
        city: formData.city || null,
        nutri_score: formData.nutri_score || null,
        allergens: formData.allergens.length > 0 ? formData.allergens : null,
        status: 'pending' as const,
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

      // Reset form
      setFormData({
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
        nutri_score: '',
        allergens: [],
      });

      onClose();
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

  const addAllergen = (allergen: string) => {
    if (allergen && !formData.allergens.includes(allergen)) {
      setFormData(prev => ({
        ...prev,
        allergens: [...prev.allergens, allergen]
      }));
    }
  };

  const removeAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.filter(a => a !== allergen)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="batch_number">Batch Number *</Label>
              <Input
                id="batch_number"
                value={formData.batch_number}
                onChange={(e) => setFormData(prev => ({ ...prev, batch_number: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="ingredients">Ingredients *</Label>
            <Textarea
              id="ingredients"
              value={formData.ingredients}
              onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="manufacturing_date">Manufacturing Date *</Label>
              <Input
                id="manufacturing_date"
                type="date"
                value={formData.manufacturing_date}
                onChange={(e) => setFormData(prev => ({ ...prev, manufacturing_date: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="expiry_date">Expiry Date *</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Select value={formData.manufacturer_id} onValueChange={(value) => setFormData(prev => ({ ...prev, manufacturer_id: value }))}>
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
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
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
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="certification_number">Certification Number</Label>
              <Input
                id="certification_number"
                value={formData.certification_number}
                onChange={(e) => setFormData(prev => ({ ...prev, certification_number: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="nutri_score">Nutri-Score</Label>
              <Select value={formData.nutri_score} onValueChange={(value) => setFormData(prev => ({ ...prev, nutri_score: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Nutri-Score" />
                </SelectTrigger>
                <SelectContent>
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
            <Label>Allergens</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.allergens.map((allergen) => (
                <span
                  key={allergen}
                  className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm cursor-pointer"
                  onClick={() => removeAllergen(allergen)}
                >
                  {allergen} ×
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add allergen and press Enter"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addAllergen((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleCreateProduct} className="flex-1">
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
