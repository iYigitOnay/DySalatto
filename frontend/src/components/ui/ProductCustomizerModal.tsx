'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Minus, Check, ShoppingBag, 
  ChevronDown, ChevronUp, Tag, Leaf, 
  ShieldAlert, Info, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';

interface ProductCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  brand: 'salatto' | 'cake';
}

export default function ProductCustomizerModal({ isOpen, onClose, product, brand }: ProductCustomizerModalProps) {
  const { addItem } = useCartStore();
  
  // Customization State
  const [quantity, setQuantity] = useState(1);
  const [removedIngredientIds, setRemovedIngredients] = useState<string[]>([]);
  const [extraIngredients, setExtraIngredients] = useState<any[]>([]);
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  // Fetch Ingredient Categories for Extras
  const dbBrand = brand === 'cake' ? 'DYCAKE' : 'DYSALATTO';
  const { data: ingCatsRes } = useQuery({
    queryKey: ['ingredient-categories', dbBrand],
    queryFn: () => fetchApi(`/ingredients/categories?brand=${dbBrand}`),
    enabled: isOpen
  });

  const ingredientCategories = ingCatsRes?.data || [];

  // Calculations
  const basePrice = Number(product?.price || 0);
  const extrasPrice = extraIngredients.reduce((sum, ing) => sum + Number(ing.price), 0);
  const totalPrice = (basePrice + extrasPrice) * quantity;

  const handleToggleExtra = (ingredient: any) => {
    setExtraIngredients(prev => 
      prev.find(i => i.id === ingredient.id)
        ? prev.filter(i => i.id !== ingredient.id)
        : [...prev, ingredient]
    );
  };

  const handleToggleRemove = (ingredientId: string) => {
    setRemovedIngredients(prev => 
      prev.includes(ingredientId)
        ? prev.filter(id => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => 
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  const handleAddToCart = () => {
    const isCustomized = removedIngredientIds.length > 0 || extraIngredients.length > 0;
    
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: basePrice + extrasPrice,
      quantity,
      image: product.image,
      brand: product.brand.toLowerCase(),
      isCustom: isCustomized,
      ingredients: extraIngredients,
      removedIngredients: removedIngredientIds,
      product: product
    });

    onClose();
    // Reset states
    setQuantity(1);
    setRemovedIngredients([]);
    setExtraIngredients([]);
  };

  if (!product) return null;

  const accentColor = brand === 'cake' ? 'bg-brand-sand text-black' : 'bg-brand-terracotta text-white';
  const accentText = brand === 'cake' ? 'text-brand-sand' : 'text-brand-terracotta';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-[#080808] border border-white/10 rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            {/* Left: Visual & Basic Info */}
            <div className="md:w-5/12 relative bg-white/[0.02] border-b md:border-b-0 md:border-r border-white/5 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent z-10" />
               <img 
                 src={product.image ? `http://localhost:3001${product.image}` : '/images/logo.png'} 
                 alt={product.name}
                 className="w-full h-full object-cover opacity-60 scale-110 hover:scale-100 transition-transform duration-[2s]"
               />
               
               <div className="absolute bottom-10 left-10 right-10 z-20">
                  <div className={cn("px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-4 bg-white/5 border border-white/10", accentText)}>
                    {product.category?.name || "Artisan Ürün"}
                  </div>
                  <h2 className="text-5xl font-serif text-white italic leading-tight mb-4">{product.name}</h2>
                  <p className="text-white/40 text-sm leading-relaxed max-w-sm line-clamp-3 font-medium italic">
                    "{product.description || 'Bu artisan lezzet, DySalatto şefleri tarafından özenle hazırlandı.'}"
                  </p>
               </div>

               <button onClick={onClose} className="absolute top-8 left-8 z-30 p-4 rounded-full bg-black/40 text-white/40 hover:text-white hover:bg-black/60 transition-all backdrop-blur-md">
                 <X className="w-6 h-6" />
               </button>
            </div>

            {/* Right: Customization Controls */}
            <div className="md:w-7/12 flex flex-col h-full bg-[#080808]">
               <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                  <div className="max-w-2xl mx-auto space-y-12">
                     
                     {/* 1. Standard Recipe (Removeable) */}
                     {product.ingredients?.length > 0 && (
                       <section className="space-y-6">
                          <div className="flex items-center gap-3">
                             <ChefHat className="w-5 h-5 text-white/20" />
                             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Reçete (Çıkarılabilir)</h3>
                          </div>
                          <div className="flex flex-wrap gap-3">
                             {product.ingredients.map((pi: any) => {
                               const ing = pi.ingredient;
                               const isRemoved = removedIngredientIds.includes(ing.id);
                               return (
                                 <button 
                                   key={ing.id}
                                   onClick={() => handleToggleRemove(ing.id)}
                                   className={cn(
                                     "px-5 py-3 rounded-2xl text-xs font-bold border transition-all flex items-center gap-3",
                                     isRemoved 
                                       ? "border-red-500/20 bg-red-500/5 text-red-500/40 line-through" 
                                       : "border-white/5 bg-white/5 text-white/70 hover:border-white/20"
                                   )}
                                 >
                                   {ing.name}
                                   {isRemoved ? <Plus className="w-3 h-3 rotate-45" /> : <X className="w-3 h-3 text-white/20" />}
                                 </button>
                               );
                             })}
                          </div>
                       </section>
                     )}

                     {/* 2. Extra Materials (Categorized) */}
                     <section className="space-y-6">
                        <div className="flex items-center gap-3">
                           <Plus className="w-5 h-5 text-white/20" />
                           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Ekstra Malzemeler</h3>
                        </div>

                        <div className="space-y-4">
                           {ingredientCategories.length === 0 ? (
                             <p className="text-white/20 text-xs italic">Henüz ekstra malzeme bulunmuyor.</p>
                           ) : (
                             ingredientCategories.map((cat: any) => {
                               const isOpen = openGroups.includes(cat.id);
                               const selectedCount = cat.ingredients.filter((i: any) => extraIngredients.find(ei => ei.id === i.id)).length;

                               return (
                                 <div key={cat.id} className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden group">
                                    <button 
                                      onClick={() => toggleGroup(cat.id)}
                                      className="w-full flex items-center justify-between p-6 hover:bg-white/[0.04] transition-all"
                                    >
                                       <div className="flex items-center gap-4">
                                          <div className={cn("w-1.5 h-1.5 rounded-full transition-colors", selectedCount > 0 ? "bg-brand-sand shadow-[0_0_10px_rgba(230,175,100,0.5)]" : "bg-white/10")} />
                                          <span className="text-[11px] font-black uppercase tracking-widest text-white/60">{cat.name}</span>
                                          {selectedCount > 0 && <span className="text-[9px] font-black text-brand-sand">+{selectedCount} SEÇİLDİ</span>}
                                       </div>
                                       {isOpen ? <ChevronUp className="w-4 h-4 text-white/20" /> : <ChevronDown className="w-4 h-4 text-white/20" />}
                                    </button>
                                    
                                    <AnimatePresence>
                                       {isOpen && (
                                         <motion.div 
                                           initial={{ height: 0, opacity: 0 }}
                                           animate={{ height: 'auto', opacity: 1 }}
                                           exit={{ height: 0, opacity: 0 }}
                                           className="overflow-hidden"
                                         >
                                            <div className="px-6 pb-6 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                               {cat.ingredients.map((ing: any) => {
                                                 const isSelected = extraIngredients.find(ei => ei.id === ing.id);
                                                 return (
                                                   <button 
                                                     key={ing.id}
                                                     onClick={() => handleToggleExtra(ing)}
                                                     disabled={!ing.isStock}
                                                     className={cn(
                                                       "flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                                                       !ing.isStock ? "opacity-30 cursor-not-allowed border-white/5" :
                                                       isSelected 
                                                         ? "border-brand-sand bg-brand-sand/10 shadow-[0_0_30px_rgba(230,175,100,0.05)]" 
                                                         : "border-white/5 bg-white/5 hover:border-white/10"
                                                     )}
                                                   >
                                                      <div className="flex items-center gap-3">
                                                         <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all", isSelected ? "border-brand-sand bg-brand-sand" : "border-white/10")}>
                                                            {isSelected && <Check className="w-2.5 h-2.5 text-black font-black" />}
                                                         </div>
                                                         <span className={cn("text-[11px] font-bold", isSelected ? "text-white" : "text-white/40")}>{ing.name}</span>
                                                      </div>
                                                      <span className="text-[10px] font-mono text-white/30 tracking-tighter">
                                                        {ing.isStock ? `+₺${Number(ing.price).toFixed(2)}` : 'TÜKENDİ'}
                                                      </span>
                                                   </button>
                                                 );
                                               })}
                                            </div>
                                         </motion.div>
                                       )}
                                    </AnimatePresence>
                                 </div>
                               );
                             })
                           )}
                        </div>
                     </section>
                  </div>
               </div>

               {/* Bottom Bar: Price & Action */}
               <div className="p-8 md:p-12 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-8 bg-white/5 border border-white/5 p-2 rounded-3xl">
                     <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/5"><Minus className="w-4 h-4" /></button>
                     <span className="text-xl font-black text-white w-8 text-center">{quantity}</span>
                     <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/5"><Plus className="w-4 h-4" /></button>
                  </div>

                  <div className="flex flex-col items-center sm:items-end flex-1">
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Toplam Artisan Lezzet</p>
                     <p className="text-4xl font-black text-white tracking-tighter">₺{totalPrice.toFixed(2)}</p>
                  </div>

                  <button 
                    onClick={handleAddToCart}
                    className={cn(
                      "w-full sm:w-auto px-12 py-5 rounded-[32px] font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-2xl",
                      accentColor
                    )}
                  >
                    SEPETE EKLE <ShoppingBag className="w-5 h-5" />
                  </button>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
