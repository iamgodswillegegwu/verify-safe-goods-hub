export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_stats: {
        Row: {
          api_name: string
          avg_response_time: number | null
          calls_count: number | null
          created_at: string | null
          date: string | null
          endpoint: string | null
          error_count: number | null
          id: string
          success_count: number | null
          updated_at: string | null
        }
        Insert: {
          api_name: string
          avg_response_time?: number | null
          calls_count?: number | null
          created_at?: string | null
          date?: string | null
          endpoint?: string | null
          error_count?: number | null
          id?: string
          success_count?: number | null
          updated_at?: string | null
        }
        Update: {
          api_name?: string
          avg_response_time?: number | null
          calls_count?: number | null
          created_at?: string | null
          date?: string | null
          endpoint?: string | null
          error_count?: number | null
          id?: string
          success_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      external_api_cache: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          query_hash: string
          result_data: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          query_hash: string
          result_data: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          query_hash?: string
          result_data?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      manufacturers: {
        Row: {
          address: string
          city: string
          company_name: string
          country: string
          created_at: string | null
          description: string
          email: string
          id: string
          is_approved: boolean | null
          phone: string
          postal_code: string | null
          registration_number: string
          state: string
          updated_at: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          address: string
          city: string
          company_name: string
          country: string
          created_at?: string | null
          description: string
          email: string
          id?: string
          is_approved?: boolean | null
          phone: string
          postal_code?: string | null
          registration_number: string
          state: string
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          address?: string
          city?: string
          company_name?: string
          country?: string
          created_at?: string | null
          description?: string
          email?: string
          id?: string
          is_approved?: boolean | null
          phone?: string
          postal_code?: string | null
          registration_number?: string
          state?: string
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "manufacturers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reports: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          product_id: string | null
          reason: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          product_id?: string | null
          reason: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          product_id?: string | null
          reason?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reports_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          allergens: string[] | null
          batch_number: string
          category_id: string | null
          certification_documents: string[] | null
          certification_number: string | null
          city: string | null
          country: string | null
          created_at: string | null
          description: string
          expiry_date: string
          id: string
          ingredients: string
          manufacturer_id: string | null
          manufacturing_date: string
          name: string
          nutri_score: string | null
          nutrition_facts: Json | null
          state: string | null
          status: Database["public"]["Enums"]["product_status"] | null
          updated_at: string | null
        }
        Insert: {
          allergens?: string[] | null
          batch_number: string
          category_id?: string | null
          certification_documents?: string[] | null
          certification_number?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description: string
          expiry_date: string
          id?: string
          ingredients: string
          manufacturer_id?: string | null
          manufacturing_date: string
          name: string
          nutri_score?: string | null
          nutrition_facts?: Json | null
          state?: string | null
          status?: Database["public"]["Enums"]["product_status"] | null
          updated_at?: string | null
        }
        Update: {
          allergens?: string[] | null
          batch_number?: string
          category_id?: string | null
          certification_documents?: string[] | null
          certification_number?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string
          expiry_date?: string
          id?: string
          ingredients?: string
          manufacturer_id?: string | null
          manufacturing_date?: string
          name?: string
          nutri_score?: string | null
          nutrition_facts?: Json | null
          state?: string | null
          status?: Database["public"]["Enums"]["product_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "manufacturers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          features: string[]
          id: string
          name: string
          price: number
          scan_limit: number | null
        }
        Insert: {
          created_at?: string | null
          features: string[]
          id?: string
          name: string
          price: number
          scan_limit?: number | null
        }
        Update: {
          created_at?: string | null
          features?: string[]
          id?: string
          name?: string
          price?: number
          scan_limit?: number | null
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          created_at: string | null
          ends_at: string | null
          id: string
          is_active: boolean | null
          plan_id: string | null
          starts_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          plan_id?: string | null
          starts_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          plan_id?: string | null
          starts_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      validation_logs: {
        Row: {
          confidence: number | null
          created_at: string | null
          id: string
          product_name: string
          result_summary: string | null
          risk_level: string | null
          sources_checked: Json | null
          user_id: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          product_name: string
          result_summary?: string | null
          risk_level?: string | null
          sources_checked?: Json | null
          user_id?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          product_name?: string
          result_summary?: string | null
          risk_level?: string | null
          sources_checked?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      verifications: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          result: Database["public"]["Enums"]["verification_result"]
          search_query: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          result: Database["public"]["Enums"]["verification_result"]
          search_query?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          result?: Database["public"]["Enums"]["verification_result"]
          search_query?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      product_status: "pending" | "under_review" | "approved" | "rejected"
      user_role:
        | "consumer"
        | "manufacturer"
        | "admin"
        | "super_admin"
        | "test_user"
      verification_result: "verified" | "not_found" | "counterfeit"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      product_status: ["pending", "under_review", "approved", "rejected"],
      user_role: [
        "consumer",
        "manufacturer",
        "admin",
        "super_admin",
        "test_user",
      ],
      verification_result: ["verified", "not_found", "counterfeit"],
    },
  },
} as const
