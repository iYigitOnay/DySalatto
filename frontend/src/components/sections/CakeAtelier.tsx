'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function CakeAtelier() {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
      {/* Background Parallax Image or Video Placeholder */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/forDYCake/header1.png" 
          className="w-full h-full object-cover scale-110" 
          alt="Chef's Atelier" 
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-sand text-[#110C08] mb-8 cursor-pointer hover:scale-110 transition-transform shadow-2xl"
        >
          <Play className="w-10 h-10 fill-current ml-1" />
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-xs font-black tracking-[0.5em] text-brand-sand uppercase mb-4"
        >
          Mutfaktaki Sanat
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-7xl font-serif text-white italic"
        >
          Şefin <span className="text-brand-sand not-italic font-sans font-black uppercase tracking-tighter">Atölyesi</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/40 text-lg mt-6 max-w-2xl mx-auto leading-relaxed"
        >
          Tatlının hazırlanışındaki o büyüleyici anlara tanık olun. Malzemenin sanata dönüştüğü o eşsiz yolculuğu izleyin.
        </motion.p>
      </div>

      {/* Floating Elements for Parallax feel */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[15%] w-32 h-32 border border-white/10 rounded-full"
      />
      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-[15%] w-48 h-48 border border-white/10 rounded-full"
      />
    </section>
  );
}
