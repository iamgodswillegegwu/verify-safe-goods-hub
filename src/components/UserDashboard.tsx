import { useState, useEffect } from 'react';
import { User, Heart, Clock, BarChart3, Settings, Star, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { getUserFavorites, getVerificationHistory, removeFromFavorites } from '@/services/productService';
import { Product, Verification } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { UserSidebar } from './UserSidebar';
import { Shield as ShieldIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [verificationHistory, setVerificationHistory] = useState<Verification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const [favoritesData, historyData] = await Promise.all([
        getUserFavorites(user.id),
        getVerificationHistory(user.id)
      ]);
      
      setFavorites(favoritesData);
      setVerificationHistory(historyData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId: string) => {
    if (!user) return;

    try {
      await removeFromFavorites(user.id, productId);
      setFavorites(prev => prev.filter(p => p.id !== productId));
      toast({
        title: "Removed from Favorites",
        description: "Product removed from your favorites.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove from favorites.",
        variant: "destructive"
      });
    }
  };

  const getDashboardStats = () => {
    const verifiedCount = verificationHistory.filter(v => v.result === 'verified').length;
    const notFoundCount = verificationHistory.filter(v => v.result === 'not_found').length;
    const favoritesCount = favorites.length;
    
    return {
      totalVerifications: verificationHistory.length,
      verifiedProducts: verifiedCount,
      notFoundProducts: notFoundCount,
      favoritesCount
    };
  };

  // Dynamic welcome message based on time
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const firstName = profile?.first_name || 'Friend';
    
    if (hour < 12) {
      return `Good morning, ${firstName}! ☀️`;
    } else if (hour < 17) {
      return `Good afternoon, ${firstName}! 🌤️`;
    } else {
      return `Good evening, ${firstName}! 🌙`;
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = getDashboardStats();

  const DashboardContent = () => (
    <div className="container mx-auto px-4 py-8">
      {/* Dynamic Welcome Message */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            {getWelcomeMessage()}
          </h1>
          <p className="text-blue-600">
            Welcome back to your SafeGoods dashboard! Your product safety journey continues here. 💙
          </p>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-800">{stats.totalVerifications}</div>
            <div className="text-sm text-blue-600">Total Verifications</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6 text-center">
            <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{stats.verifiedProducts}</div>
            <div className="text-sm text-green-600">Verified Products</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-800">{stats.notFoundProducts}</div>
            <div className="text-sm text-red-600">Not Found</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-800">{stats.favoritesCount}</div>
            <div className="text-sm text-purple-600">Favorite Products</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
          <TabsTrigger value="history">History ({verificationHistory.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Favorites */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Recent Favorites
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favorites.slice(0, 3).length > 0 ? (
                  <div className="space-y-3">
                    {favorites.slice(0, 3).map((product) => (
                      <div key={product.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800">{product.name}</h4>
                          <p className="text-sm text-slate-600">
                            {product.manufacturer?.company_name}
                          </p>
                        </div>
                        {product.nutri_score && (
                          <Badge variant="outline" className="text-green-700 border-green-300">
                            {product.nutri_score}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-4">No favorites yet</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Verifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Recent Verifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {verificationHistory.slice(0, 3).length > 0 ? (
                  <div className="space-y-3">
                    {verificationHistory.slice(0, 3).map((verification) => (
                      <div key={verification.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800">
                            {verification.product?.name || verification.search_query}
                          </h4>
                          <p className="text-sm text-slate-600">
                            {new Date(verification.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge 
                          variant={verification.result === 'verified' ? 'default' : 'destructive'}
                          className={verification.result === 'verified' ? 'bg-green-600' : ''}
                        >
                          {verification.result === 'verified' ? 'Verified' : 'Not Found'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-4">No verifications yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Favorite Products</CardTitle>
            </CardHeader>
            <CardContent>
              {favorites.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {favorites.map((product) => (
                    <div key={product.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-800">{product.name}</h3>
                          <p className="text-sm text-slate-600">
                            {product.manufacturer?.company_name}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveFavorite(product.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {product.category && (
                          <Badge variant="secondary" className="text-xs">
                            {product.category.name}
                          </Badge>
                        )}
                        {product.nutri_score && (
                          <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                            Nutri-Score {product.nutri_score}
                          </Badge>
                        )}
                        {product.country && (
                          <Badge variant="outline" className="text-xs">
                            {product.country}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">No favorite products yet</p>
                  <p className="text-sm text-slate-500">Start adding products to your favorites!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Verification History</CardTitle>
            </CardHeader>
            <CardContent>
              {verificationHistory.length > 0 ? (
                <div className="space-y-3">
                  {verificationHistory.map((verification) => (
                    <div key={verification.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800">
                            {verification.product?.name || verification.search_query}
                          </h3>
                          <p className="text-sm text-slate-600 mb-2">
                            Searched on {new Date(verification.created_at).toLocaleDateString()}
                          </p>
                          {verification.product && (
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {verification.product.category?.name}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {verification.product.manufacturer?.company_name}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <Badge 
                          variant={verification.result === 'verified' ? 'default' : 'destructive'}
                          className={verification.result === 'verified' ? 'bg-green-600' : ''}
                        >
                          {verification.result === 'verified' ? 'Verified' : 'Not Found'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">No verification history yet</p>
                  <p className="text-sm text-slate-500">Start verifying products to see your history!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <UserSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b bg-white/80 backdrop-blur-sm">
            <SidebarTrigger className="ml-2" />
            <div className="flex items-center gap-2 ml-4">
              <ShieldIcon className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-slate-800">SafeGoods - Dashboard</span>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <DashboardContent />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserDashboard;
