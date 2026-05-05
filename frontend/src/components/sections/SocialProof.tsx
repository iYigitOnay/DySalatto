"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

// Official Instagram SVG Icon - High Quality Path
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const instagramPosts = [
  { id: 1, img: "/images/forDYSalatto/g1.jpg", size: "col-span-1 row-span-1", url: "https://instagram.com/p/placeholder1" },
  { id: 2, img: "/images/forDYSalatto/g7.jpg", size: "col-span-1 row-span-2", url: "https://instagram.com/p/placeholder2" },
  { id: 3, img: "/images/forDYSalatto/g10.jpg", size: "col-span-2 row-span-1", url: "https://instagram.com/p/placeholder3" },
  { id: 4, img: "/images/forDYSalatto/g4.jpg", size: "col-span-1 row-span-1", url: "https://instagram.com/p/placeholder4" },
  { id: 5, img: "/images/forDYSalatto/g12.jpg", size: "col-span-1 row-span-1", url: "https://instagram.com/p/placeholder5" },
  { id: 6, img: "/images/forDYSalatto/g18.jpg", size: "col-span-1 row-span-2", url: "https://instagram.com/p/placeholder6" },
  { id: 7, img: "/images/forDYSalatto/g14.jpg", size: "col-span-2 row-span-1", url: "https://instagram.com/p/placeholder7" },
  { id: 8, img: "/images/forDYSalatto/g21.jpg", size: "col-span-1 row-span-1", url: "https://instagram.com/p/placeholder8" },
];

const SocialProof: React.FC = () => {
  return (
    <section className="h-screen w-full bg-brand-cream relative overflow-hidden flex flex-col items-center justify-center py-16 md:py-20 px-6">
      {/* Artisan Grain Texture */}
      <div className="absolute inset-0 bg-[url('/images/grain.png')] opacity-[0.05] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full relative z-10">
        
        {/* Professional Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-10 md:mb-12 gap-8 shrink-0">
          <div className="max-w-xl">
            <p className="text-[10px] md:text-xs font-black tracking-[0.5em] text-brand-terracotta uppercase mb-4">
              Kadrajınızdan
            </p>
            <h2 className="text-4xl md:text-7xl font-serif text-brand-charcoal italic leading-tight">
              Sosyal'de <span className="text-brand-terracotta not-italic font-sans font-black uppercase tracking-tighter">Biz</span>
            </h2>
          </div>
          <a
            href="https://instagram.com/dysalatto"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-[10px] font-black tracking-[0.2em] text-brand-charcoal uppercase border-b-2 border-brand-terracotta pb-2 hover:text-brand-terracotta transition-colors"
          >
            <InstagramIcon className="w-4 h-4" /> @DYSALATTO
          </a>
        </div>

        {/* Cinematic Bento Grid */}
        <div className="grow grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 auto-rows-fr overflow-hidden pb-4">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.05,
                duration: 0.6,
                ease: [0.23, 1, 0.32, 1]
              }}
              className={cn(
                "relative overflow-hidden group rounded-[32px] md:rounded-[48px] shadow-xl transform-gpu transition-all duration-500 block",
                post.size
              )}
            >
              <img
                src={post.img}
                alt={`Instagram Moment ${post.id}`}
                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 will-change-transform"
              />
              
              {/* Premium Hover Overlay with Instagram Icon */}
              <div className="absolute inset-0 bg-brand-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[3px]">
                <motion.div 
                  className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-500"
                >
                  <InstagramIcon className="w-6 h-6" />
                </motion.div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Background Decorative Accent */}
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-brand-terracotta/5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
};

export default SocialProof;
