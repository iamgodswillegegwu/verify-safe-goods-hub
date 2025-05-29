
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ProductFilters from './ProductFilters';
import ProductCard from './ProductCard';
import CreateProductDialog from './CreateProductDialog';
import ViewProductDialog from './ViewProductDialog';
import EditProductDialog from './EditProductDialog';

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

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchManufacturers();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products from database...');
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          manufacturer:manufacturers(id, company_name, email),
          category:categories(id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to fetch products. Please check your permissions.",
          variant: "destructive",
        });
        return;
      }

      console.log('Successfully fetched products:', data?.length || 0);
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchManufacturers = async () => {
    try {
      const { data, error } = await supabase
        .from('manufacturers')
        .select('id, company_name, email')
        .eq('is_approved', true)
        .order('company_name');

      if (error) {
        console.error('Error fetching manufacturers:', error);
        return;
      }

      setManufacturers(data || []);
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
    }
  };

  const handleViewProduct = (product: Product) => {
    console.log('Viewing product:', product.name);
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    console.log('Editing product:', product.name);
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('Attempting to delete product:', productId);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Error",
          description: `Failed to delete product: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Product deleted successfully');
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleQuickStatusUpdate = async (productId: string, newStatus: Product['status']) => {
    try {
      console.log('Updating product status:', productId, 'to:', newStatus);
      
      const { error } = await supabase
        .from('products')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (error) {
        console.error('Error updating product status:', error);
        toast({
          title: "Error",
          description: `Failed to update status: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Product status updated successfully');
      toast({
        title: "Success",
        description: `Product status updated to ${newStatus}`,
      });

      fetchProducts();
    } catch (error) {
      console.error('Error updating product status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.manufacturer?.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || product.category?.id === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-6 w-6" />
            Product Management
          </h2>
          <p className="text-gray-600 mt-2">Loading products...</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="h-6 w-6" />
          Product Management
        </h2>
        <p className="text-gray-600 mt-2">Manage product database and verification queue</p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <ProductFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            categories={categories}
            onCreateProduct={() => setIsCreateDialogOpen(true)}
            onRefresh={fetchProducts}
          />
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Products ({filteredProducts.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No products found matching your criteria
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onView={handleViewProduct}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  onQuickStatusUpdate={handleQuickStatusUpdate}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateProductDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        categories={categories}
        manufacturers={manufacturers}
        onProductCreated={fetchProducts}
      />

      <ViewProductDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        product={selectedProduct}
      />

      <EditProductDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        product={selectedProduct}
        onProductUpdated={fetchProducts}
      />
    </div>
  );
};

export default ProductManagement;
