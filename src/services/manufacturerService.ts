
import { supabase, Manufacturer, Product, Category } from '@/lib/supabase';

export const registerManufacturer = async (manufacturerData: Partial<Manufacturer>): Promise<{ data: Manufacturer | null; error: any }> => {
  const { data, error } = await supabase
    .from('manufacturers')
    .insert(manufacturerData)
    .select()
    .single();

  return { data, error };
};

export const getManufacturerByUserId = async (userId: string): Promise<Manufacturer | null> => {
  const { data, error } = await supabase
    .from('manufacturers')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching manufacturer:', error);
    return null;
  }

  return data;
};

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
};

export const addProduct = async (productData: Partial<Product>): Promise<{ data: Product | null; error: any }> => {
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select(`
      *,
      manufacturer:manufacturers(*),
      category:categories(*)
    `)
    .single();

  return { data, error };
};

export const getManufacturerProducts = async (manufacturerId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      manufacturer:manufacturers(*),
      category:categories(*)
    `)
    .eq('manufacturer_id', manufacturerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching manufacturer products:', error);
    return [];
  }

  return data || [];
};

export const updateProductStatus = async (productId: string, status: 'pending' | 'under_review' | 'approved' | 'rejected'): Promise<{ data: Product | null; error: any }> => {
  const { data, error } = await supabase
    .from('products')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', productId)
    .select(`
      *,
      manufacturer:manufacturers(*),
      category:categories(*)
    `)
    .single();

  return { data, error };
};
