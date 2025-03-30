"use client"

import * as React from "react"
import { format } from "date-fns"
import { Plus, Minus, Scale } from "lucide-react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/components/ui/drawer"
import { Button } from "@/app/components/ui/button"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { WeightEntry, WeightFormData } from "@/app/lib/types"

interface WeightDrawerProps {
  onSubmit: (data: WeightFormData) => Promise<void>
  entries: WeightEntry[]
  initialData?: {
    weight: number
    date: Date
  }
  isEdit?: boolean
  open?: boolean
  setOpen?: (open: boolean) => void
}

export function WeightDrawer({ 
  onSubmit, 
  entries, 
  initialData,
  isEdit = false,
  open,
  setOpen
}: WeightDrawerProps) {
  // Get initial weight from most recent entry or use default
  const getInitialWeight = (): number => {
    if (initialData?.weight) return initialData.weight;
    
    if (entries.length > 0) {
      // Sort entries by date (newest first) and take the most recent weight
      const sortedEntries = [...entries].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      return sortedEntries[0].weight;
    }
    
    return 70; // Default fallback
  };

  const [internalOpen, setInternalOpen] = React.useState(false)
  const [weight, setWeight] = React.useState(getInitialWeight)
  const [weightInput, setWeightInput] = React.useState(getInitialWeight().toString())
  const [date, setDate] = React.useState<Date>(initialData?.date || new Date())
  const [submitting, setSubmitting] = React.useState(false)
  const [existingEntryDate, setExistingEntryDate] = React.useState<Date | null>(null)
  const [existingEntryWeight, setExistingEntryWeight] = React.useState<number | null>(null)

  // Use either external or internal open state
  const isOpen = open !== undefined ? open : internalOpen
  const setIsOpen = setOpen || setInternalOpen

  // Step adjustment for weight
  const step = 0.1
  
  // Weight has min/max boundary
  const minWeight = 20
  const maxWeight = 300

  // Handle weight changes with steps
  function onWeightChange(adjustment: number) {
    const newWeight = Math.max(minWeight, Math.min(maxWeight, Number((weight + adjustment).toFixed(1))))
    setWeight(newWeight)
    setWeightInput(newWeight.toString())
  }
  
  // Direct weight input handling
  function handleWeightInput(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value
    setWeightInput(inputValue)
    
    // Only update actual weight if input is a valid number
    if (inputValue && !isNaN(parseFloat(inputValue))) {
      const numValue = parseFloat(inputValue)
      // Only enforce min/max on blur, not during typing
      if (numValue >= minWeight && numValue <= maxWeight) {
        setWeight(numValue)
      }
    }
  }
  
  // Handle input blur to enforce min/max limits
  function handleInputBlur() {
    if (weightInput === '' || isNaN(parseFloat(weightInput))) {
      // If empty or invalid, reset to previous valid weight
      setWeightInput(weight.toString())
      return
    }
    
    let numValue = parseFloat(weightInput)
    
    // Enforce boundaries on blur
    if (numValue < minWeight) {
      numValue = minWeight
    } else if (numValue > maxWeight) {
      numValue = maxWeight
    }
    
    // Update both the weight and displayed input value
    setWeight(numValue)
    setWeightInput(numValue.toString())
  }

  // Check if current date already has an entry
  React.useEffect(() => {
    const formattedDate = format(date, "yyyy-MM-dd")
    const existingEntry = entries.find(entry => entry.date === formattedDate)
    
    if (existingEntry && !isEdit) {
      setExistingEntryDate(date)
      setExistingEntryWeight(existingEntry.weight)
    } else {
      setExistingEntryDate(null)
      setExistingEntryWeight(null)
    }
  }, [date, entries, isEdit])

  // Handle form submission
  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await onSubmit({ weight, date })
      setIsOpen(false)
    } catch (error) {
      console.error("Error submitting weight:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      {/* Only render trigger if not using external control */}
      {open === undefined && (
        <DrawerTrigger asChild>
          {isEdit ? (
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
              <Scale className="h-4 w-4" />
              <span className="sr-only">Edit weight</span>
            </Button>
          ) : (
            <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg">
              <Plus className="h-6 w-6 text-white" />
              <span className="sr-only">Add weight</span>
            </Button>
          )}
        </DrawerTrigger>
      )}
      <DrawerContent className="rounded-t-2xl border-t-0 bg-white">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-xl font-bold text-gray-900">
              {isEdit ? "Update Weight" : "Add Weight"}
            </DrawerTitle>
            <DrawerDescription className="text-gray-600">
              {isEdit 
                ? "Update your weight measurement."
                : "Record your weight measurement."
              }
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 pb-2">
            <div className="flex flex-col items-center justify-center space-y-5 pt-2">
              <div className="flex w-full items-center justify-between space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-2 border-gray-200 shadow-sm"
                  onClick={() => onWeightChange(-step)}
                  disabled={weight <= minWeight}
                  aria-label="Decrease weight"
                >
                  <Minus className="h-5 w-5 text-gray-700" />
                </Button>
                
                <div className="relative flex-1">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={weightInput}
                    onChange={handleWeightInput}
                    onBlur={handleInputBlur}
                    aria-label="Weight in kilograms"
                    className="h-16 w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 text-center text-5xl font-bold text-gray-900 shadow-inner focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  
                  <div className="mt-1 text-center text-sm font-medium uppercase tracking-wide text-gray-500">
                    Kilograms
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-2 border-gray-200 shadow-sm"
                  onClick={() => onWeightChange(step)}
                  disabled={weight >= maxWeight}
                  aria-label="Increase weight"
                >
                  <Plus className="h-5 w-5 text-gray-700" />
                </Button>
              </div>
              
              <div className="w-full">
                <label htmlFor="weight-date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <DatePicker
                  id="weight-date"
                  selected={date}
                  onChange={(date) => setDate(date || new Date())}
                  maxDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  aria-label="Select date"
                />
              </div>
            </div>
            
            {existingEntryDate && existingEntryWeight && (
              <div className="mt-4 rounded-lg bg-orange-50 p-3 text-sm text-orange-700">
                <p>
                  Note: You already have an entry for {format(existingEntryDate, "MMMM d, yyyy")} 
                  with weight {existingEntryWeight} kg. This entry will be updated.
                </p>
              </div>
            )}
          </div>
          
          <DrawerFooter className="pt-2">
            <Button 
              onClick={handleSubmit} 
              disabled={submitting}
              className="h-12 w-full rounded-xl bg-primary-500 font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
            >
              {submitting ? "Saving..." : isEdit ? "Update" : "Save"}
            </Button>
            <DrawerClose asChild>
              <Button 
                variant="outline" 
                className="h-12 w-full rounded-xl border-2 border-gray-200 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
              >
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
