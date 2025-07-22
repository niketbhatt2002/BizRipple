"use client";

import {
  ComposedChart,
  Bar,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Create a map to deduplicate by dataKey
    const uniqueData = {};
    payload.forEach((entry) => {
      if (!uniqueData[entry.dataKey]) {
        uniqueData[entry.dataKey] = entry;
      }
    });

    return (
      <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 shadow-xl">
        <p className="text-white font-medium mb-2">{`City: ${label}`}</p>
        {Object.values(uniqueData).map((entry, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <p className="text-slate-300 text-sm">
              {formatName(entry.dataKey)}:{" "}
              <span className="text-emerald-400 font-semibold">
                ${entry.value?.toLocaleString()}
              </span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Helper to format keys into readable names
const formatName = (key) => {
  switch (key) {
    case "averageRevenue":
      return "Average Revenue";
    case "minRevenue":
      return "Min Revenue";
    case "maxRevenue":
      return "Max Revenue";
    default:
      return key;
  }
};


const CustomLegend = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-500"></div>
        <span className="text-slate-300 text-sm font-medium">
          Average Revenue
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-orange-400"></div>
        <span className="text-slate-300 text-sm font-medium">Min Revenue</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-sky-400"></div>
        <span className="text-slate-300 text-sm font-medium">Max Revenue</span>
      </div>
    </div>
  );
};

export function RevenueChart({ data }) {
  
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-slate-600 border-t-emerald-400 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-400">Loading revenue data...</p>
        </div>
      </div>
    );
  }

  const chartData = data?.map((item) => ({
    city: item.city,
    averageRevenue: item.average_revenue,
    minRevenue: item.min_revenue,
    maxRevenue: item.max_revenue,
  }));

  return (
    <div className="h-[450px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#047857" stopOpacity={0.8} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />

          <XAxis
            dataKey="city"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={100}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={{ stroke: "#475569" }}
            tickLine={{ stroke: "#475569" }}
            label={{
              value: "City",
              position: "insideBottom",
              style: { textAnchor: "middle", fill: "#94a3b8" },
            }}
          />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={{ stroke: "#475569" }}
            tickLine={{ stroke: "#475569" }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            label={{
              value: "Revenue ($)",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "#94a3b8" },
            }}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />

          {/* Bar for Average Revenue */}
          <Bar
            dataKey="averageRevenue"
            name="Average Revenue"
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
            stroke="#10b981"
            strokeWidth={1}
          />

          <Line
            type="monotone"
            dataKey="minRevenue"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="maxRevenue"
            stroke="#38bdf8"
            strokeWidth={2}
            dot={false}
          />

          {/* Scatter dots for Min and Max Revenue */}
          <Scatter dataKey="minRevenue" fill="#f97316" shape="circle" />
          <Scatter dataKey="maxRevenue" fill="#38bdf8" shape="circle" />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none rounded-lg"></div>
    </div>
  );
}
