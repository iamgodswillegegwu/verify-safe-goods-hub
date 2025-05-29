
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

const UserManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="h-6 w-6" />
          User Management
        </h2>
        <p className="text-gray-600 mt-2">Manage user accounts, roles, and permissions</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600">User management features would be implemented here, including:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
            <li>View and search all users</li>
            <li>Manage user roles and permissions</li>
            <li>Suspend or activate user accounts</li>
            <li>View user activity logs</li>
            <li>Export user data</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
