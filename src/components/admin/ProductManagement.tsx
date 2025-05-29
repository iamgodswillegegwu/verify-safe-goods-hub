
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Search, Filter, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, Clock, PackagePlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    status: 'pending' as Product['status'],
    nutri_score: '' as string,
  });
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
        status: 'pending' as Product['status'],
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

      setIsCreateDialogOpen(false);
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
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
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
    setEditFormData({
      name: product.name,
      description: product.description,
      status: product.status,
      nutri_score: product.nutri_score || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    try {
      console.log('Updating product:', selectedProduct.name, 'with data:', editFormData);
      
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
        .eq('id', selectedProduct.id);

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

      setIsEditDialogOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products by name, description, or manufacturer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PackagePlus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
              </Dialog>
              <Button onClick={fetchProducts}>
                Refresh
              </Button>
            </div>
          </div>
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
                <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
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
                      <Select value={product.status} onValueChange={(value: Product['status']) => handleQuickStatusUpdate(product.id, value)}>
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
                        onClick={() => handleViewProduct(product)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Product Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Product Name</Label>
                  <p className="text-sm text-gray-600">{selectedProduct.name}</p>
                </div>
                <div>
                  <Label className="font-semibold">Status</Label>
                  <Badge className={getStatusBadgeColor(selectedProduct.status)}>
                    {getStatusIcon(selectedProduct.status)}
                    {selectedProduct.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="font-semibold">Description</Label>
                <p className="text-sm text-gray-600">{selectedProduct.description}</p>
              </div>
              <div>
                <Label className="font-semibold">Ingredients</Label>
                <p className="text-sm text-gray-600">{selectedProduct.ingredients}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Manufacturing Date</Label>
                  <p className="text-sm text-gray-600">{new Date(selectedProduct.manufacturing_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="font-semibold">Expiry Date</Label>
                  <p className="text-sm text-gray-600">{new Date(selectedProduct.expiry_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Batch Number</Label>
                  <p className="text-sm text-gray-600">{selectedProduct.batch_number}</p>
                </div>
                {selectedProduct.certification_number && (
                  <div>
                    <Label className="font-semibold">Certification Number</Label>
                    <p className="text-sm text-gray-600">{selectedProduct.certification_number}</p>
                  </div>
                )}
              </div>
              {selectedProduct.manufacturer && (
                <div>
                  <Label className="font-semibold">Manufacturer</Label>
                  <p className="text-sm text-gray-600">{selectedProduct.manufacturer.company_name}</p>
                </div>
              )}
              {selectedProduct.category && (
                <div>
                  <Label className="font-semibold">Category</Label>
                  <p className="text-sm text-gray-600">{selectedProduct.category.name}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
