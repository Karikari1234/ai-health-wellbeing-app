"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { format, parseISO } from "date-fns";
import { WeightEntry } from "../lib/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeightChartProps {
  entries: WeightEntry[];
}

export default function WeightChart({ entries }: WeightChartProps) {
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: "Weight (kg)",
        data: [] as number[],
        borderColor: "rgb(14, 165, 233)",
        backgroundColor: "rgba(14, 165, 233, 0.5)",
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    if (!entries.length) return;

    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const labels = sortedEntries.map((entry) =>
      format(parseISO(entry.date), "MMM d")
    );

    const weights = sortedEntries.map((entry) => entry.weight);

    setChartData({
      labels,
      datasets: [
        {
          label: "Weight (kg)",
          data: weights,
          borderColor: "rgb(14, 165, 233)",
          backgroundColor: "rgba(14, 165, 233, 0.5)",
          tension: 0.4,
        },
      ],
    });
  }, [entries]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        min: Math.min(...entries.map((e) => e.weight)) * 0.95 || 0,
        ticks: {
          precision: 1,
        },
      },
    },
  };

  if (!entries.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-800">
        <p className="text-gray-500 dark:text-gray-400">No data to display</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Add weight entries to see your progress
        </p>
      </div>
    );
  }

  return (
    <div className="h-64 md:h-80">
      <Line options={options} data={chartData} />
    </div>
  );
}
