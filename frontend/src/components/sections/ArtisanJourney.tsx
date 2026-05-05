'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowLeft, ShoppingBag, Palette, Heart, Sparkles } from 'lucide-react';
import WetPaintButton from '../ui/WetPaintButton';

const journeySteps = [
  {
    id: 'select',
    number: '01',
    title: 'Lezzetini Seç',
    subtitle: 'Keşif Başlıyor',
    desc: 'Menümüzdeki imza tariflerden birini seçin veya hayalinizdeki kasenin temellerini atın. Her şey en taze içeriklerle başlar.',
    icon: <ShoppingBag className="w-8 h-8" />,
    image: '/images/forDYSalatto/g11.jpg',
  },
  {
    id: 'customize',
    number: '02',
    title: 'Sanatını Konuştur',
    subtitle: 'Kişisel Dokunuş',
    desc: 'Proteinlerden soslara, taze yeşilliklerden çıtır tohumlara kadar her detayı siz belirleyin. Sınır sadece hayal gücünüz.',
    icon: <Palette className="w-8 h-8" />,
    image: '/images/forDYSalatto/g13.jpg',
  },
  {
    id: 'enjoy',
    number: '03',
    title: 'Anın Tadını Çıkar',
    subtitle: 'Mükemmel Bitiş',
    desc: 'Özenle paketlenen taze sanat eseriniz kapınıza gelsin, size sadece bu benzersiz deneyimi yaşamak kalsın.',
    icon: <Heart className="w-8 h-8" />,
    image: '/images/forDYSalatto/g15.jpg',
  }
];

const ArtisanJourney: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for back, 1 for next

  const paginate = (newDirection: number) => {
    const nextStep = currentStep + newDirection;
    if (nextStep >= 0 && nextStep < journeySteps.length) {
      setDirection(newDirection);
      setCurrentStep(nextStep);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    })
  };

  const step = journeySteps[currentStep];

  return (
    <section className="h-screen w-full bg-[#050505] relative overflow-hidden px-6 flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('/images/grain.png')] opacity-[0.02] pointer-events-none" />
      
      <div className="max-w-6xl w-full">
        {/* 1. Header & Step Indicators */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <p className="text-[10px] font-black tracking-[0.5em] text-brand-terracotta uppercase mb-4">Süreç</p>
            <h2 className="text-3xl md:text-5xl font-serif text-white italic leading-tight">Nasıl <span className="text-brand-terracotta not-italic font-sans font-black uppercase tracking-tighter">İşliyoruz?</span></h2>
          </div>

          {/* Minimalist Indicators */}
          <div className="flex items-center gap-4">
            {journeySteps.map((_, i) => (
              <div key={i} className="flex items-center">
                <button
                  onClick={() => {
                    setDirection(i > currentStep ? 1 : -1);
                    setCurrentStep(i);
                  }}
                  className={cn(
                    "w-10 h-10 rounded-full border transition-all duration-500 flex items-center justify-center text-[11px] font-black",
                    currentStep === i 
                      ? "bg-brand-terracotta border-brand-terracotta text-white shadow-[0_0_20px_rgba(211,84,0,0.4)]" 
                      : "border-white/10 text-white/30 hover:border-white/30"
                  )}
                >
                  0{i + 1}
                </button>
                {i < journeySteps.length - 1 && (
                  <div className="w-8 h-[1px] bg-white/5 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 2. Content Box */}
        <div className="bg-brand-charcoal border border-white/5 rounded-[48px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col md:flex-row min-h-[500px] md:h-[550px] transform-gpu"
            >
              {/* Image Side */}
              <div className="w-full md:w-1/2 h-[250px] md:h-full relative overflow-hidden group">
                <motion.img 
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.2 }}
                  src={step.image} 
                  className="w-full h-full object-cover" 
                  alt={step.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-brand-charcoal via-transparent to-transparent" />
                
                <div className="absolute top-8 left-8 w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-brand-terracotta">
                  {step.icon}
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                <div className="mb-8">
                  <span className="text-[10px] font-black tracking-[0.5em] text-brand-terracotta uppercase block mb-4">Adım 0{currentStep + 1}</span>
                  <h3 className="text-3xl md:text-5xl font-serif text-white italic leading-tight">{step.title}</h3>
                </div>
                
                <p className="text-brand-sand text-xs font-black tracking-[0.3em] uppercase mb-8">{step.subtitle}</p>
                <p className="text-white/40 text-sm md:text-base leading-relaxed mb-10 max-w-sm font-medium">{step.desc}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  {currentStep === journeySteps.length - 1 ? (
                    <WetPaintButton isScrolled={false} className="px-10 py-5 text-[11px]">TASARLAMAYA BAŞLA</WetPaintButton>
                  ) : (
                    <button 
                      onClick={() => paginate(1)}
                      className="flex items-center gap-4 text-[11px] font-black tracking-widest uppercase text-white/30 hover:text-white transition-all duration-500"
                    >
                      SONRAKİ ADIM <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {/* Desktop Prev Button */}
                  {currentStep > 0 && (
                    <button 
                      onClick={() => paginate(-1)}
                      className="hidden md:flex items-center gap-2 text-[10px] font-black text-white/10 hover:text-white/30 transition-colors uppercase tracking-widest"
                    >
                      <ArrowLeft className="w-4 h-4" /> Önceki
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ArtisanJourney;
