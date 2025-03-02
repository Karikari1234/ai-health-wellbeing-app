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
