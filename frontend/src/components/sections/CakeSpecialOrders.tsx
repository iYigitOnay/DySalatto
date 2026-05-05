'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Gift, Star } from 'lucide-react';

export default function CakeSpecialOrders() {
  return (
    <section className="py-32 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: Content */}
          <div>
            <p className="text-xs font-black tracking-[0.5em] text-brand-sand uppercase mb-4">Özel Kutlamalar</p>
            <h2 className="text-4xl md:text-6xl font-serif text-white italic mb-8">
              Artisan <span className="text-brand-sand not-italic font-sans font-black uppercase tracking-tighter">Dokunuşlar</span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed mb-12">
              En özel günlerinizi DyCake'in eşsiz tasarımları ve doğal lezzetleriyle unutulmaz kılın. Size özel pasta tasarımları ve catering çözümleri için yanınızdayız.
            </p>

            <div className="space-y-6">
               {[
                 { icon: <Calendar className="w-5 h-5" />, title: "Düğün & Nişan", desc: "En mutlu gününüze zarafet katan butik pastalar." },
                 { icon: <Gift className="w-5 h-5" />, title: "Kurumsal Hediyeler", desc: "Markanıza değer katan lezzetli ve şık sunumlar." },
                 { icon: <Star className="w-5 h-5" />, title: "Özel Tasarımlar", desc: "Hayalinizdeki lezzeti gerçeğe dönüştüren artisan dokunuşlar." }
               ].map((item, i) => (
                 <div key={i} className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-sand shrink-0">
                        {item.icon}
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-1">{item.title}</h4>
                        <p className="text-white/30 text-sm">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>

            <button className="mt-16 px-10 py-5 bg-brand-sand text-[#110C08] rounded-2xl font-black text-xs tracking-widest hover:bg-white transition-all shadow-2xl uppercase">
              BİLGİ AL & SİPARİŞ VER
            </button>
          </div>

          {/* Right: Elegant Image Layout */}
          <div className="relative grid grid-cols-2 gap-4 h-[600px]">
             <div className="space-y-4 pt-12">
                <div className="h-2/3 rounded-[40px] overflow-hidden">
                    <img src="/images/forDYCake/header1.png" className="w-full h-full object-cover" alt="Special Cake 1" />
                </div>
                <div className="h-1/3 rounded-[40px] bg-brand-sand/10 border border-brand-sand/20 flex items-center justify-center p-8 text-center">
                    <p className="text-brand-sand font-serif italic text-xl">Hayallerinizi Tasarlıyoruz</p>
                </div>
             </div>
             <div className="space-y-4">
                <div className="h-1/2 rounded-[40px] overflow-hidden">
                    <img src="/images/forDYCake/header1.png" className="w-full h-full object-cover" alt="Special Cake 2" />
                </div>
                <div className="h-1/2 rounded-[40px] overflow-hidden">
                    <img src="/images/forDYCake/header1.png" className="w-full h-full object-cover" alt="Special Cake 3" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
