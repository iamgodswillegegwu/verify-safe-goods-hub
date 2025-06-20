
export interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  location?: string;
  phone?: string;
  date_of_birth?: string;
  profile_picture_url?: string;
  role?: 'consumer' | 'manufacturer' | 'admin' | 'super_admin' | 'test_user';
  preferences?: any;
  created_at?: string;
  updated_at?: string;
}
