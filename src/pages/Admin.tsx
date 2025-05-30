
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/AdminSidebar';
import Overview from '@/components/admin/Overview';
import UserManagement from '@/components/admin/UserManagement';
import ProductManagement from '@/components/admin/ProductManagement';
import PaymentManagement from '@/components/admin/PaymentManagement';
import APIIntegrations from '@/components/admin/APIIntegrations';

const Admin = () => {
  const { profile, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalManufacturers: 0,
    totalVerifications: 0,
    pendingProducts: 0,
    recentActivity: []
  });
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      fetchStats();
    }
  }, [profile]);

  const fetchStats = async () => {
    try {
      // Fetch all stats in parallel
      const [
        { count: usersCount },
        { count: productsCount },
        { count: manufacturersCount },
        { count: verificationsCount },
        { count: pendingCount },
        { data: activityData }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('manufacturers').select('*', { count: 'exact', head: true }),
        supabase.from('verifications').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('user_activity_logs').select('*').order('created_at', { ascending: false }).limit(10)
      ]);

      setStats({
        totalUsers: usersCount || 0,
        totalProducts: productsCount || 0,
        totalManufacturers: manufacturersCount || 0,
        totalVerifications: verificationsCount || 0,
        pendingProducts: pendingCount || 0,
        recentActivity: activityData || []
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview stats={stats} onSectionChange={setActiveSection} />;
      case 'users':
        return <UserManagement />;
      case 'products':
        return <ProductManagement />;
      case 'payments':
        return <PaymentManagement />;
      case 'api-integrations':
        return <APIIntegrations />;
      default:
        return <Overview stats={stats} onSectionChange={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <main className="flex-1 p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Admin;
