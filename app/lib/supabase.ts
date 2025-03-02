import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// File: app/lib/types.ts
export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  user_id: string;
  created_at: string;
}

export interface WeightFormData {
  weight: number;
  date: Date;
}
