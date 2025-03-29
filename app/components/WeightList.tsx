"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { format, parseISO } from "date-fns";
import { WeightEntry } from "../lib/types";

interface WeightListProps {
  entries: WeightEntry[];
  onDelete: (id: string) => Promise<void>;
  onEdit: (entry: WeightEntry) => void;
  onLoadMore?: () => Promise<void>;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export default function WeightList({
  entries,
  onDelete,
  onEdit,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false
}: WeightListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  
  // Sort entries by date (most recent first)
  const sortedEntries = entries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Setup intersection observer for infinite scrolling
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target && target.isIntersecting && hasMore && !isLoadingMore && onLoadMore) {
        onLoadMore();
      }
    },
    [hasMore, isLoadingMore, onLoadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, { 
      threshold: 0.1, 
      rootMargin: '100px' 
    });
    
    const currentLoaderRef = loaderRef.current;
    
    if (currentLoaderRef && hasMore) {
      observer.observe(currentLoaderRef);
    }
    
    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef);
      }
    };
  }, [observerCallback, hasMore]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (!entries.length) {
    return (
      <div className="text-center p-6 border border-gray-100 rounded-xl bg-gray-50">
        <p className="text-gray-500 font-karla">No entries yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 rounded-xl overflow-hidden bg-white">
      {sortedEntries.map((entry) => (
        <div key={entry.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium font-merriweather text-gray-800">
                {format(parseISO(entry.date), "MMMM d, yyyy")}
              </p>
              <p className="text-gray-600 font-karla mt-1">
                {entry.weight.toFixed(1)} kg
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => onEdit(entry)}
                className="p-2 text-gray-400 hover:text-primary-500 transition-colors rounded-full hover:bg-gray-100"
                aria-label="Edit entry"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(entry.id)}
                disabled={deletingId === entry.id}
                className="p-2 text-gray-400 hover:text-primary-500 transition-colors rounded-full hover:bg-gray-100 disabled:opacity-50"
                aria-label="Delete entry"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {hasMore && (
        <div 
          ref={loaderRef} 
          className="p-4 text-center text-gray-400"
        >
          {isLoadingMore ? (
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          ) : (
            <p className="text-sm text-gray-400">Scroll for more entries</p>
          )}
        </div>
      )}
    </div>
  );
}
