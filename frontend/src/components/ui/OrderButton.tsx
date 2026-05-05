'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// --- Types ---
interface OrderButtonProps {
  className?: string;
  isScrolled?: boolean;
  children: React.ReactNode;
}

const BOWL_ASSETS = [
  { id: 1, name: 'Protein Bowl', img: '/images/Ekran görüntüsü 2026-05-01 142706.png', offset: { x: -60, y: -50 } },
  { id: 2, name: 'Veggie Bowl', img: '/images/Ekran görüntüsü 2026-05-01 142720.png', offset: { x: 60, y: -50 } },
  { id: 3, name: 'Tropical Bowl', img: '/images/Ekran görüntüsü 2026-05-01 142729.png', offset: { x: 0, y: 55 } },
];

const PopOutBowl = ({ img, offset, delay }: { img: string; offset: { x: number; y: number }; delay: number }) => (
  <motion.div
    initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
    animate={{ 
      scale: 1, 
      x: offset.x, 
      y: offset.y, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 200, 
        damping: 15, 
        delay: delay 
      }
    }}
    exit={{ scale: 0, x: 0, y: 0, opacity: 0 }}
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
  >
    <motion.div
      animate={{ 
        y: [0, -8, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className="relative w-14 h-14 rounded-full border-2 border-white shadow-xl overflow-hidden bg-white"
    >
      <img src={img} alt="Bowl" className="w-full h-full object-cover" />
    </motion.div>
  </motion.div>
);

const OrderButton = ({ children, className, isScrolled }: OrderButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pop-out Bowls Layer */}
      <AnimatePresence>
        {isHovered && BOWL_ASSETS.map((bowl, index) => (
          <PopOutBowl 
            key={bowl.id} 
            img={bowl.img} 
            offset={bowl.offset} 
            delay={index * 0.1} 
          />
        ))}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative z-10 bg-[#D35400] text-white font-black rounded-xl shadow-lg transition-all duration-300",
          "hover:bg-[#E67E22] hover:shadow-[0_0_30px_rgba(211,84,0,0.5)]",
          isScrolled ? "px-6 py-2.5 text-[10px]" : "px-10 py-4 text-[11px]",
          className
        )}
      >
        <span className="relative z-20 tracking-[0.2em] uppercase">{children}</span>
        
        {/* Subtle Shine Effect */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "linear" }}
            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          />
        </div>
      </motion.button>
    </div>
  );
};

export default OrderButton;
