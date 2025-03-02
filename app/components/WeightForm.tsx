"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller } from "react-hook-form";
import { WeightFormData } from "../lib/types";

interface WeightFormProps {
  onSubmit: (data: WeightFormData) => Promise<void>;
  initialData?: {
    weight: number;
    date: Date;
  };
  buttonText?: string;
}

export default function WeightForm({
  onSubmit,
  initialData,
  buttonText = "Submit",
}: WeightFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="weight" className="block text-sm font-medium mb-1">
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
          className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 rounded-md"
          placeholder="Enter your weight"
        />
        {errors.weight && (
          <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
        )}
      </div>

      <div className="datepicker-container">
        <label htmlFor="date" className="block text-sm font-medium mb-1">
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
              className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 rounded-md"
            />
          )}
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent-500 hover:bg-accent-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : buttonText}
      </button>
    </form>
  );
}
