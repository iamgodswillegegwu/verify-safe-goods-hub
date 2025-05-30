
import { createClient } from '@supabase/supabase-js';

// Use the direct Supabase configuration since this project is connected
const supabaseUrl = 'https://flyvlvtvgvfybtnuntsd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseXZsdnR2Z3ZmeWJ0bnVudHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NDQ5MTgsImV4cCI6MjA2NDEyMDkxOH0.iGlfXJUM6EZUwE_s0ipn6LR4ZkgK3d2hojRs5m_xo-g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database - updated with new fields
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
  postal_code?: string;
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
  nutri_score?: 'A' | 'B' | 'C' | 'D' | 'E';
  country?: string;
  state?: string;
  city?: string;
  allergens?: string[];
  nutrition_facts?: any;
  certification_documents?: string[];
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

export interface UserFavorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface ProductReport {
  id: string;
  user_id?: string;
  product_id: string;
  reason: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
}
