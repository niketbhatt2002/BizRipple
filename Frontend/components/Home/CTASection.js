import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Transform Your Business?
        </h2>
        <p className="text-xl text-slate-300 mb-8">
          Join thousands of businesses already using BizRipple
        </p>

        <div className="flex justify-center mb-12">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-6 rounded-lg text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-xl flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <span>Start Your Analysis</span>
            </Link>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default CTASection
