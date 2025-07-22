"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingDown, TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the map to avoid SSR issues
const DynamicMap = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] bg-slate-800/50 rounded-lg flex items-center justify-center">
      <div className="text-slate-400">Loading map...</div>
    </div>
  ),
});

export function PolicyImpactMap({ filters }) {
  const [minImpactData, setMinImpactData] = useState([]);
  const [maxImpactData, setMaxImpactData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMapData = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (filters.type) query.append("type", filters.type);
        if (filters.province) query.append("province", filters.province);
        if (filters.year) query.append("year", filters.year);

        const [minRes, maxRes] = await Promise.all([
          fetch(
            `http://localhost:8000/api/insights/minimum_impact_of_policy?${query}`
          ),
          fetch(
            `http://localhost:8000/api/insights/maximum_impact_of_policy?${query}`
          ),
        ]);

        const minResult = await minRes.json();
        const maxResult = await maxRes.json();

        setMinImpactData(minResult.data || []);
        setMaxImpactData(maxResult.data || []);
      } catch (error) {
        console.error("Failed to fetch map data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, [filters]);

  const mapData = useMemo(
    () => ({
      minImpact: minImpactData,
      maxImpact: maxImpactData,
    }),
    [minImpactData, maxImpactData]
  );

  return (
    <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-400" />
            Policy Impact Geographic Distribution
          </CardTitle>

          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
            >
              <TrendingDown className="w-3 h-3 mr-1" />
              Min Impact ({minImpactData.length})
            </Badge>
            <Badge
              variant="outline"
              className="bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Max Impact ({maxImpactData.length})
            </Badge>
          </div>
        </div>
        <Separator className="bg-slate-700/50" />
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            Interactive map showing cities with minimum (red) and maximum
            (green) policy impacts. Click on markers for detailed information.
          </p>

          <div className="relative">
            {loading ? (
              <div className="h-[600px] bg-slate-800/50 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-slate-400">Loading map data...</p>
                </div>
              </div>
            ) : (
              <DynamicMap data={mapData} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
