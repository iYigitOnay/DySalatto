"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, ShoppingBag, Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { useCartStore, Ingredient } from '@/store/cartStore';
import { useToast } from '../ui/ToastProvider';

interface Step {
  id: string;
  name: string;
  orderIndex: number;
  isRequired: boolean;
  minSelect: number;
  maxSelect: number;
  ingredients: Ingredient[];
}

interface DIYWizardProps {
  brand: 'salatto' | 'cake';
}

export default function DIYWizard({ brand }: DIYWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, Ingredient[]>>({});
  const { addItem } = useCartStore();
  const { showToast } = useToast();

  const mappedBrand = (brand === 'salatto' || brand === 'dysalatto') ? 'DYSALATTO' : 'DYCAKE';

  const { data: stepsRes, isLoading } = useQuery({
    queryKey: ['diy-steps', brand],
    queryFn: () => fetchApi(`/ingredients/steps?brand=${mappedBrand}`)
  });

  const steps: Step[] = stepsRes?.data || [];
  const currentStep = steps[currentStepIndex];

  const handleToggleIngredient = (ingredient: Ingredient) => {
    if (!currentStep) return;

    setSelections(prev => {
      const stepSelections = prev[currentStep.id] || [];
      const isSelected = stepSelections.some(i => i.id === ingredient.id);

      if (isSelected) {
        return {
          ...prev,
          [currentStep.id]: stepSelections.filter(i => i.id !== ingredient.id)
        };
      } else {
        // Max seçime ulaşıldı mı kontrol et
        if (stepSelections.length >= currentStep.maxSelect) {
          if (currentStep.maxSelect === 1) {
            // Tekli seçimse eskisini sil yenisini ekle
            return {
              ...prev,
              [currentStep.id]: [ingredient]
            };
          }
          showToast(`Bu adımda en fazla ${currentStep.maxSelect} seçim yapabilirsiniz.`, 'info');
          return prev;
        }
        return {
          ...prev,
          [currentStep.id]: [...stepSelections, ingredient]
        };
      }
    });
  };

  const isNextDisabled = useMemo(() => {
    if (!currentStep) return true;
    const stepSelections = selections[currentStep.id] || [];
    return stepSelections.length < currentStep.minSelect;
  }, [currentStep, selections]);

  const handleNext = () => {
    if (currentStepIndex < steps.length) {
      setCurrentStepIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddToCart = () => {
    const allSelectedIngredients = Object.values(selections).flat();
    const totalPrice = allSelectedIngredients.reduce((sum, ing) => sum + Number(ing.price), 0);
    
    // DIY ürünü için unique bir ID üretelim (içeriklere göre de olabilir ama şimdilik random)
    const diyId = `diy-${brand}-${Date.now()}`;

    addItem({
      id: diyId,
      name: brand === 'salatto' ? "Özel Artisan Kâse" : "Özel Artisan Pasta",
      brand: brand,
      price: totalPrice,
      ingredients: allSelectedIngredients,
      isCustom: true
    });

    showToast("Başyapıtınız sepete eklendi!", "success");
    // İstersen burada mutfağa yönlendirebilirsin
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="w-16 h-16 border-4 border-brand-terracotta border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-white/40 font-serif italic text-xl">Malzemeler hazırlanıyor...</p>
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <div className="text-center py-40">
        <p className="text-white/40 font-serif italic text-xl">Şu anda DIY hizmetimiz kapalıdır.</p>
      </div>
    );
  }

  const isSummaryStep = currentStepIndex === steps.length;

  const accentColor = brand === 'cake' ? 'bg-brand-sand' : 'bg-brand-terracotta';
  const accentText = brand === 'cake' ? 'text-brand-sand' : 'text-brand-terracotta';
  const accentBorder = brand === 'cake' ? 'border-brand-sand/50' : 'border-brand-terracotta/50';
  const accentShadow = brand === 'cake' ? 'shadow-[0_0_30px_rgba(235,196,159,0.1)]' : 'shadow-[0_0_30px_rgba(234,88,12,0.1)]';
  const accentButtonShadow = brand === 'cake' ? 'shadow-[0_20px_50px_rgba(235,196,159,0.2)]' : 'shadow-[0_20px_50px_rgba(234,88,12,0.3)]';

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Progress Bar */}
      {!isSummaryStep && (
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className={cn("text-[10px] font-black tracking-[0.3em] uppercase mb-1", accentText)}>
                Adım {currentStepIndex + 1} / {steps.length}
              </p>
              <h2 className="text-3xl md:text-4xl font-serif text-white italic">{currentStep.name}</h2>
            </div>
            <div className="text-right">
              <p className="text-white/20 text-[9px] font-black uppercase tracking-widest">Gereksinim</p>
              <p className="text-white/60 text-xs font-bold">
                {currentStep.minSelect === 0 ? "Opsiyonel" : `En az ${currentStep.minSelect} seçim`}
              </p>
            </div>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className={cn("h-full", accentColor)}
              initial={{ width: 0 }}
              animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {!isSummaryStep ? (
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {currentStep.ingredients.map((ingredient) => {
                const isSelected = (selections[currentStep.id] || []).some(i => i.id === ingredient.id);
                return (
                  <button
                    key={ingredient.id}
                    onClick={() => handleToggleIngredient(ingredient)}
                    className={cn(
                      "relative flex items-center gap-4 p-5 rounded-3xl border transition-all duration-300 group overflow-hidden",
                      isSelected 
                        ? cn(brand === 'cake' ? "bg-brand-sand/10" : "bg-brand-terracotta/10", accentBorder, accentShadow) 
                        : "bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.07]"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                      isSelected ? cn(accentColor, brand === 'cake' ? 'text-brand-charcoal' : 'text-white', "scale-110") : "bg-white/5 text-white/20 group-hover:text-white/40"
                    )}>
                      {isSelected ? <Check className="w-6 h-6" /> : <Plus className="w-5 h-5" />}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h4 className="text-white font-bold text-lg">{ingredient.name}</h4>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-0.5">
                        {Number(ingredient.price) > 0 ? `+ ${ingredient.price} TL` : 'Ücretsiz'}
                      </p>
                    </div>

                    {/* Background Pattern */}
                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                      <ShoppingBag className="w-24 h-24" />
                    </div>
                  </button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-white/5 rounded-[40px] p-8 md:p-12 text-center"
            >
              <div className={cn("w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8", brand === 'cake' ? 'bg-brand-sand/20' : 'bg-brand-terracotta/20')}>
                <ShoppingBag className={cn("w-10 h-10", accentText)} />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-white italic mb-4">Mükemmel Seçim!</h2>
              <p className="text-white/40 text-lg mb-12 max-w-md mx-auto">
                Kendi artisan başyapıtınızı oluşturdunuz. İşte seçtiğiniz lezzetlerin özeti:
              </p>

              <div className="space-y-6 mb-12 max-w-lg mx-auto text-left">
                {steps.map(step => {
                  const stepSelections = selections[step.id] || [];
                  if (stepSelections.length === 0) return null;
                  return (
                    <div key={step.id} className="flex justify-between items-start border-b border-white/5 pb-4">
                      <div>
                        <p className={cn("text-[10px] font-black uppercase tracking-[0.2em] mb-1", accentText)}>{step.name}</p>
                        <p className="text-white/80 font-bold">{stepSelections.map(s => s.name).join(", ")}</p>
                      </div>
                      <p className="text-white/40 text-xs font-black">
                        {stepSelections.reduce((sum, s) => sum + Number(s.price), 0)} TL
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-end max-w-lg mx-auto mb-12">
                <span className="text-white/20 text-xs font-black uppercase tracking-[0.3em]">Toplam Tutar</span>
                <span className="text-5xl font-black text-white tracking-tighter">
                  {Object.values(selections).flat().reduce((sum, ing) => sum + Number(ing.price), 0)} TL
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                className={cn(
                  "w-full max-w-md py-6 rounded-[32px] font-black text-sm tracking-[0.2em] uppercase transition-all hover:scale-[1.02] active:scale-[0.98]",
                  accentColor,
                  brand === 'cake' ? 'text-brand-charcoal' : 'text-white',
                  accentButtonShadow
                )}
              >
                BU BENİM BAŞYAPITIM! SEPETE EKLE
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      {!isSummaryStep && (
        <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-12">
          <button
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-3 text-white/40 hover:text-white transition-colors disabled:opacity-0"
          >
            <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center">
              <ChevronLeft className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Geri Dön</span>
          </button>

          <button
            onClick={handleNext}
            disabled={isNextDisabled}
            className={cn(
              "flex items-center gap-4 px-8 py-5 rounded-3xl transition-all duration-300",
              isNextDisabled 
                ? "bg-white/5 text-white/10 cursor-not-allowed" 
                : "bg-white text-brand-charcoal hover:scale-105 active:scale-95"
            )}
          >
            <span className="text-[11px] font-black uppercase tracking-widest">
              {currentStepIndex === steps.length - 1 ? "Özeti Gör" : "Sıradaki Adım"}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
