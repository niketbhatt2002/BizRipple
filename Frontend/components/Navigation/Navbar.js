"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationData } from "@/data";
import { SignedIn, SignUpButton, UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/clerk-react";
import Link from "next/link";

export default function ClientNav() {
  const { isSignedIn } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrollY > 50
            ? "bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                BizRipple
              </span>
            </div>

            <div className="hidden md:flex space-x-8">
              {navigationData.map((item, index) => {
                const lowerItem = item.toLowerCase();

                const href =
                  lowerItem === "features" ? `#${lowerItem}` : `/${lowerItem}`;

                return (
                  <Link
                    key={index}
                    href={href}
                    className="text-slate-300 hover:text-white transition-colors duration-200 hover:scale-105"
                  >
                    {item}
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {!isSignedIn ? (
                <SignUpButton>
                  <Button
                    variant="ghost"
                    className="cursor-pointer transition-colors duration-200"
                  >
                    Sign In
                  </Button>
                </SignUpButton>
              ) : (
                <SignedIn>
                  <UserButton />
                </SignedIn>
              )}
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 cursor-pointer transition-colors duration-200"
              >
                <Link href={"/dashboard/policies"}>Get Started</Link>
              </Button>
            </div>

            <Button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {navigationData.map((item) => (
              <a
                key={item}
                href={
                  item.toLowerCase() === "dashboard"
                    ? "/dashboard"
                    : `#${item.toLowerCase().replace(" ", "-")}`
                }
                className="text-2xl text-slate-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <Button
              asChild
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-lg text-xl"
            >
              <Link href={"/dashboard"}>Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
