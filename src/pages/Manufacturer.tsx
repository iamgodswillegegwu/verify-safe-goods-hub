import { useState } from 'react';
import { Building2, Upload, FileText, Award, Mail, Phone, MapPin, Package, Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';

const Manufacturer = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    state: '',
    city: '',
    website: '',
    description: ''
  });

  const [productForm, setProductForm] = useState({
    productName: '',
    category: '',
    description: '',
    ingredients: '',
    manufacturingDate: '',
    expiryDate: '',
    batchNumber: '',
    certificationNumber: ''
  });

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    console.log('Company registration:', formData);
    // Handle company registration
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    console.log('Product registration:', productForm);
    // Handle product registration
  };

  const registeredProducts = [
    {
      id: 1,
      name: 'Premium Face Cream',
      category: 'Cosmetics',
      status: 'Approved',
      registrationDate: '2024-01-15',
      certificationNumber: 'CERT-2024-001'
    },
    {
      id: 2,
      name: 'Organic Shampoo',
      category: 'Personal Care',
      status: 'Pending',
      registrationDate: '2024-01-20',
      certificationNumber: 'CERT-2024-002'
    },
    {
      id: 3,
      name: 'Natural Hand Sanitizer',
      category: 'Health & Safety',
      status: 'Under Review',
      registrationDate: '2024-01-25',
      certificationNumber: 'CERT-2024-003'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Under Review': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Manufacturer Portal</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Register your company and products to ensure compliance with safety regulations 
              and build consumer trust through verification.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="register">Register Company</TabsTrigger>
              <TabsTrigger value="products">Add Products</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            </TabsList>

            {/* Company Registration Tab */}
            <TabsContent value="register" className="space-y-6">
              <Card className="border-2 border-blue-100">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Company Registration
                  </CardTitle>
                  <CardDescription>
                    Provide your company information and required documentation for verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleCompanySubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          placeholder="Enter company name"
                          value={formData.companyName}
                          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="registrationNumber">Registration Number *</Label>
                        <Input
                          id="registrationNumber"
                          placeholder="Company registration number"
                          value={formData.registrationNumber}
                          onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="company@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Business Address *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Textarea
                          id="address"
                          placeholder="Enter complete business address"
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Select onValueChange={(value) => setFormData({...formData, country: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                            <SelectItem value="de">Germany</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State/Province *</Label>
                        <Input
                          id="state"
                          placeholder="State or province"
                          value={formData.state}
                          onChange={(e) => setFormData({...formData, state: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website (Optional)</Label>
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://www.company.com"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Company Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your company, products, and manufacturing capabilities"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={4}
                        required
                      />
                    </div>

                    {/* Document Upload Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-800">Required Documents</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
                          <CardContent className="p-6 text-center">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600 mb-2">Company Registration Certificate</p>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Upload File
                            </Button>
                          </CardContent>
                        </Card>
                        <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
                          <CardContent className="p-6 text-center">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600 mb-2">Manufacturing License</p>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Upload File
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                      Submit Registration
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Product Registration Tab */}
            <TabsContent value="products" className="space-y-6">
              <Card className="border-2 border-green-100">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-600" />
                    Product Registration
                  </CardTitle>
                  <CardDescription>
                    Add new products to your portfolio for verification and approval
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleProductSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="productName">Product Name *</Label>
                        <Input
                          id="productName"
                          placeholder="Enter product name"
                          value={productForm.productName}
                          onChange={(e) => setProductForm({...productForm, productName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select onValueChange={(value) => setProductForm({...productForm, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cosmetics">Cosmetics</SelectItem>
                            <SelectItem value="skincare">Skincare</SelectItem>
                            <SelectItem value="haircare">Hair Care</SelectItem>
                            <SelectItem value="food">Food Products</SelectItem>
                            <SelectItem value="supplements">Supplements</SelectItem>
                            <SelectItem value="personal-care">Personal Care</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productDescription">Product Description *</Label>
                      <Textarea
                        id="productDescription"
                        placeholder="Describe the product, its benefits, and usage"
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        rows={3}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ingredients">Ingredients/Contents *</Label>
                      <Textarea
                        id="ingredients"
                        placeholder="List all ingredients or contents"
                        value={productForm.ingredients}
                        onChange={(e) => setProductForm({...productForm, ingredients: e.target.value})}
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="manufacturingDate">Manufacturing Date *</Label>
                        <Input
                          id="manufacturingDate"
                          type="date"
                          value={productForm.manufacturingDate}
                          onChange={(e) => setProductForm({...productForm, manufacturingDate: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date *</Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          value={productForm.expiryDate}
                          onChange={(e) => setProductForm({...productForm, expiryDate: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="batchNumber">Batch Number *</Label>
                        <Input
                          id="batchNumber"
                          placeholder="Batch/Lot number"
                          value={productForm.batchNumber}
                          onChange={(e) => setProductForm({...productForm, batchNumber: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    {/* Lab Test Results Upload */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-800">Required Documentation</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
                          <CardContent className="p-4 text-center">
                            <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                            <p className="text-xs text-gray-600 mb-2">Lab Test Results</p>
                            <Button variant="outline" size="sm">
                              <FileText className="h-3 w-3 mr-1" />
                              Upload
                            </Button>
                          </CardContent>
                        </Card>
                        <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
                          <CardContent className="p-4 text-center">
                            <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                            <p className="text-xs text-gray-600 mb-2">Safety Certificate</p>
                            <Button variant="outline" size="sm">
                              <FileText className="h-3 w-3 mr-1" />
                              Upload
                            </Button>
                          </CardContent>
                        </Card>
                        <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
                          <CardContent className="p-4 text-center">
                            <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                            <p className="text-xs text-gray-600 mb-2">Product Images</p>
                            <Button variant="outline" size="sm">
                              <FileText className="h-3 w-3 mr-1" />
                              Upload
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium" 
                      size="lg"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Register Product
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6 text-center">
                    <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-800">12</div>
                    <div className="text-sm text-blue-600">Total Products</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6 text-center">
                    <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-800">8</div>
                    <div className="text-sm text-green-600">Approved</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                  <CardContent className="p-6 text-center">
                    <FileText className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-800">4</div>
                    <div className="text-sm text-yellow-600">Pending Review</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Registered Products</CardTitle>
                  <CardDescription>
                    Manage your product portfolio and track approval status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {registeredProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-slate-800">{product.name}</h3>
                          <p className="text-sm text-slate-600">{product.category}</p>
                          <p className="text-xs text-slate-500">
                            Registered: {new Date(product.registrationDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(product.status)}>
                            {product.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Manufacturer;
