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
          />
        </div>
      </div>
    </div>
  );
}
