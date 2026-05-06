'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Leaf, ShieldAlert, Edit2, Trash2, Eye, EyeOff, Info } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';
import ProductCustomizerModal from '../ui/ProductCustomizerModal';

interface KitchenProductCardProps {
  product: any;
  onAddToCart: (product: any) => void;
  onEdit?: () => void;
}

const DynamicIcon = ({ iconName, className }: { iconName?: string, className?: string }) => {
  if (!iconName) return null;
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent ? <IconComponent className={className} /> : null;
};

export default function KitchenProductCard({ product, onAddToCart, onEdit }: KitchenProductCardProps) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const brand = product.brand?.toLowerCase() || '';
  const isCake = brand === 'cake' || brand === 'dycake';
  const accentColor = isCake ? 'bg-brand-sand text-[#110C08]' : 'bg-brand-terracotta text-white';
  const accentHover = isCake ? 'hover:bg-white' : 'hover:bg-brand-terracotta-dark';

  const productIngredients = product.ingredients?.map((pi: any) => pi.ingredient) || [];
  const productTraits = product.traits?.map((pt: any) => pt.trait?.name).filter(Boolean) || [];
  const categoryName = product.category?.name || 'Genel';
  const price = Number(product.price || 0).toLocaleString('tr-TR');

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: () => fetchApi(`/products/${product.id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showToast("Ürün başarıyla silindi.", "info");
    },
    onError: (error: any) => showToast(error.message, "error")
  });

  const toggleStatusMutation = useMutation({
    mutationFn: () => fetchApi(`/products/${product.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...product,
        status: product.status === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE',
        // Backend expects traitIds and ingredientIds
        traitIds: product.traits?.map((t: any) => t.traitId),
        ingredientIds: product.ingredients?.map((i: any) => i.ingredientId)
      })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showToast("Ürün durumu güncellendi.", "success");
    }
  });

  const isHidden = product.status === 'HIDDEN';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "group relative bg-[#0a0a0a] rounded-[40px] border border-white/5 overflow-hidden flex flex-col h-full hover:border-white/10 transition-all duration-500",
        isHidden && "grayscale opacity-60 contrast-75"
      )}
    >
      {/* Admin Controls Overlay */}
      {onEdit && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
           <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/20 text-white transition-all"
            title="Düzenle"
           >
             <Edit2 className="w-4 h-4" />
           </button>
           <button 
            onClick={(e) => { e.stopPropagation(); toggleStatusMutation.mutate(); }}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/20 text-white transition-all"
            title={isHidden ? "Göster" : "Gizle"}
           >
             {isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
           </button>
           <div className="w-px h-6 bg-white/10 mx-1" />
           <button 
            onClick={(e) => { e.stopPropagation(); if(confirm("Ürünü kalıcı olarak silmek istediğinize emin misiniz?")) deleteMutation.mutate(); }}
            className="p-3 rounded-xl bg-white/5 hover:bg-red-500/20 text-white hover:text-red-400 transition-all"
            title="Sil"
           >
             <Trash2 className="w-4 h-4" />
           </button>
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-64 w-full overflow-hidden">
        <img 
          src={product.image || '/images/logo.png'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        
        {/* Category Tag */}
        <div className="absolute bottom-6 left-8 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/60">
          {categoryName}
        </div>

        {/* Dietary Icons */}
        <div className="absolute top-6 right-8 flex gap-2">
            {productTraits.includes('Vegan') && (
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
            <h3 className="text-2xl font-serif text-white group-hover:text-brand-sand transition-colors duration-500">
                {product.name}
                {isHidden && <span className="ml-3 text-[10px] bg-white/10 text-white/40 px-2 py-1 rounded uppercase tracking-widest font-sans font-black">GİZLİ</span>}
            </h3>
            <p className="text-white/40 text-sm mt-1 leading-relaxed line-clamp-2">{product.description}</p>
          </div>
        </div>

        {/* Ingredients Summary */}
        <div className="mt-4 mb-8 flex flex-wrap gap-2">
            {productIngredients.map((ing: any) => (
                <span key={ing.id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-white/40" title={ing.name}>
                    <DynamicIcon iconName={ing.iconName || 'Wheat'} className="w-3 h-3" />
                    {ing.name}
                </span>
            ))}
        </div>

        {/* Action Area */}
        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="text-xl font-black text-white tracking-tighter">
            {price} TL
          </div>
          <button 
            onClick={() => setIsCustomizerOpen(true)}
            disabled={isHidden}
            className={cn(
              "flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl group/btn",
              accentColor,
              accentHover,
              isHidden && "opacity-20 cursor-not-allowed"
            )}
          >
            {isHidden ? 'TÜKENDİ' : 'İNCELE & EKLE'}
            {!isHidden && <Plus className="w-4 h-4 transition-transform group-hover/btn:rotate-90" />}
          </button>
        </div>
      </div>

      <ProductCustomizerModal 
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        product={product}
        brand={brand as any}
      />
    </motion.div>
  );
}
