"use client";

import ForecastChart from "@/components/Dashboard/ForecastChart";
import PredictionFilters from "@/components/Dashboard/PredictionFilters";
import { RecommendationCard } from "@/components/Dashboard/RecommendationCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lightbulb, RefreshCw, Target, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const page = () => {
  const [filters, setFilters] = useState({
    type: "salon",
    province: undefined,
    city: undefined,
    target_year: undefined,
  });

  const [forecastData, setForecastData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [recommendationData, setRecommendationData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPredictions = async () => {
    if (!filters.city || !filters.province || !filters.target_year) {
      return;
    }

    setLoading(true);
    try {
      const [forecastRes, historicalRes, recommendationRes] = await Promise.all(
        [
          fetch(
            `http://127.0.0.1:8000/api/insights/forecast-openings?type=${filters.type}&city=${filters.city}&province=${filters.province}&target_year=${filters.target_year}`
          ),
          fetch(
            `http://127.0.0.1:8000/api/insights/open-close-trends?type=${filters.type}&city=${filters.city}&province=${filters.province}`
          ).catch((err) => {
            console.warn("Historical data endpoint not available:", err);
            return { ok: false };
          }),
          fetch(
            `http://127.0.0.1:8000/api/advice/should-open?type=${filters.type}&city=${filters.city}&province=${filters.province}&year=${filters.target_year}`
          ),
        ]
      );

      const forecastResult = await forecastRes.json();
      const historicalResult = await historicalRes.json();
      const recommendationResult = await recommendationRes.json();

      setForecastData(forecastResult.forecast || []);
      setHistoricalData(historicalResult.data || []);
      setRecommendationData(recommendationResult);
    } catch (error) {
      console.error("Failed to fetch predictions:", error);
      setForecastData([]);
      setHistoricalData([]);
      setRecommendationData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, [filters]);

  const hasRequiredFilters =
    filters.city && filters.province && filters.target_year;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Business Predictions
          </h1>
          <p className="text-slate-400 mt-2">
            AI-powered forecasts and recommendations for your business decisions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPredictions}
            disabled={loading || !hasRequiredFilters}
            className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-white"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh Predictions
          </Button>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <PredictionFilters filters={filters} setFilters={setFilters} />
      </div>

      {!hasRequiredFilters && (
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
          <CardContent className="py-12">
            <div className="text-center">
              <Target className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Ready to Generate Predictions
              </h3>
              <p className="text-slate-400 mb-6">
                Select a business type, location, and target year to get
                AI-powered forecasts and recommendations.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <Zap className="w-4 h-4" />
                <span>Powered by advanced machine learning algorithms</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {hasRequiredFilters && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Historical Trends & Forecast
                {filters.city && (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 ml-auto">
                    {filters.city}
                  </Badge>
                )}
              </CardTitle>
              <Separator className="bg-slate-700/50" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
              ) : (
                <ForecastChart
                  data={forecastData}
                  historicalData={historicalData}
                />
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Business Recommendation
                {recommendationData && (
                  <Badge
                    className={`ml-auto ${
                      recommendationData.recommended
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }`}
                  >
                    {recommendationData.recommended ? "Positive" : "Negative"}
                  </Badge>
                )}
              </CardTitle>
              <Separator className="bg-slate-700/50" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-yellow-400 animate-spin" />
                </div>
              ) : (
                <RecommendationCard data={recommendationData} />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default page;
