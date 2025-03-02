"use client";

import { WeightEntry } from "../lib/types";
import { useMemo } from "react";

interface StatsProps {
  entries: WeightEntry[];
}

export default function Stats({ entries }: StatsProps) {
  const stats = useMemo(() => {
    if (!entries.length) {
      return {
        currentWeight: null,
        changeLastMonth: null,
        totalChange: null,
        avgWeight: null,
      };
    }

    // Sort entries by date
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Current weight (most recent)
    const currentWeight = sortedEntries[0].weight;

    // Calculate change in the last month
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const entriesLastMonth = sortedEntries.filter(
      (entry) => new Date(entry.date) >= oneMonthAgo
    );

    let changeLastMonth = null;
    if (entriesLastMonth.length >= 2) {
      changeLastMonth =
        entriesLastMonth[0].weight -
        entriesLastMonth[entriesLastMonth.length - 1].weight;
    }

    // Total change (current - first ever)
    const firstEntry = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )[0];

    const totalChange = currentWeight - firstEntry.weight;

    // Average weight
    const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
    const avgWeight = totalWeight / entries.length;

    return {
      currentWeight,
      changeLastMonth,
      totalChange,
      avgWeight,
    };
  }, [entries]);

  if (!entries.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Current Weight
        </p>
        <p className="text-xl font-bold mt-1">
          {stats.currentWeight?.toFixed(1)} kg
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          30-Day Change
        </p>
        <p
          className={`text-xl font-bold mt-1 ${
            stats.changeLastMonth !== null
              ? stats.changeLastMonth > 0
                ? "text-red-600"
                : stats.changeLastMonth < 0
                ? "text-green-600"
                : ""
              : ""
          }`}
        >
          {stats.changeLastMonth !== null
            ? `${
                stats.changeLastMonth > 0 ? "+" : ""
              }${stats.changeLastMonth.toFixed(1)} kg`
            : "N/A"}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Change</p>
        <p
          className={`text-xl font-bold mt-1 ${
            stats.totalChange !== null
              ? stats.totalChange > 0
                ? "text-red-600"
                : stats.totalChange < 0
                ? "text-green-600"
                : ""
              : ""
          }`}
        >
          {stats.totalChange !== null
            ? `${stats.totalChange > 0 ? "+" : ""}${stats.totalChange.toFixed(
                1
              )} kg`
            : "N/A"}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Average Weight
        </p>
        <p className="text-xl font-bold mt-1">
          {stats.avgWeight?.toFixed(1)} kg
        </p>
      </div>
    </div>
  );
}
