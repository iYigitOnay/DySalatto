'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Leaf, ShieldAlert } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product, MOCK_INGREDIENTS } from '@/lib/mockData';

interface KitchenProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const DynamicIcon = ({ iconName, className }: { iconName?: string, className?: string }) => {
  if (!iconName) return null;
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent ? <IconComponent className={className} /> : null;
};

export default function KitchenProductCard({ product, onAddToCart }: KitchenProductCardProps) {
  const isCake = product.brand === 'cake';
  const accentColor = isCake ? 'bg-brand-sand text-[#110C08]' : 'bg-brand-terracotta text-white';
  const accentHover = isCake ? 'hover:bg-white' : 'hover:bg-brand-terracotta-dark';

  const productIngredients = MOCK_INGREDIENTS.filter(ing => product.ingredients.includes(ing.id));

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative bg-[#0a0a0a] rounded-[40px] border border-white/5 overflow-hidden flex flex-col h-full hover:border-white/10 transition-all duration-500"
    >
      {/* Product Image */}
      <div className="relative h-64 w-full overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        
        {/* Category Tag */}
        <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/60">
          {product.category}
        </div>

        {/* Dietary Icons */}
        <div className="absolute top-6 right-6 flex gap-2">
            {product.dietaryTags.includes('Vegan') && (
                <div className="w-8 h-8 rounded-full bg-green-500/20 backdrop-blur-md border border-green-500/30 flex items-center justify-center text-green-500" title="Vegan">
                    <Leaf className="w-4 h-4" />
                </div>
            )}
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-serif text-white group-hover:text-brand-sand transition-colors duration-500">{product.name}</h3>
            <p className="text-white/40 text-sm mt-1 leading-relaxed line-clamp-2">{product.description}</p>
          </div>
        </div>

        {/* Ingredients Summary */}
        <div className="mt-4 mb-8 flex flex-wrap gap-2">
            {productIngredients.map(ing => (
                <span key={ing.id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-white/40" title={ing.name}>
                    <DynamicIcon iconName={ing.iconName} className="w-3 h-3" />
                    {ing.name}
                </span>
            ))}
        </div>

        {/* Allergens Warning */}
        {product.allergens.length > 0 && (
            <div className="mt-auto mb-6 flex items-center gap-2 text-red-400/60 text-[9px] font-black uppercase tracking-widest">
                <ShieldAlert className="w-3 h-3" />
                Alerjen: {product.allergens.join(', ')}
            </div>
        )}

        {/* Action Area */}
        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="text-xl font-black text-white tracking-tighter">
            {product.price}
          </div>
          <button 
            onClick={() => onAddToCart(product)}
            className={cn(
              "flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl group/btn",
              accentColor,
              accentHover
            )}
          >
            SEPETE EKLE 
            <Plus className="w-4 h-4 transition-transform group-hover/btn:rotate-90" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
