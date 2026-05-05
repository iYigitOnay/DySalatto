"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, ArrowRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

const FloatingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();
  const isCakePage = pathname?.startsWith("/cake");

  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (totalItems === 0) return null;

  const accentColor = isCakePage
    ? "bg-brand-sand text-[#110C08]"
    : "bg-brand-terracotta text-white";
  const accentBorder = isCakePage
    ? "border-brand-sand/30"
    : "border-brand-terracotta/30";
  const accentText = isCakePage ? "text-brand-sand" : "text-brand-terracotta";

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-8 left-8 z-[140]"
      >
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group",
            accentColor,
          )}
        >
          <ShoppingBag className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-white text-[#110C08] rounded-full flex items-center justify-center text-[10px] font-black shadow-lg border-2 border-current">
            {totalItems}
          </span>

          {/* Ambient Glow */}
          <div
            className={cn(
              "absolute inset-0 rounded-full blur-xl opacity-40 -z-10 animate-pulse",
              isCakePage ? "bg-brand-sand" : "bg-brand-terracotta",
            )}
          />
        </button>
      </motion.div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 z-[200]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "circOut" }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-[350px] bg-[#0a0a0a] z-[210] flex flex-col border-r border-white/5 shadow-[30px_0_60px_rgba(0,0,0,0.8)] will-change-transform"
            >
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-serif text-white italic">Artisan <span className={accentText}>Sepetiniz</span></h2>
                  <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.2em] mt-1">{totalItems} Ürün Seçildi</p>
                </div>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors border border-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-hide overscroll-contain">
                {items.map((item) => (
                  <motion.div 
                    layout
                    key={item.id} 
                    className="flex gap-4 md:gap-6 group"
                  >

                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/5 shrink-0 bg-white/5">
                      <img
                        src={item.image || (isCakePage ? "/images/forDYCake/DyCakeLogo.png" : "/images/forDYSalatto/DySalattoLogo.png")}
                        className="w-full h-full object-cover"
                        alt={item.name}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-white font-bold truncate pr-4">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-white/10 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {item.isCustom ? (
                        <p className="text-white/30 text-[9px] mb-4 uppercase tracking-tighter leading-tight">
                          {item.ingredients?.map(ing => ing.name).join(", ")}
                        </p>
                      ) : (
                        <p className="text-white/30 text-[11px] mb-4">
                          {item.product?.category || "Menü"}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-white/5 rounded-xl p-1 border border-white/5">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, -1)
                            }
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:bg-white/5 hover:text-white transition-all"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-black text-white min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:bg-white/5 hover:text-white transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-sm font-black text-white tracking-tighter">
                          {Number(item.price) * item.quantity} TL
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer / Summary */}
              <div className="p-8 bg-white/[0.02] border-t border-white/5 space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
                    Toplam Tutar
                  </span>
                  <span
                    className={cn(
                      "text-3xl font-black tracking-tighter",
                      accentText,
                    )}
                  >
                    {totalPrice} TL
                  </span>
                </div>

                <button
                  className={cn(
                    "w-full py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl",
                    accentColor,
                  )}
                >
                  Siparişi Tamamla
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-white/10 text-[9px] font-bold uppercase tracking-widest">
                  KDV DAHİL • ÜCRETSİZ ARTISAN TESLİMAT
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingCart;
