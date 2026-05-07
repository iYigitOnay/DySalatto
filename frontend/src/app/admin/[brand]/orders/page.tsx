'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Package, Clock, CheckCircle2, Truck, 
  MapPin, Phone, User, ShoppingBag, 
  ChevronRight, RefreshCw, Filter, 
  MoreVertical, ChefHat, Timer, 
  AlertCircle, Check, X,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastProvider';

const statusConfig = {
  PENDING: { label: 'YENİ', color: 'text-blue-400 border-blue-500/20 bg-blue-500/5', icon: AlertCircle },
  PREPARING: { label: 'MUTFAKTA', color: 'text-orange-400 border-orange-500/20 bg-orange-500/5', icon: Timer },
  SHIPPED: { label: 'YOLDA', color: 'text-purple-400 border-purple-500/20 bg-purple-500/5', icon: Truck },
  DELIVERED: { label: 'TESLİM', color: 'text-green-400 border-green-500/20 bg-green-500/5', icon: CheckCircle2 },
  CANCELLED: { label: 'İPTAL', color: 'text-red-400 border-red-500/20 bg-red-500/5', icon: X },
};

export default function AdminOrdersPage() {
  const params = useParams();
  const brand = params.brand as string;
  const dbBrand = brand === 'dycake' ? 'DYCAKE' : 'DYSALATTO';
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<keyof typeof statusConfig | 'ALL'>('PENDING');

  // Queries
  const { data: ordersRes, isLoading } = useQuery({
    queryKey: ['admin-orders', dbBrand],
    queryFn: () => fetchApi(`/orders/admin?brand=${dbBrand}`),
    refetchInterval: 30000, 
  });

  const allOrders = ordersRes?.data || [];
  const filteredOrders = activeTab === 'ALL' 
    ? allOrders 
    : allOrders.filter((o: any) => o.status === activeTab);

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      fetchApi(`/orders/admin/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      showToast("Sipariş durumu güncellendi.", "success");
    }
  });

  const accentColor = brand === 'dycake' ? 'text-brand-sand' : 'text-brand-terracotta';
  const accentBg = brand === 'dycake' ? 'bg-brand-sand' : 'bg-brand-terracotta';

  return (
    <div className="space-y-12 pb-40">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
           <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl", accentBg)}>
              <ChefHat className={cn("w-8 h-8", brand === 'dycake' ? "text-[#111]" : "text-white")} />
           </div>
           <div>
              <h1 className="text-4xl md:text-5xl font-serif text-white italic leading-tight">Sipariş <span className={accentColor}>Terminali</span></h1>
              <p className="text-white/30 text-xs uppercase tracking-[0.3em] font-black mt-1">Canlı Mutfak Yönetimi</p>
           </div>
        </div>
        <button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-orders'] })}
          className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-white/10 transition-all active:scale-95"
        >
          <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} /> YENİLE
        </button>
      </div>

      {/* Tabs / Filters (Consistent Underlined Style) */}
      <div className="flex gap-8 border-b border-white/5 relative overflow-x-auto scrollbar-hide">
        {[
          { id: 'PENDING', label: 'Yeni', count: allOrders.filter((o: any) => o.status === 'PENDING').length },
          { id: 'PREPARING', label: 'Mutfakta', count: allOrders.filter((o: any) => o.status === 'PREPARING').length },
          { id: 'SHIPPED', label: 'Yolda', count: allOrders.filter((o: any) => o.status === 'SHIPPED').length },
          { id: 'DELIVERED', label: 'Tamamlanan', count: allOrders.filter((o: any) => o.status === 'DELIVERED').length },
          { id: 'ALL', label: 'Tümü', count: allOrders.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "pb-6 text-[11px] font-black uppercase tracking-widest transition-all relative flex items-center gap-3 whitespace-nowrap",
              activeTab === tab.id ? "text-white" : "text-white/30 hover:text-white/60"
            )}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all",
                activeTab === tab.id ? accentBg + " text-black shadow-lg scale-110" : "bg-white/5 text-white/40"
              )}>
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <motion.div layoutId="orderTabLine" className={cn("absolute bottom-0 left-0 right-0 h-0.5", accentBg)} />
            )}
          </button>
        ))}
      </div>

      {/* Orders List (Consistent with Menu Management style) */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="py-20 text-center animate-pulse"><RefreshCw className="w-8 h-8 text-white/10 animate-spin mx-auto" /></div>
          ) : filteredOrders.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-20 text-center border-2 border-dashed border-white/5 rounded-[40px] text-white/20 font-serif italic text-lg">Şu an aktif sipariş bulunmuyor.</motion.div>
          ) : (
            filteredOrders.map((subOrder: any) => (
              <motion.div
                layout
                key={subOrder.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0d0d0d] border border-white/5 rounded-[32px] overflow-hidden hover:border-white/10 transition-all group"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 items-center p-6 md:p-8 gap-6">
                   {/* Order ID & Status */}
                   <div className="md:col-span-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1.5">Sipariş No</p>
                      <div className="flex items-center gap-3">
                         <span className="font-mono text-white text-lg font-bold">#{subOrder.order.orderNumber}</span>
                         <div className={cn("px-2.5 py-1 rounded-xl border text-[8px] font-black uppercase tracking-tighter", statusConfig[subOrder.status as keyof typeof statusConfig].color)}>
                            {statusConfig[subOrder.status as keyof typeof statusConfig].label}
                         </div>
                      </div>
                   </div>

                   {/* Customer & Address */}
                   <div className="md:col-span-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1.5">Müşteri / Adres</p>
                      <h4 className="text-white font-serif italic text-lg truncate">{subOrder.order.user.name}</h4>
                      <p className="text-[11px] text-white/30 truncate uppercase tracking-widest font-bold">{subOrder.order.address.title} - {subOrder.order.address.neighborhood}</p>
                   </div>

                   {/* Items Summary (Badges) */}
                   <div className="md:col-span-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1.5">İçerik ({subOrder.items.length})</p>
                      <div className="flex flex-wrap gap-2">
                         {subOrder.items.map((item: any, idx: number) => (
                           <span key={idx} className="bg-white/5 px-3 py-1.5 rounded-xl text-[10px] font-bold text-white/40 group-hover:text-white/60 transition-colors border border-white/5">
                              {item.quantity}x {item.product?.name || (item.isCustom ? 'Özel Artisan' : 'Ürün')}
                           </span>
                         ))}
                      </div>
                   </div>

                   {/* Amount */}
                   <div className="md:col-span-1 text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1.5">Tutar</p>
                      <span className="text-xl font-black text-white tracking-tighter">₺{Number(subOrder.totalAmount).toFixed(2)}</span>
                   </div>

                   {/* Actions (Consistent Dropdown & Details) */}
                   <div className="md:col-span-2 text-right flex items-center justify-end gap-3">
                      <div className="relative flex-1 max-w-[120px]">
                        <select 
                          onChange={(e) => updateStatusMutation.mutate({ id: subOrder.id, status: e.target.value })}
                          value={subOrder.status}
                          className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/40 focus:outline-none appearance-none cursor-pointer hover:bg-white/10 transition-all"
                        >
                           <option value="PENDING">Yeni</option>
                           <option value="PREPARING">Mutfak</option>
                           <option value="SHIPPED">Kurye</option>
                           <option value="DELIVERED">Teslim</option>
                           <option value="CANCELLED">İptal</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/10 pointer-events-none" />
                      </div>
                      <button className="p-3 rounded-2xl bg-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all active:scale-95 border border-white/5">
                         <MoreVertical className="w-5 h-5" />
                      </button>
                   </div>
                </div>

                {/* Details Section (Shown on card hover/click) */}
                <div className="max-h-0 group-hover:max-h-[800px] overflow-hidden transition-all duration-1000 ease-in-out bg-white/[0.01]">
                   <div className="p-8 md:p-10 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
                      {/* Left: Detailed Recipe */}
                      <div className="space-y-6">
                         <div className="flex items-center gap-3">
                            <ShoppingBag className="w-4 h-4 text-white/20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Detaylı Reçete & Özelleştirme</p>
                         </div>
                         <div className="space-y-4">
                            {subOrder.items.map((item: any) => {
                              const removedIngredients = item.removedIngredients ? JSON.parse(item.removedIngredients) : [];
                              return (
                                <div key={item.id} className="bg-white/5 rounded-[24px] p-6 border border-white/5 group/item">
                                   <div className="flex justify-between items-start mb-4">
                                      <div className="flex items-center gap-4">
                                         <span className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-xs font-black text-white border border-white/10">{item.quantity}x</span>
                                         <h4 className="text-white font-serif italic text-lg">{item.product?.name || 'Artisan Seçim'}</h4>
                                      </div>
                                      <span className="text-sm font-mono text-white/40">₺{item.priceAtTime}</span>
                                   </div>
                                   
                                   {(item.selectedIngredients?.length > 0 || removedIngredients.length > 0) && (
                                     <div className="pl-14 space-y-3">
                                        {item.selectedIngredients.map((ing: any) => (
                                          <div key={ing.id} className="text-[10px] text-green-500/70 font-black uppercase tracking-widest flex items-center gap-2">
                                             <Plus className="w-3 h-3" /> {ing.ingredient.name} <span className="text-[8px] opacity-40 ml-1">(Ekstra)</span>
                                          </div>
                                        ))}
                                        {removedIngredients.map((id: string) => (
                                          <div key={id} className="text-[10px] text-red-500/50 font-black uppercase tracking-widest flex items-center gap-2 line-through">
                                             <X className="w-3 h-3" /> Malzeme Çıkarıldı
                                          </div>
                                        ))}
                                     </div>
                                   )}
                                </div>
                              )
                            })}
                         </div>
                      </div>

                      {/* Right: Notes & Logistics */}
                      <div className="space-y-8">
                         <div className="space-y-6">
                            <div className="flex items-center gap-3">
                               <MessageSquare className="w-4 h-4 text-white/20" />
                               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Müşteri Notu</p>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-[24px] p-6 text-sm text-white/50 italic leading-relaxed">
                               "{subOrder.order.note || 'Müşteri herhangi bir özel not bırakmamış.'}"
                            </div>
                         </div>

                         <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-3">
                               <MapPin className="w-4 h-4 text-white/20" />
                               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Lojistik & İletişim</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <button className="py-4 rounded-2xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-white/10 transition-all border border-white/5 flex items-center justify-center gap-3">
                                  <Phone className="w-4 h-4" /> ARA
                               </button>
                               <button className="py-4 rounded-2xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-white/10 transition-all border border-white/5 flex items-center justify-center gap-3">
                                  <ExternalLink className="w-4 h-4" /> HARİTA
                               </button>
                            </div>
                            <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5">
                               <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-3">Tam Adres</p>
                               <p className="text-xs text-white/40 leading-relaxed font-medium">
                                  {subOrder.order.address.neighborhood}, {subOrder.order.address.street} <br />
                                  No:{subOrder.order.address.buildingNo} Kat:{subOrder.order.address.floor} D:{subOrder.order.address.apartmentNo} <br />
                                  {subOrder.order.address.district} / {subOrder.order.address.city}
                                </p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
