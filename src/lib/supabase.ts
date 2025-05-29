
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: 'consumer' | 'manufacturer' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Manufacturer {
  id: string;
  user_id: string;
  company_name: string;
  registration_number: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  city: string;
  website?: string;
  description: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  manufacturer_id: string;
  category_id: string;
  name: string;
  description: string;
  ingredients: string;
  manufacturing_date: string;
  expiry_date: string;
  batch_number: string;
  certification_number?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  manufacturer?: Manufacturer;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Verification {
  id: string;
  user_id?: string;
  product_id?: string;
  search_query?: string;
  result: 'verified' | 'not_found' | 'counterfeit';
  created_at: string;
  product?: Product;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  scan_limit?: number;
  created_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  starts_at: string;
  ends_at?: string;
  is_active: boolean;
  created_at: string;
  plan?: SubscriptionPlan;
}
