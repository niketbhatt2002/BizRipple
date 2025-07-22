"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 shadow-xl">
        <p className="text-white font-medium mb-2">{`Year: ${label}`}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <p className="text-slate-300">
                {entry.name}:{" "}
                <span className="font-semibold" style={{ color: entry.color }}>
                  {entry.value}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Custom legend component
const CustomLegend = ({ payload }) => {
  return (
    <div className="flex items-center justify-center gap-6 mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="text-slate-300 text-sm font-medium">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export function OpenCloseChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-slate-600 border-t-green-400 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-400">Loading trend data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80 relative">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="openedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="closedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#f87171" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />

          <XAxis
            dataKey="year"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={{ stroke: "#475569" }}
            tickLine={{ stroke: "#475569" }}
            label={{
              value: "Year",
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
              value: "Business Unit Count",
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

          <Legend content={<CustomLegend />} />

          <Line
            type="monotone"
            dataKey="opened"
            stroke="#10b981"
            strokeWidth={3}
            dot={{
              fill: "#10b981",
              strokeWidth: 2,
              stroke: "#065f46",
              r: 5,
            }}
            activeDot={{
              r: 7,
              fill: "#10b981",
              stroke: "#065f46",
              strokeWidth: 2,
              filter: "drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))",
            }}
            name="Opened"
          />

          <Line
            type="monotone"
            dataKey="closed"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{
              fill: "#ef4444",
              strokeWidth: 2,
              stroke: "#991b1b",
              r: 5,
            }}
            activeDot={{
              r: 7,
              fill: "#ef4444",
              stroke: "#991b1b",
              strokeWidth: 2,
              filter: "drop-shadow(0 0 6px rgba(239, 68, 68, 0.4))",
            }}
            name="Closed"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 via-transparent to-red-500/5 pointer-events-none rounded-lg"></div>
    </div>
  );
}