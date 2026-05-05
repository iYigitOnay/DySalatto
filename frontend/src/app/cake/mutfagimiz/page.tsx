'use client';

import React, { useState, useMemo } from 'react';
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import KitchenFilter, { FilterState } from "@/components/sections/KitchenFilter";
import KitchenProductCard from "@/components/sections/KitchenProductCard";
import { productsApi, categoriesApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import FloatingCart from "@/components/ui/FloatingCart";
import { useToast } from "@/components/ui/ToastProvider";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/components/providers/AuthProvider';
import ProductFormModal from '@/components/ui/ProductFormModal';
import { Plus } from 'lucide-react';

export default function CakeKitchenPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const { showToast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [cartItems, setCartItems] = useState<Array<{ product: any; quantity: number }>>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'Tümü',
    dietary: [],
    ingredients: [],
  });

  // Kategorileri Query ile çekiyoruz
  const { data: categoriesRes, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories', 'cake'],
    queryFn: () => categoriesApi.getAll('cake')
  });

  // Ürünleri Query ile çekiyoruz
  const { data: productsRes, isLoading: productsLoading } = useQuery({
    queryKey: ['products', 'cake', filters.categoryId],
    queryFn: () => productsApi.getAll('cake', filters.categoryId)
  });

  const products = productsRes?.data || [];
  const categories = categoriesRes?.data || [];

  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => {
      // Search check
      const searchMatch = !filters.search || 
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(filters.search.toLowerCase()));
      
      // Dietary check (Traits)
      const dietaryMatch = filters.dietary.length === 0 || 
        filters.dietary.every(tagName => p.traits.some((t: any) => t.trait.name === tagName));

      // Ingredient check
      const ingredientMatch = filters.ingredients.length === 0 || 
        filters.ingredients.every(ingId => p.ingredients.some((i: any) => i.ingredientId === ingId));

      return searchMatch && dietaryMatch && ingredientMatch;
    });
  }, [filters, products]);

  const handleAddToCart = (product: any) => {
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

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const loading = categoriesLoading || productsLoading;

  return (
    <main className="min-h-screen bg-brand-charcoal selection:bg-brand-sand/30">
      <Navbar />

      {/* Header Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black tracking-[0.5em] text-brand-sand uppercase mb-4">Artisan Atölyemizden</p>
              <h1 className="text-5xl md:text-8xl font-serif text-white italic leading-tight">
                Tatlının <br /> <span className="text-brand-sand not-italic font-sans font-black uppercase tracking-tighter">Hafif Sanatı</span>
              </h1>
            </div>
            {isAdmin && (
              <button 
                onClick={handleAddProduct}
                className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-4 rounded-3xl transition-all shadow-2xl"
              >
                <div className="bg-brand-sand p-2 rounded-xl group-hover:scale-110 transition-transform text-black">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-white">YENİ ÜRÜN EKLE</span>
              </button>
            )}
          </div>
          <p className="text-white/40 text-lg mt-8 max-w-2xl leading-relaxed">
            Rafine şekersiz ve glutensiz başyapıtlarımız, butik pastacılık anlayışıyla her gün taze olarak elden çıkıyor.
          </p>
        </div>
        
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 w-[50vw] h-full bg-gradient-to-l from-brand-sand/5 to-transparent pointer-events-none" />
      </section>

      {/* Filter Station */}
      <KitchenFilter 
        brand="cake" 
        categories={categories} 
        onFilterChange={setFilters} 
      />

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-40">
        <div className="flex items-center justify-between mb-12">
            <h2 className="text-white/20 text-xs font-black tracking-[0.4em] uppercase">
                {filteredProducts.length} Başyapıt Listeleniyor
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product: any) => (
              <KitchenProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart} 
                onEdit={isAdmin ? () => handleEditProduct(product) : undefined}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && !loading && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-40 border-2 border-dashed border-white/5 rounded-[40px]"
            >
                <p className="text-white/20 font-serif italic text-2xl">Aradığınız kriterlere uygun bir tatlı bulamadık.</p>
                <button 
                    onClick={() => setFilters({ search: '', category: 'Tümü', dietary: [], ingredients: [] })}
                    className="mt-6 text-brand-sand text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                >
                    Filtreleri Sıfırla
                </button>
            </motion.div>
        )}

        {loading && (
          <div className="text-center py-40">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-sand mx-auto"></div>
             <p className="text-white/40 mt-4 font-serif italic">Pastalarımız fırından çıkıyor...</p>
          </div>
        )}
      </section>

      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        brand="cake"
        product={editingProduct}
      />

      <FloatingCart 
        items={cartItems} 
        onUpdateQuantity={handleUpdateQuantity} 
        onRemove={handleRemoveFromCart} 
      />
      <Footer />
    </main>
  );
}
