'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Leaf, Droplets, Palette, ArrowRight } from 'lucide-react';

const stories = [
  {
    id: 'harvest',
    number: '01',
    title: 'Günlük Hasat',
    subtitle: 'Doğanın Saf Dokunuşu',
    desc: 'Her sabah güneş doğarken tarladan seçilen en taze sebzelerle, doğanın gerçek lezzetini tabağınıza taşıyoruz.',
    icon: <Leaf className="w-6 h-6" />,
    image: '/images/forDYSalatto/fels_bir.png',
    color: 'brand-terracotta'
  },
  {
    id: 'sauce',
    number: '02',
    title: 'Özel Soslar',
    subtitle: 'Şefin Gizli İmzası',
    desc: 'Koruyucu içermeyen, tamamen doğal malzemelerle hazırlanan imza soslarımız, her kaseyi benzersiz kılar.',
    icon: <Droplets className="w-6 h-6" />,
    image: '/images/forDYSalatto/fels_iki.png',
    color: 'brand-sand'
  },
  {
    id: 'art',
    number: '03',
    title: 'Estetik Sunum',
    subtitle: 'Görsel Bir Şölen',
    desc: 'Beslenmenin bir deneyim olduğuna inanıyoruz. Renk paletlerimizle her kaseyi bir sanat eserine dönüştürüyoruz.',
    icon: <Palette className="w-6 h-6" />,
    image: '/images/forDYSalatto/fels_uc.png',
    color: 'white'
  }
];

const Philosophy: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate stories every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stories.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="h-screen w-full bg-brand-charcoal overflow-hidden flex flex-col lg:flex-row relative">
      <div className="absolute inset-0 bg-[url('/images/grain.png')] opacity-[0.02] pointer-events-none" />

      {/* LEFT: Story Content (40%) */}
      <div className="w-full lg:w-[40%] h-full flex flex-col justify-center px-8 md:px-20 relative z-10 border-r border-white/5">
        <div className="mb-16">
          <p className="text-[10px] font-black tracking-[0.5em] text-brand-terracotta uppercase mb-4">Felsefemiz</p>
          <h2 className="text-4xl md:text-5xl font-serif text-white italic leading-tight">
            Tazeliğin <br /> <span className="text-brand-terracotta not-italic font-sans font-black uppercase tracking-tighter">Artisan Ruhu</span>
          </h2>
        </div>

        <div className="space-y-4">
          {stories.map((story, i) => (
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
                  activeIndex === i ? "text-brand-terracotta" : "text-white/20"
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
                        {/* Progress Bar */}
                        <div className="w-full h-[1px] bg-white/10 mt-6 relative overflow-hidden">
                          <motion.div 
                            key={`progress-${i}`}
                            initial={{ x: '-100%' }}
                            animate={{ x: '0%' }}
                            transition={{ duration: 6, ease: "linear" }}
                            className="absolute inset-0 bg-brand-terracotta"
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

      {/* RIGHT: Visual Showcase (60%) */}
      <div className="w-full lg:w-[60%] h-full relative overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0 transform-gpu"
          >
            <img 
              src={stories[activeIndex].image} 
              className="w-full h-full object-cover" 
              alt={stories[activeIndex].title} 
            />
            {/* Cinematic Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 bg-black/20" />
            
            {/* Artistic Floating Label */}
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-16 right-16 flex items-center gap-6"
            >
              <div className="text-right">
                <p className="text-xs font-black tracking-[0.4em] text-brand-sand uppercase mb-1">{stories[activeIndex].subtitle}</p>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">DySalatto Artisan Philosophy</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-brand-terracotta shadow-2xl">
                {stories[activeIndex].icon}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Decorative corner element */}
        <div className="absolute top-0 right-0 w-32 h-32 border-r border-t border-white/10 m-12 pointer-events-none" />
      </div>
    </section>
  );
};

export default Philosophy;
