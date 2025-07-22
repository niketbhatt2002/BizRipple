"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

const COLORS = [
  "#10b981", // emerald
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#db2777", // pink
  "#14b8a6", // teal
  "#f97316", // orange
  "#6366f1", // indigo
  "#e11d48", // rose
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 shadow-xl">
        <p className="text-slate-300 text-sm mb-2">{`Year: ${label}`}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-white text-sm font-medium">
              {entry.name}: {entry.value?.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function PolicyImpactChart({ data, loading }) {
  // Process data for recharts
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Group by year
    const yearsMap = {};

    data.forEach(({ year, policy_typr, average_impact }) => {
      if (!yearsMap[year]) yearsMap[year] = { year };
      yearsMap[year][policy_typr] = average_impact;
    });

    // Convert to array sorted by year ascending
    return Object.values(yearsMap).sort((a, b) => a.year - b.year);
  }, [data]);

  // Extract unique policy types to create multiple Line components
  const policyTypes = useMemo(() => {
    if (!data || data.length === 0) return [];
    const set = new Set(data.map((d) => d.policy_typr));
    return Array.from(set);
  }, [data]);

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">
            Loading policy impact data...
          </p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0 || processedData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-400 text-lg font-medium">
            No policy impact data available
          </p>
          <p className="text-slate-500 text-sm mt-1">
            Try adjusting your filters to see results
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 5, bottom: 5 }}
        >
          <defs>
            {policyTypes.map((_, index) => (
              <linearGradient
                key={`gradient-${index}`}
                id={`gradient-${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={COLORS[index % COLORS.length]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor={COLORS[index % COLORS.length]}
                  stopOpacity={0.3}
                />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#374151"
            strokeOpacity={0.3}
          />

          <XAxis
            dataKey="year"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={{ stroke: "#475569" }}
            tickLine={{ stroke: "#475569" }}
            label={{
              value: "Year",
              position: "insideBottom",
              offset: -5,
              style: {
                textAnchor: "middle",
                fill: "#94a3b8",
                fontSize: "14px",
              },
            }}
          />

          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={{ stroke: "#475569" }}
            tickLine={{ stroke: "#475569" }}
            tickFormatter={(value) => value.toFixed(1)}
            label={{
              value: "Impact Score",
              angle: -90,
              position: "insideLeft",
              style: {
                textAnchor: "middle",
                fill: "#94a3b8",
                fontSize: "14px",
              },
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{ color: "#94a3b8", paddingTop: "15px" }}
            iconType="line"
            // verticalAlign="bottom"
          />

          {policyTypes.map((policyType, i) => (
            <Line
              key={policyType}
              type="monotone"
              dataKey={policyType}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={3}
              name={policyType}
              dot={{
                fill: COLORS[i % COLORS.length],
                strokeWidth: 2,
                r: 4,
                stroke: "#ffffff",
              }}
              activeDot={{
                r: 6,
                fill: COLORS[i % COLORS.length],
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
