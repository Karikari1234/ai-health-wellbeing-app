"use client";

import { WeightEntry, WeightFormData } from "../lib/types";
import WeightForm from "./WeightForm";
import { parseISO, format } from "date-fns";

interface EditEntryModalProps {
  entry: WeightEntry | null;
  onClose: () => void;
  onSubmit: (id: string, data: WeightFormData) => Promise<void>;
  entries: WeightEntry[];
}

export default function EditEntryModal({
  entry,
  onClose,
  onSubmit,
  entries,
}: EditEntryModalProps) {
  if (!entry) return null;

  const handleSubmit = async (data: WeightFormData) => {
    if (!entry) return;
    
    // Check if the date is changed and there's already an entry for the new date
    const formattedNewDate = format(data.date, "yyyy-MM-dd");
    const formattedCurrentDate = entry.date;
    
    if (formattedNewDate !== formattedCurrentDate) {
      // Date has changed - check if there's an existing entry for the new date
      const existingEntry = entries.find(e => 
        e.date === formattedNewDate && e.id !== entry.id
      );
      
      if (existingEntry) {
        // Ask for confirmation to overwrite
        if (!confirm(
          `There's already an entry for ${format(data.date, "MMMM d, yyyy")} ` +
          `with weight ${existingEntry.weight} kg. Do you want to overwrite it?`
        )) {
          return; // User canceled the operation
        }
        
        // User confirmed, so delete the existing entry for that date and update this one
        await onSubmit(entry.id, data);
      } else {
        // No conflict, just update
        await onSubmit(entry.id, data);
      }
    } else {
      // Date hasn't changed, just update the entry
      await onSubmit(entry.id, data);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-medium font-karla text-gray-800">Edit Weight Entry</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <WeightForm
            onSubmit={handleSubmit}
            initialData={{
              weight: entry.weight,
              date: parseISO(entry.date),
            }}
            buttonText="Update Entry"
            entries={entries.filter(e => e.id !== entry.id)} // Exclude current entry
          />
        </div>
      </div>
    </div>
  );
}
