'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const productShowcase = [
  {
    tempId: 0,
    title: "Protein Power Bowl",
    desc: "Gün boyu enerji için tavuk, kinoa ve taze avokado ile zenginleştirilmiş protein bombası.",
    price: "285 TL",
    imgSrc: "/images/forDYSalatto/g1.jpg"
  },
  {
    tempId: 1,
    title: "Vegan Dream Bowl",
    desc: "Doğanın en saf haliyle harmanlanmış, nohut ve özel vegan soslarla hazırlanan lezzet şöleni.",
    price: "245 TL",
    imgSrc: "/images/forDYSalatto/g2.jpg"
  },
  {
    tempId: 2,
    title: "Tropical Mix Bowl",
    desc: "Egzotik meyveler ve ferahlatıcı yeşilliklerin mükemmel uyumuyla hazırlanan tropikal rüya.",
    price: "265 TL",
    imgSrc: "/images/forDYSalatto/g3.jpg"
  },
  {
    tempId: 3,
    title: "Akdeniz Esintisi",
    desc: "Peynir, zeytin ve Ege'nin en taze sebzeleriyle hazırlanan hafif ve sağlıklı bir seçenek.",
    price: "235 TL",
    imgSrc: "/images/forDYSalatto/g4.jpg"
  },
  {
    tempId: 4,
    title: "Detox Green Bowl",
    desc: "Vücudunuzu tazeleyecek yeşil elma, chia ve ferahlatıcı sebzelerle hazırlanan detoks etkisi.",
    price: "225 TL",
    imgSrc: "/images/forDYSalatto/g5.jpg"
  }
];

interface ProductCardProps {
  position: number;
  product: typeof productShowcase[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  position, 
  product, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;

  return (
    <motion.div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-10 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform-gpu group",
        isCenter 
          ? "z-10 bg-brand-charcoal text-white border-brand-terracotta/50" 
          : "z-0 bg-white text-brand-charcoal border-gray-100 hover:border-brand-terracotta/30"
      )}
      style={{
        width: cardSize,
        height: cardSize + 120,
        clipPath: `polygon(60px 0%, 100% 0%, 100% calc(100% - 60px), calc(100% - 60px) 100%, 0% 100%, 0% 60px)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.3) * position}px)
          translateY(${isCenter ? -40 : position % 2 ? 20 : -20}px)
          rotate(${isCenter ? 0 : position % 2 ? 4 : -4}deg)
          scale(${isCenter ? 1 : 0.8})
        `,
        boxShadow: isCenter ? "0px 30px 80px rgba(0,0,0,0.5)" : "none"
      }}
    >
      {/* Zoomable Image Container */}
      <div className="relative h-[65%] w-full mb-8 overflow-hidden rounded-[40px] bg-brand-cream/10 transform-gpu">
        <img
          src={product.imgSrc}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-115 transform-gpu"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute top-6 right-6 bg-brand-terracotta text-white px-5 py-3 rounded-full text-[12px] font-black uppercase tracking-[0.2em] shadow-lg">
          {product.price}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className={cn(
          "text-3xl md:text-4xl font-serif transition-colors duration-500",
          isCenter ? "text-brand-terracotta" : "text-brand-charcoal"
        )}>
          {product.title}
        </h3>
        
        <p className={cn(
          "text-[16px] leading-relaxed font-medium transition-opacity duration-500 max-w-sm",
          isCenter ? "text-white/60" : "text-gray-400"
        )}>
          {product.desc}
        </p>
      </div>

      {isCenter && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-12 flex items-center gap-3 text-[12px] font-black tracking-[0.3em] text-brand-terracotta uppercase group/btn"
        >
          SANATI KEŞFET <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" />
        </motion.div>
      )}
    </motion.div>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export const StaggerShowcase: React.FC = () => {
  const [cardSize, setCardSize] = useState(580);
  const [isMobile, setIsMobile] = useState(false);
  const [productList, setProductList] = useState(productShowcase);

  const handleMove = (steps: number) => {
    const newList = [...productList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setProductList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setCardSize(mobile ? 320 : 580);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <section className="h-screen w-full bg-brand-cream/20 overflow-hidden relative flex flex-col justify-center py-24">
      <div className="absolute inset-0 bg-[url('/images/grain.png')] opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 mb-16 md:mb-20 text-center transform-gpu relative z-10 shrink-0">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-[11px] md:text-xs font-black tracking-[0.5em] text-brand-terracotta uppercase mb-4"
        >
          Koleksiyonumuz
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-8xl font-serif text-brand-charcoal italic leading-tight"
        >
          Tazeliğin En <span className="text-brand-terracotta not-italic font-sans font-black uppercase tracking-tighter">Şık Hali</span>
        </motion.h2>
      </div>

      <div
        className="relative w-full overflow-visible grow"
      >
        {productList.map((product, index) => {
          const position = index - Math.floor(productList.length / 2);
          
          if (Math.abs(position) > 2) return null;

          return (
            <ProductCard
              key={product.tempId}
              product={product}
              handleMove={handleMove}
              position={position}
              cardSize={cardSize}
            />
          );
        })}
        
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-6 z-20">
          <button
            onClick={() => handleMove(-1)}
            className={cn(
              "flex h-20 w-20 items-center justify-center transition-all duration-300",
              "bg-white border-2 border-gray-100 hover:border-brand-terracotta hover:text-brand-terracotta text-brand-charcoal shadow-xl rounded-full group"
            )}
            aria-label="Previous product"
          >
            <ChevronLeft className="w-8 h-8 transition-transform group-hover:-translate-x-1" />
          </button>
          <button
            onClick={() => handleMove(1)}
            className={cn(
              "flex h-20 w-20 items-center justify-center transition-all duration-300",
              "bg-white border-2 border-gray-100 hover:border-brand-terracotta hover:text-brand-terracotta text-brand-charcoal shadow-xl rounded-full group"
            )}
            aria-label="Next product"
          >
            <ChevronRight className="w-8 h-8 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
