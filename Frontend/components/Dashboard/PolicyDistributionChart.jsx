"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Shield } from "lucide-react";

const COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#f97316", // orange
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 shadow-xl">
        <p className="text-white font-medium">{payload[0].name}</p>
        <p className="text-blue-400">
          Count: <span className="font-semibold">{payload[0].value}</span>
        </p>
        <p className="text-slate-400 text-sm">
          {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}% of
          total
        </p>
      </div>
    );
  }
  return null;
};

// Custom legend component
const CustomLegend = ({ payload }) => {
  if (!payload) return null;

  return (
    <div className="flex flex-wrap gap-3 justify-center mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-slate-300">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export function PolicyDistributionChart({ data, loading }) {
  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">
            Loading policy distribution...
          </p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-400 text-lg font-medium">
            No policy data available
          </p>
          <p className="text-slate-500 text-sm mt-1">
            Try adjusting your filters to see results
          </p>
        </div>
      </div>
    );
  }

  // Calculate total for percentage calculations
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const dataWithTotal = data.map((item) => ({ ...item, total }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithTotal}
            dataKey="count"
            nameKey="policy_type"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={30}
            paddingAngle={2}
            labelLine={false}
            label={({ percent, cx, cy, midAngle, outerRadius }) => {
              const RADIAN = Math.PI / 180;
              const radius = outerRadius * 0.7;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              return percent > 0.05 ? (
                <text
                  x={x}
                  y={y}
                  fill="white"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11}
                  fontWeight="500"
                  className="drop-shadow-lg"
                >
                  {(percent * 100).toFixed(0)}%
                </text>
              ) : null;
            }}
          >
            {dataWithTotal.map((_, i) => (
              <Cell
                key={`cell-${i}`}
                fill={COLORS[i % COLORS.length]}
                className="hover:opacity-80 transition-opacity duration-200"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
