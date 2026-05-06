'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, Clock, CheckCircle2, Truck, 
  ChevronRight, ArrowLeft, MapPin, CreditCard,
  AlertCircle, Package, MoreVertical, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';

const statusConfig = {
  PENDING: { label: 'Onay Bekliyor', color: 'text-blue-400', icon: AlertCircle, bg: 'bg-blue-500/10' },
  PREPARING: { label: 'Hazırlanıyor', color: 'text-orange-400', icon: Clock, bg: 'bg-orange-500/10' },
  SHIPPED: { label: 'Kuryede', color: 'text-purple-400', icon: Truck, bg: 'bg-purple-500/10' },
  DELIVERED: { label: 'Teslim Edildi', color: 'text-green-400', icon: CheckCircle2, bg: 'bg-green-500/10' },
  CANCELLED: { label: 'İptal Edildi', color: 'text-red-400', icon: X, bg: 'bg-red-500/10' },
};

export default function MyOrdersPage() {
  const { data: ordersRes, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => fetchApi('/orders/me'),
    refetchInterval: 60000, // Dakikada bir yenile
  });

  const orders = ordersRes?.data || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div>
           <h1 className="text-4xl font-serif text-white italic">Siparişlerim</h1>
           <p className="text-white/30 text-xs uppercase tracking-widest font-black mt-1">Artisan Lezzet Takibi</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20">
           <ShoppingBag className="w-5 h-5" />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center animate-pulse">
          <div className="w-12 h-12 border-2 border-brand-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/20 font-serif italic text-lg">Lezzet yolculuğunuz yükleniyor...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01]">
           <Package className="w-16 h-16 text-white/5 mx-auto mb-6" />
           <h3 className="text-xl font-serif text-white italic mb-2">Henüz Siparişiniz Yok</h3>
           <p className="text-white/30 text-sm mb-8">Hemen mutfağımıza göz atıp ilk siparişinizi verebilirsiniz.</p>
           <Link href="/salatto" className="inline-flex items-center gap-3 px-8 py-3 rounded-2xl bg-brand-terracotta text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">MENÜYE GİT</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => {
            const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PENDING;
            const StatusIcon = status.icon;

            return (
              <Link 
                key={order.id} 
                href={`/hesabim/siparisler/${order.id}`}
                className="block group"
              >
                <div className="bg-[#0d0d0d] border border-white/5 rounded-[40px] p-8 hover:border-white/20 transition-all shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-brand-terracotta/5 blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none" />
                   
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                      <div className="flex items-center gap-6">
                         <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center border border-white/5", status.bg, status.color)}>
                            <StatusIcon className="w-8 h-8" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Sipariş #{order.orderNumber}</p>
                            <h3 className="text-xl font-bold text-white group-hover:text-brand-sand transition-colors">{status.label}</h3>
                            <p className="text-xs text-white/40 mt-1">{new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                         </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-12 border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
                         <div className="text-left md:text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Tutar</p>
                            <p className="text-2xl font-black text-white tracking-tighter">{Number(order.totalAmount).toFixed(2)} ₺</p>
                         </div>
                         <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-white/10 group-hover:text-white transition-all">
                            <ChevronRight className="w-5 h-5" />
                         </div>
                      </div>
                   </div>

                   {/* Quick Summary of items */}
                   <div className="mt-8 flex flex-wrap gap-2">
                      {order.subOrders.flatMap((so: any) => so.items).map((item: any, idx: number) => (
                        <div key={idx} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-white/40 group-hover:text-white/60 transition-colors">
                           {item.quantity}x {item.product?.name || (item.isCustom ? 'Özel Seçim' : 'Ürün')}
                        </div>
                      ))}
                   </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  );
}
