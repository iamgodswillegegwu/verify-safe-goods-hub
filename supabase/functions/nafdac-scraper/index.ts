
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { scrapeNAFDACProducts } from './scraper.ts'
import { cacheNAFDACResult, getCachedResult } from './cache.ts'
import { NAFDACSearchRequest, NAFDACResponse } from './types.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { searchQuery, limit = 5 }: NAFDACSearchRequest = await req.json()
    
    if (!searchQuery) {
      return new Response(
        JSON.stringify({ error: 'Search query is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check cache first
    const cached = await getCachedResult(supabase, searchQuery);

    if (cached) {
      console.log('Returning cached NAFDAC result')
      return new Response(
        JSON.stringify(cached.result_data),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Scrape NAFDAC data
    const products = await scrapeNAFDACProducts(searchQuery, limit)
    
    const result: NAFDACResponse = {
      found: products.length > 0,
      verified: products.length > 0,
      confidence: products.length > 0 ? 0.8 : 0,
      source: 'nafdac',
      products: products,
      alternatives: []
    }

    // Cache the result
    await cacheNAFDACResult(supabase, searchQuery, products)

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('NAFDAC scraper error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch NAFDAC data',
        found: false,
        verified: false,
        confidence: 0,
        source: 'nafdac',
        products: [],
        alternatives: []
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
