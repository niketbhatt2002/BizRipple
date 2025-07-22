// "use client";

// import { useEffect, useState } from "react";
// import { RevenueChart } from "@/components/Dashboard/RevenueChart";
// import { DashboardFilters } from "@/components/Dashboard/DashboardFilters";

// export default function RevenuePage() {
//   const [filters, setFilters] = useState({
//     province: undefined,
//     city: undefined,
//     year: undefined,
//   });

//   const [revenueData, setRevenueData] = useState([]);

//   useEffect(() => {
//     const query = new URLSearchParams();
//     if (filters.province) query.append("province", filters.province);
//     if (filters.city) query.append("city", filters.city);
//     if (filters.year) query.append("year", filters.year);

//     fetch(`http://localhost:8000/api/insights/revenue-by-type?${query}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setRevenueData(data.data);
//       });
//   }, [filters]);

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-semibold">Revenue Overview</h1>
//       <DashboardFilters
//         filters={{ type: "salon", ...filters }}
//         setFilters={(newFilters) =>
//           setFilters({
//             ...filters,
//             province: newFilters.province,
//             city: newFilters.city,
//             year: newFilters.year,
//           })
//         }
//       />
//       <RevenueChart data={revenueData} />
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { RevenueChart } from "@/components/Dashboard/RevenueChart";
import { DashboardFilters } from "@/components/Dashboard/DashboardFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  BarChart3,
  AlertCircle,
  Calendar,
} from "lucide-react";

export default function RevenuePage() {
  const [filters, setFilters] = useState({
    type: "salon", // Default business type
    province: undefined,
    city: undefined,
    year: undefined,
  });

  const [revenueKpiData, setRevenueKpiData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      setError(null);

      const query = new URLSearchParams();
      if (filters.type) query.append("type", filters.type);
      if (filters.province) query.append("province", filters.province);
      if (filters.city) query.append("city", filters.city);
      if (filters.year) query.append("year", filters.year);

      const [revenueKpiRes, chartRes] = await Promise.all([
        fetch(
          `http://localhost:8000/api/insights/revenue-by-type-kpi?${query}`
        ),
        fetch(
          `http://localhost:8000/api/insights/revenue-by-type-chart?${query}`
        ),
      ]);

      const revenueKpi = await revenueKpiRes.json();
      const chart = await chartRes.json();

      setRevenueKpiData(revenueKpi.data || []);
      setChartData(chart.data || []);

      // setRevenueData(
      //   data.data?.filter((item) => {
      //     // If filters.type is set, filter items matching the type
      //     if (filters.type) {
      //       return item.business_type === filters.type;
      //     }
      //     // If no filters.type, return all items
      //     return true;
      //   }) || []
      // );
    } catch (err) {
      setError(err.message);
      setRevenueKpiData([]);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [filters]);

  const refreshData = () => {
    fetchRevenueData();
  };


  // Calculate summary statistics for filtered data
//   const totalRevenue = filteredData.reduce(
//     (sum, item) => sum + (item.average_revenue || 0),
//     0
//   );
//   const avgRevenue =
//     filteredData.length > 0 ? totalRevenue / filteredData.length : 0;
//   const highestRevenue =
//     filteredData.length > 0
//       ? Math.max(...filteredData.map((item) => item.average_revenue || 0))
//       : 0;
//   const lowestRevenue =
//     filteredData.length > 0
//       ? Math.min(...filteredData.map((item) => item.average_revenue || 0))
//       : 0;

  // Get business type display name
  const getBusinessTypeDisplay = (type) => {
    if (!type) return "All Business Types";
    return type.charAt(0).toUpperCase() + type.slice(1) + "s";
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
            Revenue Overview
          </h1>
          <p className="text-slate-400 mt-2">
            Analyze average revenue for {getBusinessTypeDisplay(filters.type)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={loading}
            className="bg-slate-800/50 border-slate-700 text-white cursor-pointer"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-slate-800/50 border-slate-700 text-white cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <DashboardFilters filters={filters} setFilters={setFilters} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:bg-slate-900/70 transition-all duration-300 group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                Average Revenue
              </CardTitle>
              <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg border border-emerald-500/30">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">
                {loading ? (
                  <div className="w-16 h-6 bg-slate-700 rounded animate-pulse"></div>
                ) : (
                  "$" +
                  revenueKpiData?.map((item) => item.avg_rev_cad.toFixed(2))
                )}
              </div>
              <p className="text-xs text-slate-500">Median across all data</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:bg-slate-900/70 transition-all duration-300 group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                Maximum Revenue
              </CardTitle>
              <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg border border-emerald-500/30">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">
                {loading ? (
                  <div className="w-20 h-6 bg-slate-700 rounded animate-pulse"></div>
                ) : (
                  "$" +
                  revenueKpiData?.map((item) => item.max_rev_cad.toFixed(2))
                )}
              </div>
              <p className="text-xs text-slate-500">Peak revenue recorded</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:bg-slate-900/70 transition-all duration-300 group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                Minimum Revenue
              </CardTitle>
              <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg border border-emerald-500/30">
                <TrendingDown className="w-4 h-4 text-orange-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">
                {loading ? (
                  <div className="w-20 h-6 bg-slate-700 rounded animate-pulse"></div>
                ) : (
                  "$" +
                  revenueKpiData?.map((item) => item.min_rev_cad.toFixed(2))
                )}
              </div>
              <p className="text-xs text-slate-500">Minimum revenue recorded</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:bg-slate-900/70 transition-all duration-300 group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                Data Points
              </CardTitle>
              <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg border border-emerald-500/30">
                <Calendar className="w-4 h-4 text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">
                {loading ? (
                  <div className="w-20 h-6 bg-slate-700 rounded animate-pulse"></div>
                ) : (
                  revenueKpiData?.map((item) => item.years)
                )}
              </div>
              <p className="text-xs text-slate-500">No. of Years</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Average Revenue by Business Type
          </CardTitle>
          <Separator className="bg-slate-700/50" />
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <p className="text-red-400 mb-2">Failed to load revenue data</p>
                <p className="text-slate-400 text-sm mb-4">{error}</p>
                <Button onClick={refreshData} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          ) : (
            <RevenueChart data={chartData} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
