"use client";

import { useEffect, useState } from "react";
import { DashboardFilters } from "@/components/Dashboard/DashboardFilters";
import { PolicyDistributionChart } from "@/components/Dashboard/PolicyDistributionChart";
import { PolicyImpactChart } from "@/components/Dashboard/PolicyImpactChart";
import { PolicyImpactMap } from "@/components/Dashboard/PolicyImpactMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  RefreshCw,
  Shield,
  TrendingUp,
  BarChart3,
  AlertCircle,
} from "lucide-react";

export default function PoliciesPage() {
  const [filters, setFilters] = useState({
    type: "salon",
    province: undefined,
    city: undefined,
    year: undefined,
  });

  const [policyData, setPolicyData] = useState([]);
  const [impactData, setImpactData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPolicies: 0,
    avgImpact: 0,
    mostCommonType: "N/A",
    highestImpact: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (filters.type) query.append("type", filters.type);
        if (filters.province) query.append("province", filters.province);
        if (filters.city) query.append("city", filters.city);
        if (filters.year) query.append("year", filters.year);
        if (filters.policy_type)
          query.append("policy_type", filters.policy_type);

        const [policyRes, impactRes] = await Promise.all([
          fetch(
            `http://localhost:8000/api/insights/policy-distribution?${query}`
          ),
          fetch(
            `http://localhost:8000/api/insights/policy-impact-trend?${query}`
          ),
        ]);

        const policyResult = await policyRes.json();
        const impactResult = await impactRes.json();

        setPolicyData(policyResult.data || []);
        setImpactData(impactResult.data || []);

        // Calculate stats
        if (policyResult.data && policyResult.data.length > 0) {
          const totalPolicies = policyResult.data.reduce(
            (sum, item) => sum + item.dist_count,
            0
          );
          const mostCommon = policyResult.data.reduce((prev, current) =>
            prev.count > current.count ? prev : current
          );

          let avgImpact = 0;
          let highestImpact = 0;
          if (impactResult.data && impactResult.data.length > 0) {
            const impacts = impactResult.data.map(
              (item) => item.average_impact
            );
            avgImpact = impacts.reduce((a, b) => a + b, 0) / impacts.length;
            highestImpact = Math.max(...impacts);
          }

          setStats({
            totalPolicies,
            avgImpact: avgImpact.toFixed(2),
            mostCommonType: mostCommon.policy_type,
            highestImpact: highestImpact.toFixed(2),
          });
        }
      } catch (error) {
        console.error("Failed to fetch policy data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const refreshData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.type) query.append("type", filters.type);
      if (filters.province) query.append("province", filters.province);
      if (filters.city) query.append("city", filters.city);
      if (filters.year) query.append("year", filters.year);
      if (filters.policy_type) query.append("policy_type", filters.policy_type);

      const [policyRes, impactRes] = await Promise.all([
        fetch(
          `http://localhost:8000/api/insights/policy-distribution?${query}`
        ),
        fetch(
          `http://localhost:8000/api/insights/policy-impact-trend?${query}`
        ),
      ]);

      const policyResult = await policyRes.json();
      const impactResult = await impactRes.json();

      setPolicyData(policyResult.data || []);
      setImpactData(impactResult.data || []);
    } catch (error) {
      console.error("Failed to refresh policy data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Policies",
      value: loading ? "..." : stats.totalPolicies.toLocaleString(),
      icon: Shield,
      description: "Active policies tracked",
    },
    {
      title: "Average Impact",
      value: loading ? "..." : stats.avgImpact,
      icon: TrendingUp,
      description: "Average policy effectiveness",
    },
    {
      title: "Most Common Type",
      value: loading ? "..." : stats.mostCommonType,
      icon: BarChart3,
      description: "Dominant policy category",
    },
    {
      title: "Highest Impact",
      value: loading ? "..." : stats.highestImpact,
      icon: AlertCircle,
      description: "Maximum recorded impact",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Policy Analytics
          </h1>
          <p className="text-slate-400 mt-2">
            Comprehensive policy distribution and impact analysis
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Policy Distribution by Type
            </CardTitle>
            <Separator className="bg-slate-700/50" />
          </CardHeader>
          <CardContent>
            <PolicyDistributionChart data={policyData} loading={loading} />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Policy Impact Trends
            </CardTitle>
            <Separator className="bg-slate-700/50" />
          </CardHeader>
          <CardContent>
            <PolicyImpactChart data={impactData} loading={loading} />
          </CardContent>
        </Card>
      </div>

      {/* New Map Section */}
      <div className="grid grid-cols-1 gap-6">
        <PolicyImpactMap filters={filters} />
      </div>
    </div>
  );
}
