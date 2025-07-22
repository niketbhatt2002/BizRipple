import { Building2, Calendar, MapPin, RefreshCw, Target } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";

const PredictionFilters = ({ filters, setFilters }) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    provinces: [],
    cities: [],
  });

  const hasActiveFilters =
    filters.province || filters.city || filters.target_year;

  const currentYear = new Date().getFullYear();
  const futureYears = Array.from({ length: 10 }, (_, i) => currentYear + 1 + i);

  const clearFilters = () => {
    setFilters({
      type: "salon",
      province: undefined,
      city: undefined,
      target_year: undefined,
    });
  };

  const handleChange = (key, value) => {
    setFilters({ ...filters, [key]: value === "all" ? undefined : value });
  };

  const businessTypeOptions = [
    { value: "salon", label: "Salon", icon: "💇" },
    { value: "cafe", label: "Cafe", icon: "☕" },
    { value: "restaurant", label: "Restaurant", icon: "🍽️" },
    { value: "retail", label: "Retail", icon: "🛍️" },
    { value: "pharmacy", label: "Pharmacy", icon: "💊" },
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/filters/options?type=${filters.type}`)
      .then((res) => res.json())
      .then((data) => {
        setOptions(data.data);
      })
      .catch((error) => {
        console.error("Error fetching filter options:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filters.type]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">
            Prediction Filters
          </h3>

          {hasActiveFilters && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {
                [filters.province, filters.city, filters.target_year].filter(
                  Boolean
                ).length
              }{" "}
              active
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-300 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            Business Type
          </Label>
          <Select
            value={filters.type}
            onValueChange={(val) => handleChange("type", val)}
          >
            <SelectTrigger className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-white focus:ring-blue-500/50">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {businessTypeOptions.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className="text-white hover:bg-slate-700 focus:bg-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="capitalize">{item.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-400" />
            Province
          </Label>
          <Select
            value={filters.province || "all"}
            onValueChange={(val) => handleChange("province", val)}
          >
            <SelectTrigger className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-white focus:ring-purple-500/50">
              <SelectValue placeholder="All provinces" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem
                value="all"
                className="text-white hover:bg-slate-700 focus:bg-slate-700"
              >
                All Provinces
              </SelectItem>
              {loading ? (
                <SelectItem value="loading" disabled className="text-slate-400">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Loading...
                  </div>
                </SelectItem>
              ) : (
                options.provinces.map((p) => (
                  <SelectItem
                    key={p}
                    value={p}
                    className="text-white hover:bg-slate-700 focus:bg-slate-700"
                  >
                    {p}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            City
          </Label>
          <Select
            value={filters.city || "all"}
            onValueChange={(val) => handleChange("city", val)}
          >
            <SelectTrigger className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-white focus:ring-cyan-500/50">
              <SelectValue placeholder="All cities" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem
                value="all"
                className="text-white hover:bg-slate-700 focus:bg-slate-700"
              >
                All Cities
              </SelectItem>
              {loading ? (
                <SelectItem value="loading" disabled className="text-slate-400">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Loading...
                  </div>
                </SelectItem>
              ) : (
                options.cities.map((c) => (
                  <SelectItem
                    key={c}
                    value={c}
                    className="text-white hover:bg-slate-700 focus:bg-slate-700"
                  >
                    {c}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-pink-400" />
            Target Year
          </Label>

          <Select
            value={filters.target_year || "all"}
            onValueChange={(val) => handleChange("target_year", val)}
          >
            <SelectTrigger className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-white focus:ring-pink-500/50 focus:border-pink-500/50">
              <SelectValue placeholder="All years" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem
                value="all"
                className="text-white hover:bg-slate-700 focus:bg-slate-700"
              >
                All Years
              </SelectItem>
              {loading ? (
                <SelectItem value="loading" disabled className="text-slate-400">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Loading...
                  </div>
                </SelectItem>
              ) : (
                futureYears.map((t) => (
                  <SelectItem
                    key={t}
                    value={t.toString()}
                    className="text-white hover:bg-slate-700 focus:bg-slate-700"
                  >
                    {t}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PredictionFilters;
