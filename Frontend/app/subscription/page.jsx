import { Check, X, Star, Zap, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navigation/Navbar";
import Footer from "@/components/Navigation/Footer";

const pricingPlans = [
  {
    name: "Starter",
    price: "$29",
    period: "month",
    description: "Perfect for small businesses getting started with compliance",
    icon: <TrendingUp className="w-6 h-6" />,
    features: [
      "Up to 5 policy alerts per month",
      "Basic compliance dashboard",
      "Email notifications",
      "Industry-specific updates",
      "Basic support",
    ],
    limitations: [
      "Limited to 1 business location",
      "No custom reporting",
      "No API access",
    ],
    buttonText: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$89",
    period: "month",
    description: "Comprehensive solution for growing businesses",
    icon: <Zap className="w-6 h-6" />,
    features: [
      "Unlimited policy alerts",
      "Advanced compliance dashboard",
      "Real-time notifications",
      "Multi-industry coverage",
      "Priority support",
      "Custom reporting",
      "Document templates",
      "Compliance calendar",
      "Risk assessment tools",
    ],
    limitations: ["Limited to 5 business locations", "No white-label options"],
    buttonText: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "Tailored solution for large organizations",
    icon: <Shield className="w-6 h-6" />,
    features: [
      "Everything in Professional",
      "Unlimited business locations",
      "White-label solution",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "24/7 phone support",
      "Custom compliance workflows",
      "Advanced analytics",
      "Regulatory change predictions",
    ],
    limitations: [],
    buttonText: "Contact Sales",
    popular: false,
  },
];

const faqItems = [
  {
    question: "Can I change my plan at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "We offer a 14-day free trial for all paid plans. No credit card required to start.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "We provide email support for all plans, priority support for Professional, and dedicated phone support for Enterprise customers.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer:
      "Yes, we offer up to 20% discount when you choose annual billing instead of monthly.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Select the perfect plan for your business needs. All plans include
            our core compliance features with varying levels of support and
            customization.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative bg-white/5 backdrop-blur-lg border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105 ${
                  plan.popular ? "ring-2 ring-purple-500/50" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full">
                      {plan.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-gray-300 mb-4">
                    {plan.description}
                  </CardDescription>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-400 ml-2">/{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-3">
                      Features included:
                    </h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start text-gray-300"
                        >
                          <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.limitations.length > 0 && (
                    <>
                      <Separator className="bg-white/10" />
                      <div>
                        <h4 className="font-semibold text-white mb-3">
                          Limitations:
                        </h4>
                        <ul className="space-y-2">
                          {plan.limitations.map(
                            (limitation, limitationIndex) => (
                              <li
                                key={limitationIndex}
                                className="flex items-start text-gray-400"
                              >
                                <X className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                                {limitation}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </>
                  )}
                </CardContent>

                <CardFooter>
                  <Button
                    className={`w-full h-12 font-semibold transition-all duration-200 ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-300 text-lg">
              Get answers to the most common questions about our pricing and
              plans.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {faqItems.map((faq, index) => (
              <Card
                key={index}
                className="bg-white/5 backdrop-blur-lg border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 backdrop-blur-lg border-purple-500/20">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Join thousands of businesses that trust BizRipple for their
                compliance needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-8 py-3 text-lg font-semibold cursor-pointer">
                  Start Free Trial
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 hover:bg-white/10 px-8 py-3 text-lg font-semibold cursor-pointer"
                >
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
