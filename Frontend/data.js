import {
  BarChart3,
  Building2,
  Building2Icon,
  Clock,
  Globe,
  MapPin,
  Shield,
  Zap,
} from "lucide-react";

export const navigationData = ["Features", "Dashboard", "Subscription"];

export const featuresData = [
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Real-Time Policy Analysis",
    description:
      "AI-powered insights track policy changes across 397+ Ontario cities",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "Business Impact Forecasting",
    description:
      "Predict how policies will affect your specific business type and location",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Personalized Compliance",
    description: "Get tailored recommendations based on your business profile",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Policy Network Graph",
    description:
      "Visualize connections between related policies and regulations",
    color: "from-green-500 to-emerald-500",
  },
];

export const statsData = [
  {
    value: "397+",
    label: "Ontario Cities",
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    value: "22,200+",
    label: "Business Records",
    icon: <Building2Icon className="w-5 h-5" />,
  },
  { value: "29", label: "Policy Types", icon: <Shield className="w-5 h-5" /> },
  { value: "10", label: "Years of Data", icon: <Clock className="w-5 h-5" /> },
];
