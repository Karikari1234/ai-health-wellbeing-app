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

    // Sort entries by date (newest first)
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Sort entries by date (oldest first)
    const chronologicalEntries = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Current weight (most recent)
    const currentWeight = sortedEntries[0].weight;

    // Calculate change in the last month using averages
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    const entriesLastMonth = sortedEntries.filter(
      (entry) => new Date(entry.date) >= oneMonthAgo
    );
    
    // Find entries from the two-week period one month ago
    const twoWeekPeriodOneMonthAgo = entriesLastMonth.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= oneMonthAgo && entryDate <= new Date(oneMonthAgo.getTime() + 14 * 24 * 60 * 60 * 1000);
    });
    
    // Find entries from the most recent two-week period
    const recentTwoWeekPeriod = entriesLastMonth.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
    });

    let changeLastMonth = null;
    if (twoWeekPeriodOneMonthAgo.length > 0 && recentTwoWeekPeriod.length > 0) {
      // Calculate average for each period
      const avgOneMonthAgo = twoWeekPeriodOneMonthAgo.reduce((sum, entry) => sum + entry.weight, 0) / 
                             twoWeekPeriodOneMonthAgo.length;
      const avgRecent = recentTwoWeekPeriod.reduce((sum, entry) => sum + entry.weight, 0) / 
                       recentTwoWeekPeriod.length;
      
      changeLastMonth = avgRecent - avgOneMonthAgo;
    } else if (entriesLastMonth.length >= 2) {
      // Fall back to simple first vs last if not enough data for two periods
      changeLastMonth = recentTwoWeekPeriod.length > 0 ? recentTwoWeekPeriod[0].weight : sortedEntries[0].weight;
      const oldestInRange = twoWeekPeriodOneMonthAgo.length > 0 ? 
          twoWeekPeriodOneMonthAgo[twoWeekPeriodOneMonthAgo.length - 1].weight : 
          entriesLastMonth[entriesLastMonth.length - 1].weight;
      
      changeLastMonth = changeLastMonth - oldestInRange;
    }

    // Calculate total change (current vs either 3 months ago or earliest entry)
    let totalChange = null;
    const entriesThreeMonthsAgo = chronologicalEntries.filter(
      (entry) => new Date(entry.date) <= threeMonthsAgo
    );
    
    if (entriesThreeMonthsAgo.length > 0) {
      // If we have entries from 3+ months ago, use the most recent from that period
      const threeMonthAgoWeight = entriesThreeMonthsAgo[entriesThreeMonthsAgo.length - 1].weight;
      totalChange = currentWeight - threeMonthAgoWeight;
    } else {
      // Otherwise use earliest recorded weight
      const firstEntry = chronologicalEntries[0];
      totalChange = currentWeight - firstEntry.weight;
    }

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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="stat-card">
        <p className="text-sm text-gray-500 font-karla">
          Current Weight
        </p>
        <p className="text-2xl font-bold mt-1 font-merriweather">
          {stats.currentWeight?.toFixed(1)} kg
        </p>
      </div>

      <div className="stat-card">
        <p className="text-sm text-gray-500 font-karla">
          30-Day Avg Change
        </p>
        <p
          className={`text-2xl font-bold mt-1 font-merriweather ${
            stats.changeLastMonth !== null
              ? stats.changeLastMonth > 0
                ? "text-red-600"
                : stats.changeLastMonth < 0
                ? "text-green-500"
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

      <div className="stat-card">
        <p className="text-sm text-gray-500 font-karla">Total Change</p>
        <p
          className={`text-2xl font-bold mt-1 font-merriweather ${
            stats.totalChange !== null
              ? stats.totalChange > 0
                ? "text-red-600"
                : stats.totalChange < 0
                ? "text-green-500"
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

      <div className="stat-card">
        <p className="text-sm text-gray-500 font-karla">
          Average Weight
        </p>
        <p className="text-2xl font-bold mt-1 font-merriweather">
          {stats.avgWeight?.toFixed(1)} kg
        </p>
      </div>
    </div>
  );
}
