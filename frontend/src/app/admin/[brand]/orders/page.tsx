'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Package, Clock, CheckCircle2, Truck, 
  MapPin, Phone, User, ShoppingBag, 
  ChevronRight, RefreshCw, Filter, 
  MoreVertical, ChefHat, Timer, 
  AlertCircle, Check, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastProvider';

const statusConfig = {
  PENDING: { label: 'YENİ', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: AlertCircle },
  PREPARING: { label: 'HAZIRLANIYOR', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20', icon: Timer },
  SHIPPED: { label: 'KURYEDE', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', icon: Truck },
  DELIVERED: { label: 'TESLİM EDİLDİ', color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle2 },
  CANCELLED: { label: 'İPTAL', color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: X },
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
    refetchInterval: 30000, // Her 30 saniyede bir otomatik yenile
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
    <div className="space-y-10 pb-40">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
           <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl", accentBg)}>
              <ChefHat className={cn("w-8 h-8", brand === 'dycake' ? "text-[#111]" : "text-white")} />
           </div>
           <div>
              <h1 className="text-4xl md:text-5xl font-serif text-white italic leading-tight">Mutfak <span className={accentColor}>Terminali</span></h1>
              <p className="text-white/30 text-xs uppercase tracking-[0.3em] font-black mt-1">Canlı Sipariş Takibi</p>
           </div>
        </div>
        <button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-orders'] })}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-xs font-black uppercase tracking-widest text-white/60 hover:bg-white/10 transition-all"
        >
          <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} /> Yenile
        </button>
      </div>

      {/* Tabs / Filters (Underlined Style) */}
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
              "pb-4 text-[11px] font-black uppercase tracking-widest transition-all relative flex items-center gap-3 whitespace-nowrap",
              activeTab === tab.id ? "text-white" : "text-white/30 hover:text-white/60"
            )}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold",
                activeTab === tab.id ? accentBg + " text-black" : "bg-white/5 text-white/40"
              )}>
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <motion.div layoutId="activeTab" className={cn("absolute bottom-0 left-0 right-0 h-0.5", accentBg)} />
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="py-40 text-center animate-pulse">
               <RefreshCw className="w-12 h-12 text-white/10 animate-spin mx-auto mb-4" />
               <p className="text-white/20 font-serif italic text-xl">Siparişler yükleniyor...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-40 text-center border-2 border-dashed border-white/5 rounded-[48px]"
            >
               <ShoppingBag className="w-16 h-16 text-white/5 mx-auto mb-6" />
               <p className="text-white/20 font-serif italic text-2xl">Şu an aktif siparişiniz bulunmuyor.</p>
            </motion.div>
          ) : (
            filteredOrders.map((subOrder: any) => {
              const status = statusConfig[subOrder.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;
              
              return (
                <motion.div
                  layout
                  key={subOrder.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#0d0d0d] border border-white/5 rounded-[40px] overflow-hidden group hover:border-white/10 transition-all shadow-2xl"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    
                    {/* Left: Info & Customer */}
                    <div className="lg:col-span-4 p-8 border-b lg:border-b-0 lg:border-r border-white/5 bg-white/[0.01]">
                       <div className="flex items-center justify-between mb-8">
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Sipariş No</p>
                             <h3 className="text-2xl font-mono text-white">#{subOrder.order.orderNumber}</h3>
                          </div>
                          <div className={cn("px-4 py-2 rounded-2xl border text-[9px] font-black uppercase tracking-widest flex items-center gap-2", status.color)}>
                             <StatusIcon className="w-3 h-3" />
                             {status.label}
                          </div>
                       </div>

                       <div className="space-y-6">
                          <div className="flex items-start gap-4">
                             <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 flex-shrink-0">
                                <User className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Müşteri</p>
                                <h4 className="text-white font-bold">{subOrder.order.user.name}</h4>
                                <p className="text-xs text-white/40">{subOrder.order.user.phone || 'Telefon yok'}</p>
                             </div>
                          </div>
                          <div className="flex items-start gap-4">
                             <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 flex-shrink-0">
                                <MapPin className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Adres</p>
                                <h4 className="text-white font-bold">{subOrder.order.address.title}</h4>
                                <p className="text-xs text-white/40 leading-relaxed">
                                   {subOrder.order.address.neighborhood}, {subOrder.order.address.street} <br />
                                   No:{subOrder.order.address.buildingNo} Kat:{subOrder.order.address.floor} D:{subOrder.order.address.apartmentNo}
                                </p>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Middle: Items & Customizations */}
                    <div className="lg:col-span-5 p-8 border-b lg:border-b-0 lg:border-r border-white/5">
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-6">Sipariş İçeriği</p>
                       <div className="space-y-6">
                          {subOrder.items.map((item: any) => {
                             const removedIngredients = item.removedIngredients ? JSON.parse(item.removedIngredients) : [];
                             return (
                                <div key={item.id} className="bg-white/5 rounded-3xl p-5 border border-white/5">
                                   <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center gap-3">
                                         <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-black text-white">{item.quantity}x</span>
                                         <h4 className="text-white font-bold">{item.product?.name || (item.isCustom ? 'Özel Artisan Seçimi' : 'Ürün')}</h4>
                                      </div>
                                      <span className="text-xs font-mono text-white/40">{Number(item.priceAtTime) * item.quantity} ₺</span>
                                   </div>
                                   
                                   {/* Customization Details */}
                                   {(item.selectedIngredients?.length > 0 || removedIngredients.length > 0) && (
                                     <div className="pl-11 space-y-2">
                                        {/* Extras (Added) */}
                                        {item.selectedIngredients.map((ing: any) => (
                                          <div key={ing.id} className="flex items-center gap-2 text-[10px] text-green-500/80 font-bold uppercase tracking-wider">
                                             <Plus className="w-3 h-3" /> {ing.ingredient.name}
                                          </div>
                                        ))}
                                        {/* Removed Ingredients */}
                                        {removedIngredients.map((id: string) => (
                                          <div key={id} className="flex items-center gap-2 text-[10px] text-red-500/60 font-bold uppercase tracking-wider line-through">
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

                    {/* Right: Actions */}
                    <div className="lg:col-span-3 p-8 flex flex-col justify-between gap-8">
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1 text-right">Toplam Tutar</p>
                          <p className="text-4xl font-black text-white text-right tracking-tighter">{Number(subOrder.totalAmount).toFixed(2)} ₺</p>
                       </div>

                       <div className="space-y-3">
                          {subOrder.status === 'PENDING' && (
                            <button 
                              onClick={() => updateStatusMutation.mutate({ id: subOrder.id, status: 'PREPARING' })}
                              className="w-full py-4 rounded-2xl bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                            >
                              HAZIRLAMAYA BAŞLA
                            </button>
                          )}
                          {subOrder.status === 'PREPARING' && (
                            <button 
                              onClick={() => updateStatusMutation.mutate({ id: subOrder.id, status: 'SHIPPED' })}
                              className="w-full py-4 rounded-2xl bg-orange-500 text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                            >
                              KURYEYE TESLİM ET
                            </button>
                          )}
                          {subOrder.status === 'SHIPPED' && (
                            <button 
                              onClick={() => updateStatusMutation.mutate({ id: subOrder.id, status: 'DELIVERED' })}
                              className="w-full py-4 rounded-2xl bg-green-500 text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                            >
                              TESLİM EDİLDİ OLARAK İŞARETLE
                            </button>
                          )}
                          
                          {/* Quick Status Change Dropdown (Small UI) */}
                          <select 
                            onChange={(e) => updateStatusMutation.mutate({ id: subOrder.id, status: e.target.value })}
                            value={subOrder.status}
                            className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest focus:outline-none appearance-none cursor-pointer"
                          >
                             <option value="" disabled>Durumu Değiştir</option>
                             <option value="PENDING">Yeni Sipariş</option>
                             <option value="PREPARING">Hazırlanıyor</option>
                             <option value="SHIPPED">Kuryede</option>
                             <option value="DELIVERED">Teslim Edildi</option>
                             <option value="CANCELLED">İptal Et</option>
                          </select>
                       </div>
                    </div>

                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
