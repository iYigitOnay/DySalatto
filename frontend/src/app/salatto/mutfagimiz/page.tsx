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
import { useCartStore } from "@/store/cartStore";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/components/providers/AuthProvider';
import ProductFormModal from '@/components/ui/ProductFormModal';
import { Plus } from 'lucide-react';

export default function SalattoKitchenPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const { showToast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const { addItem } = useCartStore();
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'Tümü',
    dietary: [],
    ingredients: [],
  });

  // Kategorileri Query ile çekiyoruz
  const { data: categoriesRes, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories', 'salatto'],
    queryFn: () => categoriesApi.getAll('salatto')
  });

  // Ürünleri Query ile çekiyoruz
  const { data: productsRes, isLoading: productsLoading } = useQuery({
    queryKey: ['products', 'salatto', filters.categoryId],
    queryFn: () => productsApi.getAll('salatto', filters.categoryId)
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
    addItem({
      id: product.id,
      product: product,
      name: product.name,
      brand: 'salatto',
      price: Number(product.price),
      image: product.image,
      isCustom: false
    });
    showToast(`${product.name} sepete eklendi.`, 'success');
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
    <main className="min-h-screen bg-brand-charcoal selection:bg-brand-terracotta/30">
      <Navbar />

      {/* Header Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black tracking-[0.5em] text-brand-terracotta uppercase mb-4">Mutfağımızdan Sofranıza</p>
              <h1 className="text-5xl md:text-8xl font-serif text-white italic leading-tight">
                Tazeliğin <br /> <span className="text-brand-terracotta not-italic font-sans font-black uppercase tracking-tighter">İmza Lezzetleri</span>
              </h1>
            </div>
            {isAdmin && (
              <button 
                onClick={handleAddProduct}
                className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-4 rounded-3xl transition-all shadow-2xl"
              >
                <div className="bg-brand-terracotta p-2 rounded-xl group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-white">YENİ ÜRÜN EKLE</span>
              </button>
            )}
          </div>
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
                <p className="text-white/20 font-serif italic text-2xl">Aradığınız kriterlere uygun lezzet bulamadık.</p>
                <button 
                    onClick={() => setFilters({ search: '', category: 'Tümü', dietary: [], ingredients: [] })}
                    className="mt-6 text-brand-terracotta text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                >
                    Filtreleri Sıfırla
                </button>
            </motion.div>
        )}

        {loading && (
          <div className="text-center py-40">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-terracotta mx-auto"></div>
             <p className="text-white/40 mt-4 font-serif italic">Lezzetler hazırlanıyor...</p>
          </div>
        )}
      </section>

      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        brand="salatto"
        product={editingProduct}
      />

      <FloatingCart />
      <Footer />
    </main>
  );
}
