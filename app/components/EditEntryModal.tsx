"use client";

import { WeightEntry, WeightFormData } from "../lib/types";
import WeightForm from "./WeightForm";
import { parseISO } from "date-fns";

interface EditEntryModalProps {
  entry: WeightEntry | null;
  onClose: () => void;
  onSubmit: (id: string, data: WeightFormData) => Promise<void>;
}

export default function EditEntryModal({
  entry,
  onClose,
  onSubmit,
}: EditEntryModalProps) {
  if (!entry) return null;

  const handleSubmit = async (data: WeightFormData) => {
    await onSubmit(entry.id, data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-lg w-full">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Edit Weight Entry</h2>
        </div>

        <div className="p-6">
          <WeightForm
            onSubmit={handleSubmit}
            initialData={{
              weight: entry.weight,
              date: parseISO(entry.date),
            }}
            buttonText="Update Entry"
          />

          <button
            onClick={onClose}
            className="mt-4 w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
