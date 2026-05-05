'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles, Cookie, Heart } from 'lucide-react';

const cakeStories = [
  {
    id: 'sweet',
    number: '01',
    title: 'Doğal Tatlılık',
    subtitle: 'Ruhunuzu Besleyin',
    desc: 'Rafine şeker yerine doğanın sunduğu en kaliteli tatlandırıcıları kullanarak, lezzetten ödün vermeden sağlığınızı koruyoruz.',
    icon: <Sparkles className="w-6 h-6" />,
    image: '/images/forDYCake/header1.png', // Placeholder
    color: 'brand-sand'
  },
  {
    id: 'guilt-free',
    number: '02',
    title: 'Suçluluk Hissetme',
    subtitle: 'Hafif ve Lezzetli',
    desc: 'Glutensiz ve diyet dostu seçeneklerimizle, tatlı kaçamaklarınızı suçluluk hissetmeden bir şölene dönüştürün.',
    icon: <Cookie className="w-6 h-6" />,
    image: '/images/forDYCake/header1.png', // Placeholder
    color: 'white'
  },
  {
    id: 'passion',
    number: '03',
    title: 'Artisan Tutku',
    subtitle: 'Her Lokmada Sanat',
    desc: 'Butik pastacılık anlayışımızla, her ürünü bir sanat eseri titizliğiyle ve büyük bir tutkuyla hazırlıyoruz.',
    icon: <Heart className="w-6 h-6" />,
    image: '/images/forDYCake/header1.png', // Placeholder
    color: 'brand-sand'
  }
];

export default function CakePhilosophy() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cakeStories.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="h-screen w-full bg-[#0a0a0a] overflow-hidden flex flex-col lg:flex-row relative">
      <div className="w-full lg:w-[40%] h-full flex flex-col justify-center px-8 md:px-20 relative z-10 border-r border-white/5">
        <div className="mb-16">
          <p className="text-[10px] font-black tracking-[0.5em] text-brand-sand uppercase mb-4">Felsefemiz</p>
          <h2 className="text-4xl md:text-5xl font-serif text-white italic leading-tight">
            Suçluluk <br /> <span className="text-brand-sand not-italic font-sans font-black uppercase tracking-tighter">Hissetmeden Şımar</span>
          </h2>
        </div>

        <div className="space-y-4">
          {cakeStories.map((story, i) => (
            <div 
              key={story.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "group cursor-pointer p-6 rounded-3xl transition-all duration-500 border border-transparent",
                activeIndex === i ? "bg-white/[0.03] border-white/10 shadow-2xl" : "hover:bg-white/[0.01]"
              )}
            >
              <div className="flex items-center gap-6">
                <span className={cn(
                  "text-xs font-black tracking-widest transition-colors duration-500",
                  activeIndex === i ? "text-brand-sand" : "text-white/20"
                )}>
                  {story.number}
                </span>
                
                <div>
                  <h3 className={cn(
                    "text-xl font-serif italic transition-all duration-500",
                    activeIndex === i ? "text-white" : "text-white/40"
                  )}>
                    {story.title}
                  </h3>
                  
                  <AnimatePresence>
                    {activeIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-white/40 text-sm mt-3 leading-relaxed max-w-[280px]">
                          {story.desc}
                        </p>
                        <div className="w-full h-[1px] bg-white/10 mt-6 relative overflow-hidden">
                          <motion.div 
                            key={`progress-${i}`}
                            initial={{ x: '-100%' }}
                            animate={{ x: '0%' }}
                            transition={{ duration: 6, ease: "linear" }}
                            className="absolute inset-0 bg-brand-sand"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-[60%] h-full relative overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img 
              src={cakeStories[activeIndex].image} 
              className="w-full h-full object-cover opacity-60" 
              alt={cakeStories[activeIndex].title} 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent opacity-80" />
            
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-16 right-16 flex items-center gap-6"
            >
              <div className="text-right">
                <p className="text-xs font-black tracking-[0.4em] text-brand-sand uppercase mb-1">{cakeStories[activeIndex].subtitle}</p>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">DyCake Artisan Philosophy</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-brand-sand shadow-2xl">
                {cakeStories[activeIndex].icon}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
