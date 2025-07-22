"use client";

import { useEffect, useState } from "react";
import { DashboardFilters } from "@/components/Dashboard/DashboardFilters";
import { CostChart } from "@/components/Dashboard/CostChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  RefreshCw,
  Download,
  Home,
  Zap,
  Calculator,
  PieChart,
} from "lucide-react";

export default function CostsPage() {
  const [filters, setFilters] = useState({
    type: "salon",
    province: undefined,
    city: undefined,
    year: undefined,
  });

  const [costData, setCostData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCostData = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (filters.type) query.append("type", filters.type);
        if (filters.province) query.append("province", filters.province);
        if (filters.city) query.append("city", filters.city);
        if (filters.year) query.append("year", filters.year);

        const response = await fetch(
          `http://localhost:8000/api/insights/cost-breakdown?${query}`
        );
        const result = await response.json();
        setCostData(result.data);
      } catch (error) {
        console.error("Failed to fetch cost data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCostData();
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
        `http://localhost:8000/api/insights/cost-breakdown?${query}`
      );
      const result = await response.json();
      setCostData(result.data);
    } catch (error) {
      console.error("Failed to refresh cost data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Average Rent",
      value: loading ? "..." : `$${costData.average_rent?.toFixed(2) || "0"}`,
      icon: Home,
      description: "CAD per meter²",
    },
    {
      title: "Average Utility",
      value: loading
        ? "..."
        : `$${costData.average_utility?.toLocaleString() || "0"}`,
      icon: Zap,
      description: "Yearly utility cost (CAD)",
    },
    {
      title: "Rent",
      value: loading ? (
        "..."
      ) : (
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Minimum</div>
          <div className="text-2xl font-semibold text-red-400">
            ${costData.min_rent?.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground mt-2">Maximum</div>
          <div className="text-2xl font-semibold text-green-400">
            ${costData.max_rent?.toFixed(2)}
          </div>
        </div>
      ),
      icon: Calculator,
      description: "CAD per meter²",
    },
    {
      title: "Utility",
      value: loading ? (
        "..."
      ) : (
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Minimum</div>
          <div className="text-2xl font-semibold text-red-400">
            ${costData.min_utility?.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground mt-2">Maximum</div>
          <div className="text-2xl font-semibold text-green-400">
            ${costData.max_utility?.toLocaleString()}
          </div>
        </div>
      ),
      icon: PieChart,
      description: "Yearly utility cost (CAD)",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Cost Breakdown Analysis
          </h1>
          <p className="text-slate-400 mt-2">
            Comprehensive cost structure insights for operational planning
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
            <CardHeader>
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
                <p className="text-xs text-slate-400 font-medium">
                  {stat.percentage}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-400" />
            Cost Distribution & Variance Analysis
          </CardTitle>
          <p className="text-sm text-slate-400">
            Min/Max distribution patterns and business insights for strategic
            decision making (Note: The business insights and recommendation are provided on the basis of threshold values dependent on variance % which are &gt; 50% (for high), 0-25% (for moderate) and &lt;25% (for low))
          </p>
          <Separator className="bg-slate-700/50" />
        </CardHeader>
        <CardContent>
          <CostChart data={costData} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
