'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const bowls = Array.from({ length: 21 }, (_, i) => ({
  id: i + 1,
  title: [
    "Protein Power", "Vegan Dream", "Ocean Breeze", "Detox Green", "Garden Fresh",
    "Sunset Bowl", "Wild Mix", "Berry Blast", "Zesty Tuna", "Crunchy Nut",
    "Spicy Chick", "Mediterranean", "Keto Choice", "Rainbow Veggie", "Super Grain",
    "Alpha Bowl", "Zen Salad", "Macho Meat", "Light Life", "Harvest Moon", "Dynamic Duo"
  ][i] || `Bowl No.${i + 1}`,
  subtitle: "Artisan Lezzet Serisi",
  desc: "Doğanın sunduğu en taze içeriklerle hazırlanan imza tarifimiz.",
  price: `${225 + (i * 5)} TL`,
  image: `/images/forDYSalatto/g${i + 1}.jpg`,
  accent: "brand-terracotta"
}));

const Kaselerimiz = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeBowl = bowls[activeIndex];

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % bowls.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + bowls.length) % bowls.length);

  return (
    <section className="min-h-screen md:h-screen w-full bg-brand-cream relative overflow-hidden flex flex-col items-center justify-center py-20 px-6">
      <div className="absolute inset-0 bg-[url('/images/grain.png')] opacity-[0.05] pointer-events-none" />
      
      {/* Background Decorative Text */}
      <div className="absolute top-10 left-10 opacity-[0.03] select-none pointer-events-none">
        <span className="text-[15vw] font-black uppercase tracking-tighter leading-none text-brand-charcoal">ARTISAN</span>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center relative z-10 h-full">
        
        {/* IMAGE: Mobile Order 1, Desktop Left */}
        <div className="order-first lg:order-none lg:col-span-5 relative group h-[300px] sm:h-[400px] md:h-[550px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBowl.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="w-full h-full relative max-w-[320px] sm:max-w-[420px]"
            >
              <div className="absolute inset-0 border-[6px] md:border-[12px] border-white shadow-2xl rounded-[32px] md:rounded-[60px] overflow-hidden bg-white/40 backdrop-blur-sm flex items-center justify-center">
                <img 
                  src={activeBowl.image} 
                  alt={activeBowl.title}
                  className="w-full h-full object-contain p-4 md:p-6 transform-gpu transition-transform duration-[2000ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Artisan Badge */}
              <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-16 h-16 md:w-24 md:h-24 bg-brand-terracotta rounded-full flex items-center justify-center shadow-xl animate-pulse z-20">
                <span className="text-white font-black text-[7px] md:text-[8px] tracking-widest text-center leading-tight uppercase">Taze <br/> Hasat</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CONTENT: Mobile Order 2, Desktop Right */}
        <div className="lg:col-span-7 flex flex-col justify-center gap-6 md:gap-10 overflow-hidden">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 md:gap-6">
              <div className="space-y-1 md:space-y-2">
                <motion.p 
                  key={`sub-${activeBowl.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[9px] md:text-xs font-black tracking-[0.4em] md:tracking-[0.5em] text-brand-terracotta uppercase"
                >
                  Koleksiyon (0{activeIndex + 1})
                </motion.p>
                <motion.h2 
                  key={`title-${activeBowl.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl sm:text-4xl md:text-7xl font-serif text-brand-charcoal italic leading-tight md:leading-none"
                >
                  {activeBowl.title}
                </motion.h2>
              </div>
              
              <motion.div 
                key={`price-${activeBowl.id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-charcoal text-brand-sand px-6 py-3 md:px-8 md:py-5 rounded-[24px] md:rounded-[32px] font-black text-xl md:text-4xl shadow-2xl self-start sm:self-auto border border-white/5"
              >
                {activeBowl.price}
              </motion.div>
            </div>
            
            <motion.p 
              key={`desc-${activeBowl.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-brand-charcoal/60 text-sm md:text-lg leading-relaxed font-medium max-w-xl"
            >
              {activeBowl.desc} Her bir malzemeyi özenle seçiyor, tabağınızı bir sanat eseri titizliğiyle işliyoruz.
            </motion.p>
          </div>

          {/* Mini Grid Navigation with Control Arrows */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pr-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-[1px] bg-brand-charcoal/20" />
                <span className="text-[10px] font-black tracking-widest text-brand-charcoal/40 uppercase">Menü Gezgini</span>
              </div>
              <div className="flex gap-3">
                <button onClick={handlePrev} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-brand-charcoal/10 flex items-center justify-center text-brand-charcoal/40 hover:bg-brand-charcoal hover:text-white transition-all shadow-sm">
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <button onClick={handleNext} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-brand-charcoal/10 flex items-center justify-center text-brand-charcoal/40 hover:bg-brand-charcoal hover:text-white transition-all shadow-sm">
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>
            
            <div className="relative group/grid overflow-hidden">
              <motion.div 
                drag="x"
                dragConstraints={{ left: -((bowls.length * 90) - 400), right: 0 }}
                className="flex gap-4 pb-6 cursor-grab active:cursor-grabbing"
              >
                {bowls.map((bowl, index) => (
                  <button
                    key={bowl.id}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-[16px] md:rounded-[24px] overflow-hidden border-2 transition-all duration-500",
                      activeIndex === index 
                        ? "border-brand-terracotta ring-4 ring-brand-terracotta/10 scale-110 shadow-xl z-10" 
                        : "border-transparent opacity-30 hover:opacity-100 grayscale hover:grayscale-0"
                    )}
                  >
                    <img src={bowl.image} alt={bowl.title} className="w-full h-full object-cover pointer-events-none" />
                  </button>
                ))}
              </motion.div>
              <div className="absolute right-0 top-0 bottom-6 w-24 bg-gradient-to-l from-brand-cream via-brand-cream/40 to-transparent pointer-events-none" />
            </div>
          </div>

          <div className="pt-2">
            <button className="w-full py-6 md:py-8 bg-brand-charcoal text-white rounded-[24px] md:rounded-[28px] font-black text-xs md:text-base tracking-[0.25em] hover:bg-brand-terracotta transition-all flex items-center justify-center gap-4 group shadow-[0_20px_50px_rgba(0,0,0,0.2)] uppercase">
              Siparişe Ekle <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
            </button>
          </div>
        </div>

      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Kaselerimiz;
