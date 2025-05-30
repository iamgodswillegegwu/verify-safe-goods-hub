
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { UserSidebar } from '@/components/UserSidebar';
import UserProfileContent from '@/components/UserProfileContent';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <UserSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b bg-white/80 backdrop-blur-sm">
            <SidebarTrigger className="ml-2" />
            <div className="flex items-center gap-2 ml-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-slate-800">SafeGoods - User Profile</span>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto">
            <UserProfileContent />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Profile;
