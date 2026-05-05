'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Plus } from 'lucide-react';

const pairings = [
  {
    id: 1,
    cake: "San Sebastian",
    drink: "Americano",
    desc: "Yoğun yanık dokusu, taze demlenmiş bir Americano'nun hafif asiditesiyle mükemmel dengelenir.",
    cakeImg: "/images/forDYCake/header1.png",
    drinkImg: "/images/forDYCake/header1.png"
  },
  {
    id: 2,
    cake: "Çikolatalı Tart",
    drink: "Earl Grey Çay",
    desc: "Bitter çikolatanın yoğunluğu, Earl Grey'in aromatik bergamot notalarıyla ferah bir bitiş sağlar.",
    cakeImg: "/images/forDYCake/header1.png",
    drinkImg: "/images/forDYCake/header1.png"
  }
];

export default function CakePairings() {
  const [activeId, setActiveId] = useState(1);
  const current = pairings.find(p => p.id === activeId)!;

  return (
    <section className="py-32 bg-[#110C08] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <p className="text-xs font-black tracking-[0.5em] text-brand-sand uppercase mb-4">Mükemmel Uyum</p>
          <h2 className="text-4xl md:text-6xl font-serif text-white italic">Lezzet <span className="text-brand-sand not-italic font-sans font-black uppercase tracking-tighter">Eşleşmeleri</span></h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: Interactive Selection */}
          <div className="space-y-8">
            {pairings.map((p) => (
              <div 
                key={p.id}
                onClick={() => setActiveId(p.id)}
                className={`p-8 rounded-3xl cursor-pointer transition-all duration-500 border ${activeId === p.id ? 'bg-brand-sand border-brand-sand shadow-2xl scale-105' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-2xl font-serif italic ${activeId === p.id ? 'text-[#110C08]' : 'text-white'}`}>{p.cake} + {p.drink}</h3>
                    <p className={`text-sm mt-2 max-w-md ${activeId === p.id ? 'text-[#110C08]/70' : 'text-white/40'}`}>{p.desc}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activeId === p.id ? 'bg-[#110C08] text-brand-sand' : 'bg-white/10 text-white/40'}`}>
                    <Coffee className="w-6 h-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Visual representation */}
          <div className="relative aspect-square flex items-center justify-center">
             <AnimatePresence mode="wait">
                <motion.div 
                   key={activeId}
                   initial={{ opacity: 0, rotate: -10, scale: 0.9 }}
                   animate={{ opacity: 1, rotate: 0, scale: 1 }}
                   exit={{ opacity: 0, rotate: 10, scale: 0.9 }}
                   transition={{ duration: 0.6 }}
                   className="relative w-full h-full flex items-center justify-center"
                >
                    {/* Cake Image */}
                    <div className="absolute left-0 top-0 w-3/4 h-3/4 rounded-[60px] overflow-hidden border-4 border-[#110C08] shadow-2xl z-10">
                        <img src={current.cakeImg} className="w-full h-full object-cover" alt={current.cake} />
                    </div>
                    {/* Plus Icon */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-brand-sand text-[#110C08] w-16 h-16 rounded-full flex items-center justify-center shadow-2xl">
                        <Plus className="w-8 h-8" />
                    </div>
                    {/* Drink Image */}
                    <div className="absolute right-0 bottom-0 w-2/3 h-2/3 rounded-[60px] overflow-hidden border-4 border-[#110C08] shadow-2xl z-0">
                        <img src={current.drinkImg} className="w-full h-full object-cover opacity-80" alt={current.drink} />
                    </div>
                </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
