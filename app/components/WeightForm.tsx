"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller } from "react-hook-form";
import { WeightFormData, WeightEntry } from "../lib/types";
import { format } from "date-fns";

interface WeightFormProps {
  onSubmit: (data: WeightFormData) => Promise<void>;
  initialData?: {
    weight: number;
    date: Date;
  };
  buttonText?: string;
  entries?: WeightEntry[];
}

export default function WeightForm({
  onSubmit,
  initialData,
  buttonText = "Submit",
  entries = [],
}: WeightFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingEntryDate, setExistingEntryDate] = useState<Date | null>(null);
  const [existingEntryWeight, setExistingEntryWeight] = useState<number | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WeightFormData>({
    defaultValues: initialData || {
      weight: undefined,
      date: new Date(),
    },
  });

  const onFormSubmit = async (data: WeightFormData) => {
    setIsSubmitting(true);
    try {
      // Check if the date already has an entry
      const formattedDate = format(data.date, "yyyy-MM-dd");
      const existingEntry = entries.find(entry => entry.date === formattedDate);
      
      if (existingEntry) {
        setExistingEntryDate(data.date);
        setExistingEntryWeight(existingEntry.weight);
      } else {
        setExistingEntryDate(null);
        setExistingEntryWeight(null);
      }
      
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
      <div>
        <label htmlFor="weight" className="block text-sm font-medium mb-2 font-karla text-gray-700">
          Weight (kg)
        </label>
        <input
          id="weight"
          type="number"
          step="0.1"
          {...register("weight", {
            required: "Weight is required",
            min: { value: 20, message: "Weight must be at least 20kg" },
            max: { value: 300, message: "Weight must be less than 300kg" },
          })}
          className="w-full p-3 border border-gray-200 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter your weight"
        />
        {errors.weight && (
          <p className="mt-1 text-sm text-primary-500">{errors.weight.message}</p>
        )}
      </div>

      <div className="datepicker-container">
        <label htmlFor="date" className="block text-sm font-medium mb-2 font-karla text-gray-700">
          Date
        </label>
        <Controller
          control={control}
          name="date"
          rules={{ required: "Date is required" }}
          render={({ field }) => (
            <DatePicker
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              maxDate={new Date()}
              dateFormat="MMMM d, yyyy"
              className="w-full p-3 border border-gray-200 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          )}
        />
        {errors.date && (
          <p className="mt-1 text-sm text-primary-500">{errors.date.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full app-button mt-4"
      >
        {isSubmitting ? "Submitting..." : buttonText}
      </button>
      
      {existingEntryDate && existingEntryWeight && (
        <div className="mt-3 text-sm text-orange-500 text-center">
          <p>Note: You already have an entry for {format(existingEntryDate, "MMMM d, yyyy")} 
          with weight {existingEntryWeight} kg. This entry will be updated.</p>
        </div>
      )}
    </form>
  );
}
