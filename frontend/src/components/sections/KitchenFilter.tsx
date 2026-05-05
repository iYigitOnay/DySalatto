'use client';

import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown, Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Ingredient, MOCK_INGREDIENTS } from '@/lib/mockData';

interface KitchenFilterProps {
  brand: 'salatto' | 'cake';
  onFilterChange: (filters: FilterState) => void;
  categories: string[];
}

export type FilterState = {
  search: string;
  category: string;
  dietary: string[];
  ingredients: string[];
};

const DynamicIcon = ({ iconName, className }: { iconName?: string, className?: string }) => {
  if (!iconName) return null;
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent ? <IconComponent className={className} /> : null;
};

export default function KitchenFilter({ brand, onFilterChange, categories }: KitchenFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'Tümü',
    dietary: [],
    ingredients: [],
  });

  const isCake = brand === 'cake';
  const accentColor = isCake ? 'bg-brand-sand text-[#110C08]' : 'bg-brand-terracotta text-white';
  const accentText = isCake ? 'text-brand-sand' : 'text-brand-terracotta';
  const accentBorder = isCake ? 'border-brand-sand/30' : 'border-brand-terracotta/30';

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const toggleDietary = (tag: string) => {
    const newDietary = filters.dietary.includes(tag)
      ? filters.dietary.filter(t => t !== tag)
      : [...filters.dietary, tag];
    updateFilters({ dietary: newDietary });
  };

  const toggleIngredient = (id: string) => {
    const newIng = filters.ingredients.includes(id)
      ? filters.ingredients.filter(i => i !== id)
      : [...filters.ingredients, id];
    updateFilters({ ingredients: newIng });
  };

  const dietaryOptions = isCake 
    ? ['Rafine Şekersiz', 'Glutensiz', 'Vegan', 'Düşük Kalori']
    : ['Vegan', 'Vejetaryen', 'Glutensiz', 'Yüksek Protein', 'Düşük Karbonhidrat'];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 mb-12">
      <div className="flex flex-col gap-6 bg-[#0a0a0a] p-6 rounded-[32px] border border-white/5 shadow-2xl">
        
        {/* Level 1: Search & Basic Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[280px] relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-brand-sand transition-colors" />
            <input 
              type="text"
              placeholder="Ürün veya malzeme ara (örn: mısır)..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-brand-sand/50 transition-all"
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {['Tümü', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => updateFilters({ category: cat })}
                className={cn(
                  "px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  filters.category === cat 
                    ? accentColor
                    : "bg-white/5 text-white/40 hover:bg-white/10"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "p-4 rounded-xl border transition-all flex items-center gap-3 text-[11px] font-black uppercase tracking-widest",
              isOpen ? accentBorder + " " + accentText : "border-white/10 text-white/40 hover:bg-white/5"
            )}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden md:block">Filtreler</span>
            {filters.dietary.length + filters.ingredients.length > 0 && (
              <span className={cn("ml-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px]", accentColor)}>
                {filters.dietary.length + filters.ingredients.length}
              </span>
            )}
          </button>
        </div>

        {/* Level 2 & 3: Expanded Filters */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/5 pt-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Dietary Tags */}
                <div>
                  <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-6">Beslenme Tercihi</h4>
                  <div className="flex flex-wrap gap-3">
                    {dietaryOptions.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleDietary(tag)}
                        className={cn(
                          "px-4 py-2.5 rounded-lg text-[10px] font-bold transition-all border",
                          filters.dietary.includes(tag)
                            ? accentBorder + " " + accentText + " bg-white/5"
                            : "border-white/5 text-white/40 hover:border-white/20"
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specific Ingredients */}
                <div>
                  <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-6">İçerik Hassasiyeti (Spesifik)</h4>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_INGREDIENTS.map((ing) => (
                      <button
                        key={ing.id}
                        onClick={() => toggleIngredient(ing.id)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold transition-all",
                          filters.ingredients.includes(ing.id)
                            ? accentColor
                            : "bg-white/5 text-white/40 hover:bg-white/10"
                        )}
                      >
                        <DynamicIcon iconName={ing.iconName} className="w-3 h-3" />
                        {ing.name}
                        {filters.ingredients.includes(ing.id) && <Check className="w-3 h-3 ml-1" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-between items-center bg-white/[0.03] border-t border-white/5 -mx-6 -mb-6 px-6 py-4 md:py-6 rounded-b-[32px] min-h-[80px]">
                <button 
                  onClick={() => updateFilters({ dietary: [], ingredients: [], category: 'Tümü', search: '' })}
                  className="text-[10px] font-black text-white/20 hover:text-white uppercase tracking-widest transition-colors"
                >
                  TÜMÜNÜ TEMİZLE
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className={cn("px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl", accentColor)}
                >
                  SONUÇLARI GÖSTER
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
