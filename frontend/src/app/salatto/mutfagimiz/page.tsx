'use client';

import React, { useState, useMemo } from 'react';
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import KitchenFilter, { FilterState } from "@/components/sections/KitchenFilter";
import KitchenProductCard from "@/components/sections/KitchenProductCard";
import { MOCK_PRODUCTS, Product } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";
import FloatingCart from "@/components/ui/FloatingCart";
import { useToast } from "@/components/ui/ToastProvider";

export default function SalattoKitchenPage() {
  const { showToast } = useToast();
  const [cartItems, setCartItems] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'Tümü',
    dietary: [],
    ingredients: [],
  });

  const categories = ['Bowl', 'Wrap', 'Salata', 'İçecek'];

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      if (p.brand !== 'salatto') return false;
      
      // Search check
      const searchMatch = !filters.search || 
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.search.toLowerCase());
      
      // Category check
      const categoryMatch = filters.category === 'Tümü' || p.category === filters.category;

      // Dietary check
      const dietaryMatch = filters.dietary.length === 0 || 
        filters.dietary.every(tag => p.dietaryTags.includes(tag));

      // Ingredient check (Granular)
      const ingredientMatch = filters.ingredients.length === 0 || 
        filters.ingredients.every(id => p.ingredients.includes(id));

      return searchMatch && categoryMatch && dietaryMatch && ingredientMatch;
    });
  }, [filters]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`${product.name} sepete eklendi.`, 'success');
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (productId: string) => {
    const item = cartItems.find(i => i.product.id === productId);
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    if (item) showToast(`${item.product.name} sepetten çıkarıldı.`, 'info');
  };

  return (
    <main className="min-h-screen bg-brand-charcoal selection:bg-brand-terracotta/30">
      <Navbar />

      {/* Header Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <p className="text-[10px] font-black tracking-[0.5em] text-brand-terracotta uppercase mb-4">Mutfağımızdan Sofranıza</p>
          <h1 className="text-5xl md:text-8xl font-serif text-white italic leading-tight">
            Tazeliğin <br /> <span className="text-brand-terracotta not-italic font-sans font-black uppercase tracking-tighter">İmza Lezzetleri</span>
          </h1>
          <p className="text-white/40 text-lg mt-8 max-w-2xl leading-relaxed">
            Her bir kâse, tarladan yeni hasat edilmiş malzemeler ve şeflerimizin artisan teknikleriyle size özel hazırlanıyor.
          </p>
        </div>
        
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 w-[50vw] h-full bg-gradient-to-l from-brand-terracotta/5 to-transparent pointer-events-none" />
      </section>

      {/* Filter Station */}
      <KitchenFilter 
        brand="salatto" 
        categories={categories} 
        onFilterChange={setFilters} 
      />

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-40">
        <div className="flex items-center justify-between mb-12">
            <h2 className="text-white/20 text-xs font-black tracking-[0.4em] uppercase">
                {filteredProducts.length} Ürün Listeleniyor
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <KitchenProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart} 
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-40 border-2 border-dashed border-white/5 rounded-[40px]"
            >
                <p className="text-white/20 font-serif italic text-2xl">Aradığınız kriterlere uygun lezzet bulamadık.</p>
                <button 
                    onClick={() => setFilters({ search: '', category: 'Tümü', dietary: [], ingredients: [] })}
                    className="mt-6 text-brand-terracotta text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                >
                    Filtreleri Sıfırla
                </button>
            </motion.div>
        )}
      </section>

      <FloatingCart 
        items={cartItems} 
        onUpdateQuantity={handleUpdateQuantity} 
        onRemove={handleRemoveFromCart} 
      />
      <Footer />
    </main>
  );
}
