const {
  Lightbulb,
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
} = require("lucide-react");
const { Badge } = require("../ui/badge");
const { Separator } = require("../ui/separator");

export function RecommendationCard({ data }) {
  if (!data) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        <div className="text-center">
          <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No recommendation available</p>
          <p className="text-sm">
            Complete filter selection for business advice
          </p>
        </div>
      </div>
    );
  }

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case "high":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "low":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      default:
        return "text-slate-400 bg-slate-500/20 border-slate-500/30";
    }
  };

  const getConfidenceProgress = (confidence) => {
    switch (confidence) {
      case "high":
        return 85;
      case "medium":
        return 60;
      case "low":
        return 35;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {data?.recommended ? (
            <CheckCircle className="w-8 h-8 text-green-400" />
          ) : (
            <XCircle className="w-8 h-8 text-red-400" />
          )}
          <div>
            <h3 className="text-xl font-semibold text-white">
              {data?.recommended ? "Recommended" : "Not Recommended"}
            </h3>
            <p className="text-slate-400">{data?.summary}</p>
          </div>
        </div>
        <Badge
          className={`${getConfidenceColor(
            data?.confidence
          )} capitalize font-medium`}
        >
          {data?.confidence} Confidence
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-300">Confidence Level</span>
          <span className="text-sm text-white font-medium">
            {getConfidenceProgress(data?.confidence)}%
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${getConfidenceProgress(data?.confidence)}%` }}
          ></div>
        </div>
      </div>

      <Separator className="bg-slate-700/50" />

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          Predicated Key Metrics
        </h4>
        <p className="text-slate-400 text-xs">(For the next 3 years)</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Avg Opened</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-lg font-bold text-white">
              {data?.key_metrics?.avg_opened}
            </div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Avg Closed</span>
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-lg font-bold text-white">
              {data?.key_metrics?.avg_closed}
            </div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Avg Revenue</span>
              <DollarSign className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-lg font-bold text-white">
              ${data?.key_metrics.avg_revenue.toLocaleString()}
            </div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Avg Costs</span>
              <AlertCircle className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-lg font-bold text-white">
              ${data?.key_metrics.avg_costs.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-slate-700/50" />

      <div className="space-y-3">
        <h4 className="text-lg font-medium text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          Key Insights
        </h4>
        <div className="space-y-2">
          {data?.reasons.map((reason, index) => (
            <div key={index} className="flex items-start gap-2 text-slate-300">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm">{reason}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
