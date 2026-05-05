"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Filter } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi, productsApi } from "@/lib/api";
import { useToast } from "@/components/ui/ToastProvider";
import ProductFormModal from "@/components/ui/ProductFormModal";

export default function AdminProductsPage() {
  const params = useParams();
  const brand = params.brand as string;
  const dbBrand = brand === "dycake" ? "DYCAKE" : "DYSALATTO";
  const isCake = brand === "dycake";
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  
  const primaryColor = isCake ? "text-brand-sand" : "text-brand-terracotta";
  const primaryBg = isCake ? "bg-brand-sand" : "bg-brand-terracotta";

  const [searchTerm, setSearchSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Queries
  const { data: productsRes, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products', dbBrand],
    queryFn: () => productsApi.getAll(brand)
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ['admin-categories', dbBrand],
    queryFn: () => fetchApi(`/categories?brand=${dbBrand}`)
  });

  const products = productsRes?.data || [];
  const categories = categoriesRes?.data || [];

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchApi(`/products/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showToast("Ürün başarıyla silindi.", "info");
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (product: any) => fetchApi(`/products/${product.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...product,
        status: product.status === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE',
        traitIds: product.traits?.map((t: any) => t.traitId),
        ingredientIds: product.ingredients?.map((i: any) => i.ingredientId)
      })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showToast("Ürün durumu güncellendi.", "success");
    }
  });

  const filteredProducts = products.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tümü" || p.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-serif mb-2">Ürün Yönetimi</h1>
          <p className="text-white/40 text-sm max-w-xl leading-relaxed">
            Mevcut ürünleri düzenleyin, stok durumlarını güncelleyin veya yeni artisan lezzetler ekleyin.
          </p>
        </div>
        <button 
          onClick={handleAdd}
          className={cn("flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl", primaryBg, isCake ? "text-[#111]" : "text-white")}
        >
          <Plus className="w-4 h-4" /> YENİ ÜRÜN EKLE
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px] relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
          <input 
            type="text"
            placeholder="Ürün ismi ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-white/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
          <Filter className="w-4 h-4 text-white/20" />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent text-sm text-white/60 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="Tümü">Tüm Kategoriler</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-transparent border border-white/5 rounded-[32px] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white/5 text-[10px] font-black tracking-[0.2em] text-white/40 uppercase text-left">
              <th className="p-6">Ürün</th>
              <th className="p-6">Kategori</th>
              <th className="p-6 text-center">Fiyat</th>
              <th className="p-6 text-center">Durum</th>
              <th className="p-6 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {productsLoading ? (
               <tr><td colSpan={5} className="p-12 text-center text-white/20 animate-pulse">Yükleniyor...</td></tr>
            ) : filteredProducts.length === 0 ? (
               <tr><td colSpan={5} className="p-12 text-center text-white/20">Ürün bulunamadı.</td></tr>
            ) : filteredProducts.map((p: any) => (
              <tr key={p.id} className={cn("hover:bg-white/[0.02] transition-colors group", p.status === 'HIDDEN' && "opacity-60")}>
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/5">
                      <img src={p.image || '/images/logo.png'} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">{p.name}</div>
                      <div className="text-[10px] text-white/30 truncate max-w-[200px]">{p.description}</div>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-md">{p.category?.name}</span>
                </td>
                <td className="p-6 text-center">
                   <div className="text-sm font-mono text-white/80">{Number(p.price).toLocaleString('tr-TR')} TL</div>
                </td>
                <td className="p-6 text-center">
                   <span className={cn(
                     "text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest",
                     p.status === 'ACTIVE' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                   )}>
                     {p.status === 'ACTIVE' ? 'AKTİF' : 'GİZLİ'}
                   </span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => toggleStatusMutation.mutate(p)}
                      className="p-2 text-white/20 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                      title={p.status === 'ACTIVE' ? "Gizle" : "Göster"}
                    >
                      {p.status === 'ACTIVE' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => handleEdit(p)}
                      className="p-2 text-white/20 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                      title="Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => { if(confirm("Emin misiniz?")) deleteMutation.mutate(p.id); }}
                      className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        brand={brand as any}
        product={editingProduct}
      />
    </div>
  );
}
