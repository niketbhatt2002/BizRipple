"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 shadow-xl">
        <p className="text-white font-medium mb-2">{`City: ${label}`}</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          <p className="text-slate-300">
            Footfall:{" "}
            <span className="text-blue-400 font-semibold">
              {payload[0].value.toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function FootfallChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-400">Loading footfall data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80 relative">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="footfallGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />

          <XAxis
            dataKey="city"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={{ stroke: "#475569" }}
            tickLine={{ stroke: "#475569" }}
            label={{
              value: "City",
              position: "insideBottom",
              offset: -10,
              style: {
                textAnchor: "middle",
                fill: "#94a3b8",
                fontSize: "16px",
                fontWeight: "bold",
              },
            }}
          />

          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={{ stroke: "#475569" }}
            tickLine={{ stroke: "#475569" }}
            label={{
              value: "Average Footfall",
              angle: -90,
              position: "insideLeft",
              style: {
                textAnchor: "middle",
                fill: "#94a3b8",
                fontSize: "16px",
                fontWeight: "bold",
              },
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey="footfall"
            fill="url(#footfallGradient)"
            radius={[4, 4, 0, 0]}
            stroke="#3b82f6"
            strokeWidth={1}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none rounded-lg"></div>
    </div>
  );
}