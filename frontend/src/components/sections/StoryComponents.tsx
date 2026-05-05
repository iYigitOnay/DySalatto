'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ShieldCheck, Heart, Leaf, Star } from 'lucide-react';

interface StorySectionProps {
  title: string;
  subtitle: string;
  desc: string;
  brand: 'salatto' | 'cake';
  image: string;
  reversed?: boolean;
}

const StorySection = ({ title, subtitle, desc, brand, image, reversed }: StorySectionProps) => {
  const isCake = brand === 'cake';
  const accentText = isCake ? 'text-brand-sand' : 'text-brand-terracotta';

  return (
    <section className={cn(
      "py-24 md:py-40 flex flex-col md:flex-row items-center gap-12 md:gap-24 px-6 max-w-7xl mx-auto",
      reversed && "md:flex-row-reverse"
    )}>
      <motion.div 
        initial={{ opacity: 0, x: reversed ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex-1 space-y-6"
      >
        <p className={cn("text-[10px] font-black tracking-[0.5em] uppercase", accentText)}>{subtitle}</p>
        <h2 className="text-4xl md:text-6xl font-serif text-white italic leading-tight">{title}</h2>
        <p className="text-white/40 text-lg leading-relaxed max-w-xl">{desc}</p>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="flex-1 relative aspect-[4/5] md:aspect-square w-full rounded-[40px] overflow-hidden"
      >
        <img src={image} className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700" alt={title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </motion.div>
    </section>
  );
};

const Manifesto = ({ brand }: { brand: 'salatto' | 'cake' }) => {
  const isCake = brand === 'cake';
  const accentColor = isCake ? 'bg-brand-sand text-[#110C08]' : 'bg-brand-terracotta text-white';
  
  const rules = isCake ? [
    { icon: <ShieldCheck />, title: "Sıfır Rafine Şeker", desc: "Sadece doğanın sunduğu en saf tatlandırıcılar." },
    { icon: <Heart />, title: "Gerçek Çikolata", desc: "Yüksek kakao oranlı Belçika artisan çikolatası." },
    { icon: <Star />, title: "Artisan Teknik", desc: "Fabrikasyon değil, her ürün elde ve butik üretim." }
  ] : [
    { icon: <Leaf />, title: "Tarladan Tabağa", desc: "Sabahın ilk ışıklarıyla hasat edilmiş sebzeler." },
    { icon: <ShieldCheck />, title: "Sıfır Konserve", desc: "Mutfağımıza dondurulmuş veya hazır gıda giremez." },
    { icon: <Heart />, title: "Zeytinyağı Aşkı", desc: "Sadece butik üreticiden soğuk sıkım erken hasat." }
  ];

  return (
    <section className="py-32 bg-[#0a0a0a] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 text-center mb-24">
        <p className="text-xs font-black tracking-[0.5em] text-white/20 uppercase mb-4">Değerlerimiz</p>
        <h2 className="text-5xl md:text-7xl font-serif text-white italic">Marka <span className={isCake ? 'text-brand-sand' : 'text-brand-terracotta'}>Manifestosu</span></h2>
      </div>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {rules.map((rule, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group text-center"
          >
            <div className={cn("w-16 h-16 rounded-2xl mx-auto mb-8 flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xl", accentColor)}>
              {React.cloneElement(rule.icon as React.ReactElement, { className: "w-8 h-8" })}
            </div>
            <h4 className="text-xl font-bold text-white mb-4">{rule.title}</h4>
            <p className="text-white/40 text-sm leading-relaxed">{rule.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default { StorySection, Manifesto };
export { StorySection, Manifesto };
