'use client';

import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: "01",
    title: "Lezzetini Seç",
    desc: "Menümüzdeki hazır tariflerden birini seç veya kendi kaseni oluşturmaya başla.",
    color: "bg-brand-terracotta"
  },
  {
    number: "02",
    title: "Sanatını Konuştur",
    desc: "Sevdiğin malzemeleri ekle, istemediklerini çıkar. Soslarla son dokunuşu yap.",
    color: "bg-brand-sand"
  },
  {
    number: "03",
    title: "Tazeliği Hisset",
    desc: "Özenle hazırlanan kasen en taze haliyle kapına gelsin, afiyetle ye.",
    color: "bg-brand-terracotta-dark"
  }
];

const StepByStep: React.FC = () => {
  return (
    <section className="py-24 bg-brand-charcoal overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-xs font-black tracking-[0.5em] text-brand-terracotta uppercase mb-6">Süreç</p>
          <h2 className="text-4xl md:text-6xl font-serif text-white italic leading-tight">
            3 Adımda <span className="text-brand-terracotta not-italic font-sans font-black uppercase tracking-tighter">Mükemmellik</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="absolute top-24 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative z-10 text-center group"
            >
              <div className="flex justify-center mb-10">
                <div className={`w-24 h-24 rounded-full ${step.color} flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-500`}>
                  <span className="text-4xl font-black text-white mix-blend-overlay opacity-50 absolute -right-2 -bottom-2">
                    {step.number}
                  </span>
                  <span className="text-2xl font-black text-white relative z-10">
                    {step.number}
                  </span>
                  
                  {/* Pulse Effect */}
                  <div className={`absolute inset-0 ${step.color} animate-ping opacity-20`} />
                </div>
              </div>

              <h3 className="text-2xl font-serif text-white mb-4 italic">{step.title}</h3>
              <p className="text-white/40 leading-relaxed max-w-[280px] mx-auto">
                {step.desc}
              </p>

              {/* Mobile Connector (Mobile Only) */}
              {index < steps.length - 1 && (
                <div className="h-12 w-[1px] bg-white/10 mx-auto my-8 md:hidden" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepByStep;
