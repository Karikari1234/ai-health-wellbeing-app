import { supabase } from "./supabase";
import { WeightEntry, WeightFormData } from "./types";
import { format } from "date-fns";

export async function getWeightEntries(userId: string) {
  const { data, error } = await supabase
    .from("weight_entries")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching weight entries:", error);
    return [];
  }

  return data as WeightEntry[];
}

export async function addWeightEntry(entry: WeightFormData, userId: string) {
  const formattedDate = format(entry.date, "yyyy-MM-dd");

  const { data, error } = await supabase
    .from("weight_entries")
    .insert([
      {
        weight: entry.weight,
        date: formattedDate,
        user_id: userId,
      },
    ])
    .select();

  if (error) {
    console.error("Error adding weight entry:", error);
    throw error;
  }

  return data[0] as WeightEntry;
}

export async function updateWeightEntry(id: string, entry: WeightFormData) {
  const formattedDate = format(entry.date, "yyyy-MM-dd");

  const { data, error } = await supabase
    .from("weight_entries")
    .update({
      weight: entry.weight,
      date: formattedDate,
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating weight entry:", error);
    throw error;
  }

  return data[0] as WeightEntry;
}

export async function deleteWeightEntry(id: string) {
  const { error } = await supabase.from("weight_entries").delete().eq("id", id);

  if (error) {
    console.error("Error deleting weight entry:", error);
    throw error;
  }

  return true;
}
