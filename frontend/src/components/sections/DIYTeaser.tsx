'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight, Sparkles, MousePointer2 } from 'lucide-react';
import WetPaintButton from '../ui/WetPaintButton';
import { useRouter } from 'next/navigation';

const DIYTeaser: React.FC = () => {
  const router = useRouter();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms for different layers
  const yBg = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const yFast = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const rotateFast = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={containerRef} 
      className="h-screen w-full bg-brand-charcoal overflow-hidden relative flex items-center justify-center py-20 px-6"
    >
      {/* 1. Background Layer (Deep) */}
      <motion.div 
        style={{ y: yBg, opacity }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <img 
          src="/images/forDYSalatto/header1.jpg" 
          className="w-full h-full object-cover opacity-10 scale-110" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal via-transparent to-brand-charcoal" />
      </motion.div>

      {/* 2. Middle Layer (Ingredients - Back) */}
      <motion.div style={{ y: yMid, opacity }} className="absolute inset-0 z-10 pointer-events-none">
         {/* Floating Avocado - Back */}
         <motion.div 
           animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
           transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-1/4 left-[15%] w-48 h-48 opacity-20 blur-sm"
         >
           <img src="/images/forDYSalatto/g2.jpg" className="w-full h-full object-cover rounded-full" alt="" />
         </motion.div>
         {/* Floating Bowl - Back */}
         <motion.div 
           animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
           transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
           className="absolute bottom-1/4 right-[10%] w-64 h-64 opacity-10 blur-md"
         >
           <img src="/images/forDYSalatto/g5.jpg" className="w-full h-full object-cover rounded-full" alt="" />
         </motion.div>
      </motion.div>

      {/* 3. Main Content Layer */}
      <div className="relative z-20 max-w-4xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <Sparkles className="w-5 h-5 text-brand-terracotta animate-pulse" />
            <span className="text-[10px] md:text-xs font-black tracking-[0.5em] text-brand-terracotta uppercase">Atölye Deneyimi</span>
            <Sparkles className="w-5 h-5 text-brand-terracotta animate-pulse" />
          </div>

          <h2 className="text-5xl md:text-8xl font-serif text-white italic leading-tight mb-8">
            Kendi Kaseni <br />
            <span className="text-brand-terracotta not-italic font-sans font-black uppercase tracking-tighter block mt-2">Bir Tuval Gibi İşle</span>
          </h2>

          <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-16 font-medium">
            Damak zevkiniz bizim paletimiz. Taze malzemeler, proteinler ve imza soslarla tamamen size özel bir sanat eseri yaratalım.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <WetPaintButton 
              onClick={() => router.push('/salatto/kendin-tasarla')}
              isScrolled={false} 
              className="px-12 py-6 text-sm"
            >
              TASARLAMAYA BAŞLA
            </WetPaintButton>
            
            <div className="flex items-center gap-4 text-white/30 group cursor-default">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brand-sand transition-colors">
                <MousePointer2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black tracking-widest uppercase">İnteraktif Seçim Ekranı</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 4. Front Layer (Ingredients - Sharp & Fast) */}
      <motion.div style={{ y: yFast, rotate: rotateFast, opacity }} className="absolute inset-0 z-30 pointer-events-none">
          {/* Sharp Protein Item */}
          <div className="absolute top-[10%] right-[20%] w-32 h-32 shadow-2xl transform-gpu">
             <img src="/images/forDYSalatto/g1.jpg" className="w-full h-full object-cover rounded-3xl border-2 border-white/10" alt="" />
             <div className="absolute -top-4 -right-4 bg-brand-terracotta text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Protein</div>
          </div>
          
          {/* Sharp Green Item */}
          <div className="absolute bottom-[15%] left-[15%] w-40 h-40 shadow-2xl transform-gpu rotate-12">
             <img src="/images/forDYSalatto/g4.jpg" className="w-full h-full object-cover rounded-full border-2 border-white/10" alt="" />
             <div className="absolute -bottom-4 -left-4 bg-brand-sand text-brand-charcoal text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Taze Hasat</div>
          </div>

          {/* Floating Leaves or Seeds (Abstract representation) */}
          <div className="absolute top-1/2 left-[5%] w-4 h-4 bg-brand-terracotta rounded-full blur-[2px] opacity-40 animate-pulse" />
          <div className="absolute top-1/3 right-[5%] w-6 h-6 bg-brand-sand rounded-full blur-[3px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </motion.div>

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-[url('/images/grain.png')] opacity-[0.03] pointer-events-none" />
    </section>
  );
};

export default DIYTeaser;
