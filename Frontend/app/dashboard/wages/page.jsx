"use client";

import { useEffect, useState } from "react";
import { WageChart } from "@/components/Dashboard/WageChart";
import { DashboardFilters } from "@/components/Dashboard/DashboardFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  DollarSign,
  BarChart3,
} from "lucide-react";

export default function WagesPage() {
  const [filters, setFilters] = useState({
    type: "salon",
    province: undefined,
    city: undefined,
    year: undefined,
  });

  const [wageData, setWageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    avgWage: 0,
    highestWage: 0,
    lowestWage: 0,
    totalEntries: 0,
  });

  useEffect(() => {
    const fetchWageData = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (filters.type) query.append("type", filters.type);
        if (filters.province) query.append("province", filters.province);
        if (filters.city) query.append("city", filters.city);
        if (filters.year) query.append("year", filters.year);

        const response = await fetch(
          `http://localhost:8000/api/insights/wage-trends?${query}`
        );
        const result = await response.json();
        console.log(result);
        

        setWageData(result.data || []);

        // Calculate stats from data
        if (result.data && result.data.length > 0) {
          const wages = result.data.map((item) => item.median_wage);
          const avgWage = wages.reduce((a, b) => a + b, 0) / wages.length;
          const highestWage = Math.max(...wages).toFixed(2);
          const lowestWage = Math.min(...wages).toFixed(2);

          setStats({
            avgWage: Math.round(avgWage),
            highestWage,
            lowestWage,
            totalEntries: result.data.length,
          });
        }
      } catch (error) {
        console.error("Failed to fetch wage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWageData();
  }, [filters]);

  const refreshData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.type) query.append("type", filters.type);
      if (filters.province) query.append("province", filters.province);
      if (filters.city) query.append("city", filters.city);
      if (filters.year) query.append("year", filters.year);

      const response = await fetch(
        `http://localhost:8000/api/insights/wage-trends?${query}`
      );
      const result = await response.json();
      setWageData(result.data || []);
    } catch (error) {
      console.error("Failed to refresh wage data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Average Wage",
      value: loading ? "..." : `$${stats.avgWage.toLocaleString()}`,
      icon: DollarSign,
      description: "Median across all data",
    },
    {
      title: "Highest Wage",
      value: loading ? "..." : `$${stats.highestWage.toLocaleString()}`,
      icon: TrendingUp,
      description: "Peak wage recorded",
    },
    {
      title: "Lowest Wage",
      value: loading ? "..." : `$${stats.lowestWage.toLocaleString()}`,
      icon: TrendingDown,
      description: "Minimum wage recorded",
    },
    {
      title: "Data Points",
      value: loading ? "..." : stats.totalEntries.toLocaleString(),
      icon: BarChart3,
      description: "Total entries analyzed",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Wage Trends Analysis
          </h1>
          <p className="text-slate-400 mt-2">
            Comprehensive wage analytics across different markets
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={loading}
            className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-white"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-slate-800/50 border-slate-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <DashboardFilters filters={filters} setFilters={setFilters} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card
            key={stat.title}
            className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:bg-slate-900/70 transition-all duration-300 group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                  {stat.title}
                </CardTitle>
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
                  <stat.icon className="w-4 h-4 text-blue-400" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white">
                  {loading ? (
                    <div className="w-16 h-6 bg-slate-700 rounded animate-pulse"></div>
                  ) : (
                    stat.value
                  )}
                </div>
                <p className="text-xs text-slate-500">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            {filters.year ? "Median Wage by City" : "Median Wage Trend by Year"}
          </CardTitle>
          <Separator className="bg-slate-700/50" />
          <div className="text-blue-400 italic">Note: This is a dynamic chart showing different grainularity of data for different City and Year filters.</div>
        </CardHeader>
        <CardContent>
          <WageChart data={wageData} year={filters.year} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
