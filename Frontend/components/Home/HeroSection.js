import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-slate-700/50">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">
              Now Live: Canada Business Policy Analytics
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Navigate{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Policy Changes
            </span>
            <br />
            Like Never Before
          </h1>

          <p className="text-xl sm:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            BizRipple transforms complex government regulations into clear,
            actionable insights for small businesses across Canada.
          </p>

          <div className="flex justify-center mb-12">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-6 rounded-lg text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-xl flex items-center">
              <Link href="/dashboard/policies" className="flex items-center">
                <span>Start Your Analysis</span>
              </Link>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="max-w-7xl mx-auto">
            <Image
              src="/hero-image.webp"
              alt="BizRipple Hero Image"
              width={800}
              height={450}
              className="mx-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
