
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('consumer', 'manufacturer', 'admin');
CREATE TYPE product_status AS ENUM ('pending', 'under_review', 'approved', 'rejected');
CREATE TYPE verification_result AS ENUM ('verified', 'not_found', 'counterfeit');

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'consumer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Manufacturers table
CREATE TABLE manufacturers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  registration_number TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  country TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  website TEXT,
  description TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  manufacturer_id UUID REFERENCES manufacturers(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  manufacturing_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  batch_number TEXT NOT NULL,
  certification_number TEXT UNIQUE,
  status product_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product verifications table (stores scan/search results)
CREATE TABLE verifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  search_query TEXT,
  result verification_result NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription plans table
CREATE TABLE subscription_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  features TEXT[] NOT NULL,
  scan_limit INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions table
CREATE TABLE user_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('Cosmetics', 'Beauty and cosmetic products'),
('Skincare', 'Skin care and treatment products'),
('Hair Care', 'Hair care and styling products'),
('Food Products', 'Packaged and canned food items'),
('Supplements', 'Health and dietary supplements'),
('Personal Care', 'Personal hygiene and care products');

-- Insert default subscription plans
INSERT INTO subscription_plans (name, price, features, scan_limit) VALUES
('Free', 0.00, ARRAY['Basic product verification', 'Limited scans'], 10),
('Premium', 9.99, ARRAY['Unlimited scans', 'Detailed product history', 'Priority support'], NULL),
('Business', 29.99, ARRAY['All Premium features', 'Manufacturer dashboard', 'Analytics'], NULL);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for manufacturers
CREATE POLICY "Manufacturers can view own data" ON manufacturers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Manufacturers can insert own data" ON manufacturers
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Manufacturers can update own data" ON manufacturers
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for products
CREATE POLICY "Anyone can view approved products" ON products
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Manufacturers can view own products" ON products
  FOR SELECT USING (
    manufacturer_id IN (
      SELECT id FROM manufacturers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Manufacturers can insert own products" ON products
  FOR INSERT WITH CHECK (
    manufacturer_id IN (
      SELECT id FROM manufacturers WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for verifications
CREATE POLICY "Users can view own verifications" ON verifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert verifications" ON verifications
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'last_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
