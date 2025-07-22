"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardFilters } from "@/components/Dashboard/DashboardFilters";
import { OpenCloseChart } from "@/components/Dashboard/OpenCloseChart";
import { getDashboardData } from "@/lib/dashboard-api";
import { FootfallChart } from "@/components/Dashboard/FootfallChart";
import { Button } from "@/components/ui/button";
import { AlertCircle, DollarSign, Download, RefreshCw, TrendingUp, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    type: "salon",
    province: undefined,
    city: undefined,
    year: undefined,
  });

  const [data, setData] = useState({
    businessCount: 0,
    avgRevenue: 0,
    medianWage: 0,
    failureRate: "0%",
    openCloseTrends: [],
    footfallByCity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getDashboardData(filters);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const refreshData = async () => {
    setLoading(true);
    try {
      const result = await getDashboardData(filters);
      setData(result);
    } catch (error) {
      console.error("Failed to refresh dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Average Business Unit",
      value: loading ? "..." : data.businessCount?.toFixed(2) || "0",
      icon: Users,
      description: "Active businesses tracked",
    },
    {
      title: "Avg Revenue",
      value: loading ? "..." : `$${data.avgRevenue?.toLocaleString() || "0"}`,
      icon: DollarSign,
      description: "Average revenue (CAD)",
    },
    {
      title: "Median Wage",
      value: loading ? "..." : `$${data.medianWage?.toLocaleString() || "0"}`,
      icon: TrendingUp,
      description: "Per year (CAD)",
    },
    {
      title: "Success Rate",
      value: loading ? "..." : data.failureRate || "0%",
      icon: AlertCircle,
      description: "Business success rate",
    },
  ];
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-slate-400 mt-2">
            Real-time insights for your business analytics
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
            className="bg-slate-800/50 border-slate-700 text-white cursor-pointer"
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
        {statCards.map((stat) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Business Trends
            </CardTitle>
            <Separator className="bg-slate-700/50" />
          </CardHeader>
          <CardContent>
            <OpenCloseChart data={data?.openCloseTrends || []} />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Footfall Analysis for Top 10 Cities
            </CardTitle>
            <Separator className="bg-slate-700/50" />
          </CardHeader>
          <CardContent>
            <FootfallChart data={data?.footfallByCity || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
