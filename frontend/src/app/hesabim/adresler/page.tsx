"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Trash2, Edit2, X, Home, Briefcase, Navigation, Phone, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";

export default function AddressesPage() {
  const pathname = usePathname();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const isCakePage = pathname?.startsWith("/cake") || pathname?.includes("brand=cake");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const { data: addressesRes, isLoading } = useQuery({
    queryKey: ["my-addresses"],
    queryFn: () => fetchApi("/addresses"),
  });

  const addresses = addressesRes?.data || [];

  const accentColor = isCakePage ? "text-brand-sand" : "text-brand-terracotta";
  const accentBtn = isCakePage ? "bg-brand-sand text-brand-charcoal" : "bg-brand-terracotta text-white";

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newAddr: any) => fetchApi("/addresses", { method: "POST", body: JSON.stringify(newAddr) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-addresses"] });
      showToast("Adres başarıyla eklendi.", "success");
      setIsModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (addr: any) => fetchApi(`/addresses/${addr.id}`, { method: "PUT", body: JSON.stringify(addr) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-addresses"] });
      showToast("Adres güncellendi.", "success");
      setIsModalOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchApi(`/addresses/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-addresses"] });
      showToast("Adres silindi.", "info");
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    if (editingAddress) {
      updateMutation.mutate({ ...data, id: editingAddress.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (addr: any) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="animate-pulse space-y-6">
    <div className="h-10 w-48 bg-white/5 rounded-xl" />
    <div className="grid md:grid-cols-2 gap-6">
      {[1, 2].map(i => <div key={i} className="h-48 bg-white/5 rounded-[32px]" />)}
    </div>
  </div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5", accentColor)}>
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-serif text-white italic">Adreslerim</h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Kayıtlı Teslimat Adresleriniz</p>
          </div>
        </div>
        <button 
          onClick={() => { setEditingAddress(null); setIsModalOpen(true); }}
          className={cn("group flex items-center gap-3 px-6 py-4 rounded-3xl transition-all shadow-2xl hover:scale-105 active:scale-95 font-black text-[11px] uppercase tracking-widest", accentBtn)}
        >
          <Plus className="w-4 h-4" />
          Yeni Adres Ekle
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
          <Navigation className="w-16 h-16 text-white/10 mx-auto mb-6" />
          <p className="text-white/40 font-serif italic text-xl">Henüz bir adres eklemediniz.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {addresses.map((addr: any) => (
              <motion.div
                key={addr.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-[32px] p-8 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-white/5", accentColor)}>
                      {addr.title.toLowerCase().includes("ev") ? <Home className="w-5 h-5" /> : 
                       addr.title.toLowerCase().includes("iş") ? <Briefcase className="w-5 h-5" /> : 
                       <MapPin className="w-5 h-5" />}
                    </div>
                    <h4 className="text-white font-bold text-lg">{addr.title}</h4>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(addr)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteMutation.mutate(addr.id)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-white/60 text-sm leading-relaxed min-h-[3rem]">
                    {addr.neighborhood} Mah. {addr.street} <br />
                    No: {addr.buildingNo} Kat: {addr.floor} Daire: {addr.apartmentNo} <br />
                    {addr.district} / {addr.city}
                  </p>
                  {addr.directions && (
                     <p className="text-white/30 text-xs italic">Not: {addr.directions}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[250]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#111] border border-white/10 rounded-[40px] z-[260] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-2xl font-serif text-white italic">
                  {editingAddress ? "Adresi Düzenle" : "Yeni Adres Ekle"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/20 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-4 mb-2 block">Adres Başlığı (Ev, İş vb.)</label>
                    <input name="title" defaultValue={editingAddress?.title} placeholder="Örn: Evim" required className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-3 text-white focus:outline-none focus:border-white/10 transition-colors text-sm" />
                  </div>
                  
                  {/* Hidden City Input - Hardcoded to İstanbul */}
                  <input type="hidden" name="city" value="İstanbul" />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-4 mb-2 block">İlçe</label>
                        <input name="district" defaultValue={editingAddress?.district} placeholder="Örn: Beşiktaş" required className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-3 text-white focus:outline-none focus:border-white/10 transition-colors text-sm" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-4 mb-2 block">Mahalle</label>
                        <input name="neighborhood" defaultValue={editingAddress?.neighborhood} placeholder="Örn: Bebek Mah." required className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-3 text-white focus:outline-none focus:border-white/10 transition-colors text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-4 mb-2 block">Sokak / Cadde / Bina / Daire</label>
                    <textarea name="street" defaultValue={editingAddress?.street} placeholder="Örn: Cevdetpaşa Cad. No:12 D:4" required rows={2} className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-3 text-white focus:outline-none focus:border-white/10 transition-colors resize-none text-sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-4 mb-2 block">Telefon</label>
                        <input name="phone" defaultValue={editingAddress?.phone} placeholder="05xx..." required className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-3 text-white focus:outline-none focus:border-white/10 transition-colors text-sm" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-4 mb-2 block">Adres Tarifi (Opsiyonel)</label>
                        <input name="directions" defaultValue={editingAddress?.directions} placeholder="Örn: Parkın yanı" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-3 text-white focus:outline-none focus:border-white/10 transition-colors text-sm" />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className={cn("w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50", accentBtn)}
                >
                  {createMutation.isPending || updateMutation.isPending ? "Kaydediliyor..." : "Adresi Kaydet"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
