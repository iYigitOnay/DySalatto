'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Save, Check, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { useToast } from './ToastProvider';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: 'salatto' | 'cake';
  product?: any;
}

export default function ProductFormModal({ isOpen, onClose, brand, product }: ProductFormModalProps) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dbBrand = (brand === 'salatto' || brand === 'dysalatto') ? 'DYSALATTO' : 'DYCAKE';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    image: '',
    traitIds: [] as string[],
    ingredientIds: [] as string[],
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Queries - Filtered by Brand
  const { data: categoriesRes } = useQuery({
    queryKey: ['admin-categories', dbBrand],
    queryFn: () => fetchApi(`/categories?brand=${dbBrand}`)
  });

  const { data: traitGroupsRes } = useQuery({
    queryKey: ['admin-trait-groups', dbBrand],
    queryFn: () => fetchApi(`/traits/groups?brand=${dbBrand}`)
  });

  const { data: ingredientsRes } = useQuery({
    queryKey: ['admin-ingredients', dbBrand],
    queryFn: () => fetchApi(`/ingredients?brand=${dbBrand}`)
  });

  const categories = categoriesRes?.data || [];
  const traitGroups = traitGroupsRes?.data || [];
  const ingredients = ingredientsRes?.data || [];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        categoryId: product.categoryId || '',
        image: product.image || '',
        traitIds: product.traits?.map((t: any) => t.traitId) || [],
        ingredientIds: product.ingredients?.map((i: any) => i.ingredientId) || [],
      });
      setPreviewUrl(product.image ? `http://localhost:3001${product.image}` : '');
    } else {
      setFormData({
        name: '', description: '', price: '', categoryId: '', image: '', traitIds: [], ingredientIds: [],
      });
      setPreviewUrl('');
    }
    setSelectedFile(null);
  }, [product, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const mutation = useMutation({
    mutationFn: (data: any) => {
      const url = product ? `/products/${product.id}` : '/products';
      const method = product ? 'PUT' : 'POST';
      
      // multipart/form-data for file upload
      const formDataToSend = new FormData();
      formDataFiles(formDataToSend, data);
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      } else if (data.image) {
        formDataToSend.append('image', data.image);
      }

      return fetch(`http://localhost:3001/api${url}`, {
        method,
        body: formDataToSend,
        credentials: "include",
      }).then(res => res.json());
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        showToast(`Ürün başarıyla ${product ? 'güncellendi' : 'eklendi'}.`, 'success');
        onClose();
      } else {
        showToast(res.message || "Bir hata oluştu", "error");
      }
    },
    onError: (error: any) => showToast(error.message, 'error')
  });

  const formDataFiles = (fd: FormData, data: any) => {
    fd.append('brand', dbBrand);
    fd.append('name', data.name);
    fd.append('description', data.description);
    fd.append('price', data.price);
    fd.append('categoryId', data.categoryId);
    fd.append('traitIds', JSON.stringify(data.traitIds));
    fd.append('ingredientIds', JSON.stringify(data.ingredientIds));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const toggleItem = (id: string, field: 'traitIds' | 'ingredientIds') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(id) 
        ? prev[field].filter(item => item !== id)
        : [...prev[field], id]
    }));
  };

  if (!isOpen) return null;

  const accentColor = brand === 'cake' ? 'bg-brand-sand text-black' : 'bg-brand-terracotta text-white';
  const accentBorder = brand === 'cake' ? 'focus:border-brand-sand' : 'focus:border-brand-terracotta';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-[#0d0d0d] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between p-8 border-b border-white/5">
            <div>
              <h2 className="text-3xl font-serif text-white">{product ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h2>
              <p className="text-white/40 text-xs uppercase tracking-widest mt-1">{brand === 'salatto' ? 'DySalatto Mutfağı' : 'DyCake Atölyesi'}</p>
            </div>
            <button onClick={onClose} className="p-3 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"><X className="w-6 h-6" /></button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                {/* Image Upload Area */}
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-white/40 uppercase mb-3">Ürün Görseli</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative h-48 w-full rounded-3xl border-2 border-dashed border-white/10 bg-white/5 hover:border-white/20 transition-all cursor-pointer overflow-hidden group"
                  >
                    {previewUrl ? (
                      <>
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="w-8 h-8 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-white/20">
                        <ImageIcon className="w-10 h-10 mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Görsel Seç veya Sürükle</span>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>

                <div>
                  <label className="block text-[10px] font-black tracking-widest text-white/40 uppercase mb-3">Ürün Adı</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={cn("w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none transition-all", accentBorder)} placeholder="Örn: Protein Kâsesi" required />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black tracking-widest text-white/40 uppercase mb-3">Kategori</label>
                    <select value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} className={cn("w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none transition-all appearance-none", accentBorder)} required>
                      <option value="" disabled>Seçiniz...</option>
                      {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black tracking-widest text-white/40 uppercase mb-3">Fiyat (TL)</label>
                    <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className={cn("w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none transition-all", accentBorder)} placeholder="0.00" required />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black tracking-widest text-white/40 uppercase mb-3">Açıklama</label>
                  <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className={cn("w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none transition-all min-h-[100px] resize-none", accentBorder)} placeholder="Ürün içeriği ve detayları..." />
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-white/40 uppercase mb-4 text-brand-sand">Beslenme Özellikleri</label>
                  <div className="space-y-6 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {traitGroups.map((group: any) => (
                      <div key={group.id}>
                        <p className="text-[9px] font-bold text-white/20 uppercase mb-2">{group.name}</p>
                        <div className="flex flex-wrap gap-2">
                          {group.traits.map((trait: any) => (
                            <button key={trait.id} type="button" onClick={() => toggleItem(trait.id, 'traitIds')} className={cn("px-4 py-2 rounded-xl text-[10px] font-bold border transition-all flex items-center gap-2", formData.traitIds.includes(trait.id) ? "bg-white text-black border-white" : "bg-white/5 text-white/40 border-white/5 hover:border-white/20")}>
                              {formData.traitIds.includes(trait.id) && <Check className="w-3 h-3" />}
                              {trait.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black tracking-widest text-white/40 uppercase mb-4 text-brand-terracotta">Standart İçindekiler (Reçete)</label>
                  <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {ingredients.map((ing: any) => (
                      <button key={ing.id} type="button" onClick={() => toggleItem(ing.id, 'ingredientIds')} className={cn("px-3 py-2 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-2", formData.ingredientIds.includes(ing.id) ? "bg-white/20 text-white border-white/40" : "bg-white/5 text-white/30 border-white/5 hover:border-white/10")}>
                        {ing.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 flex justify-end gap-4">
               <button type="button" onClick={onClose} className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">İPTAL</button>
               <button type="submit" disabled={mutation.isPending} className={cn("px-12 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all flex items-center gap-3", accentColor, mutation.isPending && "opacity-50")}>
                 {mutation.isPending ? 'KAYDEDİLİYOR...' : <>{product ? 'GÜNCELLE' : 'ÜRÜNÜ OLUŞTUR'} <Save className="w-4 h-4" /></>}
               </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
