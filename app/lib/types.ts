export interface WeightEntry {
  id: string;
  user_id: string;
  weight: number;
  date: string; // ISO date string
  created_at: string; // ISO date string
}

export interface WeightFormData {
  date: Date; // JavaScript Date object
  weight: number; // Weight in kilograms
}

// Supabase User type to prevent TypeScript errors
export interface SupabaseUser {
  id: string;
  email?: string;
  app_metadata: any;
  user_metadata: any;
  aud: string;
  created_at: string;
}
