"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight, Utensils, Cake } from "lucide-react";
import Link from "next/link";

const SplitPortal = () => {
  const [hovered, setHovered] = useState<"salatto" | "cake" | null>(null);

  const sections = [
    {
      id: "salatto",
      title: "DYSalatto",
      subtitle: "Tazeliğin Sanatı",
      description:
        "Günlük hasat sebzeler, protein dolu kaseler ve şefin imza soslarıyla tanışın.",
      image: "/images/forDYSalatto/header1.jpg",
      icon: <Utensils className="w-6 h-6" />,
      color: "brand-terracotta",
      href: "/salatto",
    },
    {
      id: "cake",
      title: "DYCake",
      subtitle: "Tatlı Bir Başyapıt",
      description:
        "Rafine şekersiz, glutensiz ve tamamen doğal malzemelerle hazırlanan artisan tatlılar.",
      image: "/images/forDYCake/header1.png",
      icon: <Cake className="w-6 h-6" />,
      color: "brand-sand",
      href: "/cake",
    },
  ];

  return (
    <main className="relative w-full h-screen md:h-[100dvh] overflow-hidden bg-brand-charcoal flex flex-col md:flex-row">
      {sections.map((section) => {
        const isHovered = hovered === section.id;
        const isOtherHovered = hovered !== null && hovered !== section.id;

        return (
          <Link
            key={section.id}
            href={section.href}
            className="block relative h-1/2 md:h-full overflow-hidden"
            onMouseEnter={() => setHovered(section.id as any)}
            onMouseLeave={() => setHovered(null)}
            style={{ flex: 1 }}
          >
            <motion.div
              animate={{
                // Mobile: Vertical height flex | Desktop: Horizontal width flex
                flex: isHovered ? 4 : isOtherHovered ? 1 : 2.5,
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 25,
                mass: 1,
              }}
              className="relative w-full h-full overflow-hidden"
            >
              {/* Background with Zoom Effect */}
              <motion.div
                className="absolute inset-0 z-0"
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  filter: isHovered
                    ? "brightness(0.8) contrast(1.1)"
                    : "brightness(0.4) contrast(1)",
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <img
                  src={section.image}
                  alt={`${section.title} - ${section.subtitle}`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div
                  className={cn(
                    "absolute inset-0 transition-opacity duration-700",
                    section.id === "salatto"
                      ? "bg-gradient-to-r from-black/80 via-transparent to-transparent"
                      : "bg-gradient-to-l from-black/80 via-transparent to-transparent",
                  )}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </motion.div>

              {/* Text Content Overlay */}
              <div
                className={cn(
                  "relative z-10 h-full w-full p-8 md:p-20 flex flex-col justify-end pointer-events-none",
                  isOtherHovered && "md:opacity-0",
                )}
              >
                <motion.div
                  layout
                  initial={false}
                  animate={{
                    y: isHovered ? 0 : 20,
                    opacity: isOtherHovered ? 0 : 1,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={cn(
                        "p-3 rounded-full backdrop-blur-md border border-white/20",
                        section.id === "salatto"
                          ? "text-brand-terracotta"
                          : "text-brand-sand",
                      )}
                    >
                      {section.icon}
                    </div>
                    <span className="text-[10px] md:text-xs font-black tracking-[0.4em] uppercase text-white/80">
                      {section.subtitle}
                    </span>
                  </div>

                  <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase mb-6 leading-none">
                    {section.title}
                  </h2>

                  {/* Desktop Expanded Content */}
                  <div className="hidden md:block">
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-white/60 text-lg mb-8 max-w-lg leading-relaxed font-medium">
                            {section.description}
                          </p>
                          <div
                            className={cn(
                              "inline-flex items-center gap-4 px-10 py-5 rounded-full text-white font-black text-xs tracking-widest border border-white/20 backdrop-blur-sm group-hover:scale-105 transition-all duration-300",
                              section.id === "salatto"
                                ? "hover:bg-brand-terracotta"
                                : "hover:bg-brand-sand hover:text-brand-charcoal",
                            )}
                          >
                            KEŞFETMEYE BAŞLA <ArrowRight className="w-4 h-4" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Mobile Action (Always visible on mobile) */}
                  <div className="md:hidden mt-4">
                    <div className="text-[10px] font-black text-white/40 tracking-widest uppercase flex items-center gap-2">
                      DOKUN VE KEŞFET <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Vertical Title for Small Columns (Desktop) */}
              <div className="hidden md:block">
                <AnimatePresence>
                  {isOtherHovered && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <span className="text-3xl font-black text-white/10 uppercase tracking-[0.6em] rotate-90 whitespace-nowrap">
                        {section.title}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </Link>
        );
      })}

      {/* Floating Center Identity */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none hidden md:flex flex-col items-center gap-8">
        <div className="w-[1px] h-24 bg-gradient-to-t from-white/40 to-transparent" />
        <div className="w-16 h-16 rounded-full border border-white/20 backdrop-blur-xl flex items-center justify-center bg-white/5">
          <span className="text-white font-black text-xl tracking-tighter">
            DY
          </span>
        </div>
        <div className="w-[1px] h-24 bg-gradient-to-b from-white/40 to-transparent" />
      </div>

      {/* SEO & Accessibility: Screen Reader Only content */}
      <div className="sr-only">
        <h1>DySalatto & DyCake - Artisan Lezzetler Portalı</h1>
        <p>
          Taze salata kaseleri ve şekersiz artisan tatlılar için seçim yapın.
        </p>
      </div>
    </main>
  );
};

export default SplitPortal;
