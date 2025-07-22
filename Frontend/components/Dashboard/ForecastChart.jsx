import { BarChart3 } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";

const ForecastChart = ({ data, historicalData }) => {

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No forecast data available</p>
          <p className="text-sm">Select filters to generate predictions</p>
        </div>
      </div>
    );
  }

  // Combine historical and forecast data
  const combinedData = [];
  const currentYear = new Date().getFullYear();

  // Add historical data (past 10 years)
  if (historicalData && historicalData.length > 0) {
    historicalData.forEach((item) => {
      combinedData.push({
        year: item.year,
        actual_openings: item.opened,
        actual_closing: item.closed,
        predicted_openings: null,
        isHistorical: true,
      });
    });
  }

  // Add forecast data
  data.forEach((item) => {
    combinedData.push({
      year: item.year,
      actual_openings: null, // No actual data for future years
      predicted_openings: item.predicted_openings,
      isHistorical: false,
    });
  });

  // Sort by year
  combinedData.sort((a, b) => a.year - b.year);

  // Custom tooltip to show different information for historical vs forecast data
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const isHistoricalYear = label <= currentYear;
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
          <p className="text-slate-300 text-sm mb-2">{`Year: ${label}`}</p>
          {payload.map((entry, index) => {
            if (entry.value !== null) {
              const isActualOpening = entry.dataKey === "actual_openings";
              const isActualClosing = entry.dataKey === "actual_closing";

              return (
                <p
                  key={index}
                  className="text-sm"
                  style={{ color: entry.color }}
                >
                  {`${
                    isActualOpening || isActualClosing ? "Actual" : "Predicted"
                  } Openings: ${entry.value}`}
                </p>
              );
            }
            return null;
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-emerald-400 rounded"></div>
          <span className="text-slate-300">Historical Openings</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-red-400 rounded"></div>
          <span className="text-slate-300">Historical Closing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-blue-400 rounded"></div>
          <span className="text-slate-300">Forecast</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={combinedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 15 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="year"
            stroke="#94a3b8"
            fontSize={12}
            tickFormatter={(value) => `${value}`}
            label={{
              value: "Year",
              position: "insideBottom",
              offset: -10,
              style: { textAnchor: "middle", fill: "#94a3b8" },
            }}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            label={{
              value: "Business Unit Count",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "#94a3b8" },
            }}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Reference line to separate historical and forecast data */}
          <ReferenceLine
            x={currentYear}
            stroke="#64748b"
            strokeDasharray="5 5"
            opacity={0.7}
          />

          {/* Historical data line */}
          <Line
            type="monotone"
            dataKey="actual_openings"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
            connectNulls={false}
            name="Historical"
          />

          <Line
            type="monotone"
            dataKey="actual_closing"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2 }}
            connectNulls={false}
            name="Historical"
          />

          {/* Forecast data line */}
          <Line
            type="monotone"
            dataKey="predicted_openings"
            stroke="#3b82f6"
            strokeWidth={3}
            strokeDasharray="8 4"
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
            connectNulls={false}
            name="Forecast"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
