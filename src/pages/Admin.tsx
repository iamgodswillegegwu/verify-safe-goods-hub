
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import AdminSidebar from '@/components/AdminSidebar';
import AuthenticationSettings from '@/components/admin/AuthenticationSettings';
import APIIntegrations from '@/components/admin/APIIntegrations';
import Overview from '@/components/admin/Overview';
import UserManagement from '@/components/admin/UserManagement';
import ProductManagement from '@/components/admin/ProductManagement';

const Admin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [stats] = useState({
    totalUsers: 5642,
    totalProducts: 8934,
    verifiedProducts: 7123,
    pendingApprovals: 156,
    activeManufacturers: 89,
    dailyScans: 1542,
    totalManufacturers: 89,
    totalVerifications: 15847,
    pendingProducts: 156,
    recentActivity: []
  });

  console.log('Admin page rendering, activeSection:', activeSection);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderContent = () => {
    console.log('Rendering content for section:', activeSection);
    switch (activeSection) {
      case 'auth-settings':
        return <AuthenticationSettings />;
      case 'api-integrations':
        return <APIIntegrations />;
      case 'users':
        return <UserManagement />;
      case 'products':
        return <ProductManagement />;
      default:
        return <Overview stats={stats} onSectionChange={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="flex h-[calc(100vh-64px)] w-full">
        <AdminSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
