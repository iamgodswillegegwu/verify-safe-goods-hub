
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Mail, Phone, Calendar, Shield, Edit, Trash2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: 'consumer' | 'manufacturer' | 'admin' | 'super_admin' | 'test_user';
  created_at: string;
  updated_at: string;
}

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const UserCard = ({ user, onEdit, onDelete }: UserCardProps) => {
  const getRoleBadgeColor = (role: User['role']) => {
    switch (role) {
      case 'admin':
      case 'super_admin':
        return 'bg-red-100 text-red-800';
      case 'manufacturer':
        return 'bg-blue-100 text-blue-800';
      case 'test_user':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {user.first_name && user.last_name 
                  ? `${user.first_name} ${user.last_name}` 
                  : 'No name set'}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="h-3 w-3" />
                {user.email}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 ml-13">
            {user.phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {user.phone}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Joined {new Date(user.created_at).toLocaleDateString()}
            </div>
            <Badge className={getRoleBadgeColor(user.role)}>
              <Shield className="h-3 w-3 mr-1" />
              {user.role.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(user)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(user.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
