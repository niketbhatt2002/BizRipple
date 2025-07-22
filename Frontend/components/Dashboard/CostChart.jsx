"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Home,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
} from "lucide-react";

const RENT_COLORS = ["#ef4444", "#22c55e"]; // red for min, green for max
const UTILITY_COLORS = ["#f59e0b", "#3b82f6"]; // amber for min, blue for max

export function CostChart({ data, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-96">
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm">
              Loading cost distribution...
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm">
              Loading utility distribution...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (
    !data ||
    (!data.min_rent && !data.max_rent && !data.min_utility && !data.max_utility)
  ) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-96">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Home className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-400 text-lg font-medium">
              No rent data available
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Try adjusting your filters
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-400 text-lg font-medium">
              No utility data available
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Try adjusting your filters
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Rent distribution data (min vs max)
  const rentData = [
    { name: "Minimum Rent", value: data.min_rent || 0, color: RENT_COLORS[0] },
    { name: "Maximum Rent", value: data.max_rent || 0, color: RENT_COLORS[1] },
  ];

  // Utility distribution data (min vs max)
  const utilityData = [
    {
      name: "Minimum Utility",
      value: data.min_utility || 0,
      color: UTILITY_COLORS[0],
    },
    {
      name: "Maximum Utility",
      value: data.max_utility || 0,
      color: UTILITY_COLORS[1],
    },
  ];

  const totalRent = rentData.reduce((sum, item) => sum + item.value, 0);
  const totalUtility = utilityData.reduce((sum, item) => sum + item.value, 0);

  // Calculate business insights
  const rentVariance = (
    ((data.max_rent - data.min_rent) / data.min_rent) *
    100
  ).toFixed(1);
  const utilityVariance = (
    ((data.max_utility - data.min_utility) / data.min_utility) *
    100
  ).toFixed(1);
  const rentRange = data.max_rent - data.min_rent;
  const utilityRange = data.max_utility - data.min_utility;

  // Custom tooltip components
  const RentTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage =
        totalRent > 0 ? ((data.value / totalRent) * 100).toFixed(1) : 0;
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 shadow-xl">
          <p className="text-slate-300 text-sm mb-1">{data.name}</p>
          <p className="text-white font-semibold">
            ${data.value.toFixed(2)} /m²
          </p>
          <p className="text-blue-400 text-sm">{percentage}% of range</p>
        </div>
      );
    }
    return null;
  };

  const UtilityTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage =
        totalUtility > 0 ? ((data.value / totalUtility) * 100).toFixed(1) : 0;
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 shadow-xl">
          <p className="text-slate-300 text-sm mb-1">{data.name}</p>
          <p className="text-white font-semibold">
            ${data.value.toLocaleString()} /year
          </p>
          <p className="text-blue-400 text-sm">{percentage}% of range</p>
        </div>
      );
    }
    return null;
  };

  // Custom label function
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-8">
      {/* Business Insights Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-sm font-medium text-slate-300">
              Rent Variance
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{rentVariance}%</p>
          <p className="text-xs text-slate-400">Price volatility</p>
        </div>

        <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-medium text-slate-300">
              Utility Variance
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{utilityVariance}%</p>
          <p className="text-xs text-slate-400">Cost fluctuation</p>
        </div>

        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">
              Rent Range
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${rentRange.toFixed(2)}
          </p>
          <p className="text-xs text-slate-400">Per m² difference</p>
        </div>

        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium text-slate-300">
              Utility Range
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${utilityRange.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400">Annual difference</p>
        </div>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rent Distribution Chart */}
        <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/50">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Home className="w-5 h-5 text-red-400" />
              Rent Price Distribution
            </h3>
            <p className="text-sm text-slate-400">
              Min vs Max rent per m² (CAD)
            </p>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient
                    id="minRentGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient
                    id="maxRentGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <Pie
                  data={rentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#1e293b"
                  strokeWidth={2}
                >
                  {rentData.map((entry, index) => (
                    <Cell
                      key={`rent-cell-${index}`}
                      fill={
                        index === 0
                          ? "url(#minRentGradient)"
                          : "url(#maxRentGradient)"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip content={<RentTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ color: "#94a3b8", paddingTop: "20px" }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Utility Distribution Chart */}
        <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/50">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Utility Cost Distribution
            </h3>
            <p className="text-sm text-slate-400">
              Min vs Max yearly utility cost (CAD)
            </p>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient
                    id="minUtilityGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#d97706" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient
                    id="maxUtilityGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <Pie
                  data={utilityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#1e293b"
                  strokeWidth={2}
                >
                  {utilityData.map((entry, index) => (
                    <Cell
                      key={`utility-cell-${index}`}
                      fill={
                        index === 0
                          ? "url(#minUtilityGradient)"
                          : "url(#maxUtilityGradient)"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip content={<UtilityTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ color: "#94a3b8", paddingTop: "20px" }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Business Insights Panel */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-lg p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Business Insights & Recommendations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
              <h4 className="text-sm font-semibold text-blue-400 mb-2">
                💡 Rent Analysis
              </h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>
                  • {rentVariance}% variance indicates{" "}
                  {rentVariance > 50
                    ? "high"
                    : rentVariance > 25
                    ? "moderate"
                    : "low"}{" "}
                  price volatility
                </li>
                <li>
                  • ${rentRange.toFixed(2)}/m² difference between min-max
                  locations
                </li>
                <li>
                  • Consider{" "}
                  {data.min_rent < 30 ? "budget-friendly" : "premium"} locations
                  for cost optimization
                </li>
                <li>
                  • Average rent (${data.average_rent?.toFixed(2)}/m²) is{" "}
                  {(
                    ((data.average_rent - data.min_rent) /
                      (data.max_rent - data.min_rent)) *
                    100
                  ).toFixed(0)}
                  % above minimum
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
              <h4 className="text-sm font-semibold text-amber-400 mb-2">
                ⚡ Utility Analysis
              </h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>
                  • {utilityVariance}% variance suggests{" "}
                  {utilityVariance > 100
                    ? "significant"
                    : utilityVariance > 50
                    ? "notable"
                    : "minimal"}{" "}
                  cost differences
                </li>
                <li>
                  • ${utilityRange.toLocaleString()} annual difference between
                  locations
                </li>
                <li>
                  • Monthly utility range: ${(data.min_utility / 12).toFixed(0)}{" "}
                  - ${(data.max_utility / 12).toFixed(0)}
                </li>
                <li>
                  •{" "}
                  {data.average_utility > 5000
                    ? "High-consumption"
                    : "Standard"}{" "}
                  utility profile detected
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-400 mb-2">
            🎯 Strategic Recommendations
          </h4>
          <div className="text-sm text-slate-300 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong className="text-white">Cost Optimization:</strong>
              <ul className="mt-1 space-y-1">
                <li>
                  • Target locations with rent ≤ $
                  {(data.min_rent * 1.2).toFixed(2)}/m²
                </li>
                <li>
                  • Budget ${(data.min_utility * 1.15).toLocaleString()}/year
                  for utilities
                </li>
              </ul>
            </div>
            <div>
              <strong className="text-white">Risk Management:</strong>
              <ul className="mt-1 space-y-1">
                <li>
                  • Plan for{" "}
                  {Math.max(rentVariance, utilityVariance).toFixed(0)}% cost
                  buffer
                </li>
                <li>
                  • Consider energy-efficient locations to minimize utility
                  variance
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
