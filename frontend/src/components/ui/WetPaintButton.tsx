'use client';

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Props for the Drip component
type DripProps = {
  left: string;
  height: number;
  delay: number;
  colorClass: string;
};

// The Drip component creates the animated dripping effect
const Drip: React.FC<DripProps> = ({ left, height, delay, colorClass }) => {
  return (
    <motion.div
      className="absolute top-[98%] origin-top z-0"
      style={{ left }}
      initial={{ scaleY: 0.75 }}
      animate={{ scaleY: [0.75, 1, 0.75] }}
      transition={{
        duration: 3,
        times: [0, 0.4, 1],
        delay,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 1,
      }}
    >
      {/* The main body of the drip */}
      <div
        style={{ height }}
        className={cn("w-2 rounded-b-full transition-colors duration-300", colorClass)}
      />

      {/* SVG for the right-side curve of the drip */}
      <svg
        width="6"
        height="6"
        viewBox="0 0 6 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-full top-0"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.4 0H0V5.4C0 2.41765 2.41766 0 5.4 0Z"
          className={cn("transition-colors duration-300", colorClass.replace('bg-', 'fill-'))}
        />
      </svg>

      {/* SVG for the left-side curve of the drip */}
      <svg
        width="6"
        height="6"
        viewBox="0 0 6 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute right-full top-0 rotate-90"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.4 0H0V5.4C0 2.41765 2.41766 0 5.4 0Z"
          className={cn("transition-colors duration-300", colorClass.replace('bg-', 'fill-'))}
        />
      </svg>
      
      {/* A smaller, detached droplet that falls */}
      <motion.div
        initial={{ y: -4, opacity: 0 }}
        animate={{ y: [-4, 40], opacity: [0, 1, 0] }}
        transition={{
          duration: 3,
          times: [0, 0.3, 1],
          delay,
          ease: "easeIn",
          repeat: Infinity,
          repeatDelay: 1,
        }}
        className={cn("absolute top-full h-2 w-2 rounded-full transition-colors duration-300", colorClass)}
      />
    </motion.div>
  );
};

const WetPaintButton = ({ 
  children, 
  className, 
  isScrolled,
  theme = 'salatto'
}: { 
  className?: string; 
  children: React.ReactNode; 
  isScrolled: boolean;
  theme?: 'salatto' | 'cake';
}) => {
  // Brand colors logic
  const isCake = theme === 'cake';
  
  const baseColor = isCake ? "bg-brand-sand" : "bg-brand-terracotta";
  const textColor = isCake ? "text-[#110C08]" : "text-white";
  const shadowColor = isCake ? "hover:shadow-[0_0_25px_rgba(245,222,179,0.4)]" : "hover:shadow-[0_0_25px_rgba(211,84,0,0.4)]";
  
  const dripColor = isCake ? "bg-brand-sand" : "bg-brand-terracotta";
  const dripColorHover = isCake ? "group-hover:bg-white" : "group-hover:bg-brand-terracotta-dark";

  return (
    <button className={cn(
      "group relative rounded-full font-black transition-all duration-500 overflow-visible shadow-lg",
      shadowColor,
      isScrolled ? "px-6 py-2 text-[9px]" : "px-8 py-3 text-[10px]",
      baseColor,
      textColor,
      className
    )}>
      {/* Label - Always on Top (z-30) */}
      <span className="relative z-30 tracking-[0.2em] uppercase">{children}</span>
      
      {/* Background fill container - Shine effect only (z-10) */}
      <div className="absolute inset-0 rounded-full overflow-hidden z-10 pointer-events-none">
        {/* Subtle Shine Effect (Animated on Hover) */}
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "linear" }}
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      {/* Drips - Visible outside but layered properly (z-20) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <Drip left="15%" height={18} delay={0.5} colorClass={cn(dripColor, dripColorHover)} />
        <Drip left="35%" height={14} delay={2.5} colorClass={cn(dripColor, dripColorHover)} />
        <Drip left="65%" height={10} delay={3.8} colorClass={cn(dripColor, dripColorHover)} />
        <Drip left="85%" height={16} delay={1.2} colorClass={cn(dripColor, dripColorHover)} />
      </div>
    </button>
  );
};

export default WetPaintButton;
