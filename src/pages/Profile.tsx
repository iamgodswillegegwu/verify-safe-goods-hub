
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import UserSidebar from '@/components/UserSidebar';
import UserProfileContent from '@/components/UserProfileContent';

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <UserSidebar />
        
        <div className="flex-1 lg:ml-64">
          <div className="p-6">
            <UserProfileContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
