
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  role: 'consumer' | 'manufacturer' | 'admin' | 'super_admin' | 'test_user';
}

interface CreateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

const CreateUserDialog = ({ isOpen, onClose, onUserCreated }: CreateUserDialogProps) => {
  const [createFormData, setCreateFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'consumer' as User['role']
  });
  const { toast } = useToast();

  const handleCreateUser = async () => {
    try {
      console.log('Creating new user:', createFormData.email);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: createFormData.email,
        password: createFormData.password,
        options: {
          data: {
            first_name: createFormData.first_name,
            last_name: createFormData.last_name,
            phone: createFormData.phone,
          }
        }
      });

      if (authError) {
        console.error('Error creating user in auth:', authError);
        toast({
          title: "Error",
          description: `Failed to create user: ${authError.message}`,
          variant: "destructive",
        });
        return;
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            role: createFormData.role,
            first_name: createFormData.first_name,
            last_name: createFormData.last_name,
            phone: createFormData.phone,
            updated_at: new Date().toISOString()
          })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          toast({
            title: "Warning",
            description: "User created but profile update failed. Please edit the user to set proper details.",
            variant: "destructive",
          });
        }
      }

      console.log('User created successfully');
      toast({
        title: "Success",
        description: "User created successfully",
      });

      onClose();
      setCreateFormData({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: '',
        role: 'consumer'
      });
      onUserCreated();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="create_email">Email *</Label>
            <Input
              id="create_email"
              type="email"
              value={createFormData.email}
              onChange={(e) => setCreateFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="user@example.com"
            />
          </div>
          <div>
            <Label htmlFor="create_password">Password *</Label>
            <Input
              id="create_password"
              type="password"
              value={createFormData.password}
              onChange={(e) => setCreateFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter secure password"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="create_first_name">First Name</Label>
              <Input
                id="create_first_name"
                value={createFormData.first_name}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, first_name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="create_last_name">Last Name</Label>
              <Input
                id="create_last_name"
                value={createFormData.last_name}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, last_name: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="create_phone">Phone</Label>
            <Input
              id="create_phone"
              value={createFormData.phone}
              onChange={(e) => setCreateFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="create_role">Role</Label>
            <Select value={createFormData.role} onValueChange={(value: User['role']) => setCreateFormData(prev => ({ ...prev, role: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consumer">Consumer</SelectItem>
                <SelectItem value="manufacturer">Manufacturer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="test_user">Test User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleCreateUser} 
              className="flex-1"
              disabled={!createFormData.email || !createFormData.password}
            >
              Create User
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
