'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const cakeShowcase = [
  {
    tempId: 0,
    title: "Artisan San Sebastian",
    desc: "İçindeki akışkan dokusu ve yanık üst yüzeyiyle gerçek bir Bask klasiği.",
    price: "185 TL",
    imgSrc: "/images/forDYCake/header1.png" // Placeholder
  },
  {
    tempId: 1,
    title: "Belçika Çikolatalı Tart",
    desc: "Yüzde 70 bitter çikolata ve fındık tabanıyla yoğun bir lezzet deneyimi.",
    price: "165 TL",
    imgSrc: "/images/forDYCake/header1.png" // Placeholder
  },
  {
    tempId: 2,
    title: "Orman Meyveli Fit Pasta",
    desc: "Rafine şekersiz, taze meyvelerle hazırlanan hafif ve ferah bir seçim.",
    price: "195 TL",
    imgSrc: "/images/forDYCake/header1.png" // Placeholder
  }
];

interface ProductCardProps {
  position: number;
  product: typeof cakeShowcase[0];
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
        "absolute left-1/2 top-1/2 cursor-pointer border p-6 md:p-10 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform-gpu group",
        isCenter 
          ? "bg-[#110C08] text-white border-brand-sand/30 shadow-[0px_20px_60px_rgba(0,0,0,0.5)] z-10" 
          : "bg-white text-brand-charcoal border-gray-100 hover:border-brand-sand/20 z-0 scale-[0.85]"
      )}
      style={{
        width: cardSize,
        height: cardSize + 100,
        clipPath: `polygon(40px 0%, 100% 0%, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0% 100%, 0% 40px)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize * 0.8) * position}px)
          translateY(${isCenter ? -30 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 3 : -3}deg)
        `,
      }}
    >
      <div className="relative h-[60%] w-full mb-6 overflow-hidden rounded-[30px] bg-brand-sand/10 transform-gpu">
        <img
          src={product.imgSrc}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 transform-gpu"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute top-4 right-4 bg-brand-sand text-brand-charcoal px-4 py-2 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] shadow-lg">
          {product.price}
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className={cn(
          "text-2xl md:text-3xl font-serif transition-colors duration-500",
          isCenter ? "text-brand-sand" : "text-brand-charcoal"
        )}>
          {product.title}
        </h3>
        
        <p className={cn(
          "text-sm md:text-base leading-relaxed font-medium transition-opacity duration-500 max-w-sm",
          isCenter ? "text-white/60" : "text-gray-400"
        )}>
          {product.desc}
        </p>
      </div>

      {isCenter && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-12 flex items-center gap-3 text-[10px] md:text-[11px] font-black tracking-[0.3em] text-brand-sand uppercase group/btn"
        >
          LEZZETİ KEŞFET <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default function CakeShowcase() {
  const [cardSize, setCardSize] = useState(480);
  const [productList, setProductList] = useState(cakeShowcase);

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
      const tablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      if (mobile) setCardSize(280);
      else if (tablet) setCardSize(380);
      else setCardSize(480);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <section className="h-screen w-full bg-[#110C08] overflow-hidden relative flex flex-col justify-center py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 mb-16 md:mb-20 text-center relative z-10 shrink-0">
        <p className="text-[11px] md:text-xs font-black tracking-[0.5em] text-brand-sand uppercase mb-4">Yeni Çıkanlar</p>
        <h2 className="text-5xl md:text-8xl font-serif text-white italic leading-tight">
          Fırından <span className="text-brand-sand not-italic font-sans font-black uppercase tracking-tighter">Yeni Çıkanlar</span>
        </h2>
      </div>

      <div className="relative w-full overflow-visible grow">
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
        
        {/* Refined Edge Navigation */}
        <div className="absolute inset-y-0 left-4 md:left-12 flex items-center z-30">
          <button 
            onClick={() => handleMove(-1)} 
            className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 hover:border-brand-sand hover:text-brand-sand text-white/50 transition-all rounded-full group"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="absolute inset-y-0 right-4 md:right-12 flex items-center z-30">
          <button 
            onClick={() => handleMove(1)} 
            className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 hover:border-brand-sand hover:text-brand-sand text-white/50 transition-all rounded-full group"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
