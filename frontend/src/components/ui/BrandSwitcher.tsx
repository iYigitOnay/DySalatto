"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Cake, ArrowRightLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const BrandSwitcher = () => {
  const pathname = usePathname();
  
  // Don't show on the main portal/entry page
  if (pathname === "/") return null;

  const isCakePage = pathname?.startsWith("/cake");
  const targetPath = isCakePage ? "/salatto" : "/cake";
  const targetName = isCakePage ? "DYSalatto" : "DYCake";
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-8 right-8 z-[150] pointer-events-auto"
    >
      <Link href={targetPath}>
        <motion.div
          whileHover="hover"
          initial="initial"
          className="relative flex flex-row-reverse items-center group cursor-pointer"
        >
          {/* Luxury Floating Button - Fixed on the right */}
          <motion.div 
            variants={{
              initial: { rotateY: 0 },
              hover: { rotateY: 180 }
            }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center relative z-20 transition-all duration-700",
              "bg-brand-charcoal/40 backdrop-blur-2xl border border-white/10",
              isCakePage 
                ? "group-hover:border-brand-terracotta/40 group-hover:shadow-[0_0_20px_rgba(211,84,0,0.15)]" 
                : "group-hover:border-brand-sand/40 group-hover:shadow-[0_0_20px_rgba(245,222,179,0.15)]"
            )}
          >
            <motion.div
              variants={{
                initial: { rotateY: 0, scale: 1 },
                hover: { rotateY: -180, scale: 1.1 }
              }}
              className={cn(
                "transition-colors duration-500",
                isCakePage ? "text-brand-terracotta" : "text-brand-sand"
              )}
            >
              {isCakePage ? <Utensils className="w-4 h-4" /> : <Cake className="w-4 h-4" />}
            </motion.div>
            
            {/* Minimalist Indicator */}
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 scale-75 opacity-0 group-hover:opacity-100 transition-all duration-500">
               <ArrowRightLeft className="w-1.5 h-1.5 text-brand-charcoal" />
            </div>
          </motion.div>

          {/* Kinetic Label - Expands to the left */}
          <motion.div
            variants={{
              initial: { opacity: 0, width: 0, x: 10, filter: "blur(4px)" },
              hover: { opacity: 1, width: "auto", x: 0, filter: "blur(0px)" }
            }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden pr-4 z-10 hidden md:block"
          >
            <span className={cn(
              "text-[10px] font-black tracking-[0.3em] uppercase whitespace-nowrap transition-colors duration-500",
              isCakePage ? "text-brand-terracotta" : "text-brand-sand"
            )}>
              {targetName}
            </span>
          </motion.div>

          {/* Subtle Ambient Glow */}
          <div className={cn(
            "absolute right-0 w-10 h-10 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 z-0",
            isCakePage ? "bg-brand-terracotta" : "bg-brand-sand"
          )} />
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default BrandSwitcher;
