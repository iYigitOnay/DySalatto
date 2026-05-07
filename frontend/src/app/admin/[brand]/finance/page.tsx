'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { 
  TrendingUp, Users, ShoppingBag, 
  DollarSign, ArrowUpRight, ArrowDownRight,
  Package, Calendar, ChevronRight, BarChart3,
  PieChart, Activity, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function AdminFinancePage() {
  const params = useParams();
  const brand = params.brand as string;
  const dbBrand = brand === 'dycake' ? 'DYCAKE' : 'DYSALATTO';

  const { data: statsRes, isLoading } = useQuery({
    queryKey: ['admin-finance', dbBrand],
    queryFn: () => fetchApi(`/orders/admin/finance?brand=${dbBrand}`)
  });

  const stats = statsRes?.data || {
    totalRevenue: 0,
    totalOrders: 0,
    todayRevenue: 0,
    popularProducts: [],
    recentSales: []
  };

  const accentColor = brand === 'dycake' ? 'text-brand-sand' : 'text-brand-terracotta';
  const accentBg = brand === 'dycake' ? 'bg-brand-sand' : 'bg-brand-terracotta';

  if (isLoading) {
    return (
      <div className="py-40 text-center animate-pulse">
        <RefreshCw className="w-12 h-12 text-white/10 animate-spin mx-auto mb-4" />
        <p className="text-white/20 font-serif italic text-xl">Finansal veriler analiz ediliyor...</p>
      </div>
    );
  }

  const mainStats = [
    { label: 'Toplam Ciro', value: `₺${stats.totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, icon: DollarSign, trend: 'Toplam', isPositive: true },
    { label: 'Toplam Sipariş', value: stats.totalOrders, icon: ShoppingBag, trend: 'Net', isPositive: true },
    { label: 'Bugünkü Kazanç', value: `₺${stats.todayRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, icon: TrendingUp, trend: 'Canlı', isPositive: true },
    { label: 'Ort. Sepet', value: `₺${(stats.totalRevenue / (stats.totalOrders || 1)).toFixed(2)}`, icon: Activity, trend: 'Verimlilik', isPositive: true },
  ];

  return (
    <div className="space-y-12 pb-40">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
           <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl", accentBg)}>
              <BarChart3 className={cn("w-8 h-8", brand === 'dycake' ? "text-[#111]" : "text-white")} />
           </div>
           <div>
              <h1 className="text-4xl md:text-5xl font-serif text-white italic leading-tight">Finans & <span className={accentColor}>Raporlar</span></h1>
              <p className="text-white/30 text-xs uppercase tracking-[0.3em] font-black mt-1">Performans ve Satış Analizi</p>
           </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#0d0d0d] border border-white/5 rounded-[40px] p-8 group hover:border-white/10 transition-all shadow-2xl relative overflow-hidden"
          >
             <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
                   <stat.icon className="w-6 h-6" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  stat.isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                )}>
                   {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                   {stat.trend}
                </div>
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">{stat.label}</p>
             <h3 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* Popular Products */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0d0d0d] border border-white/5 rounded-[40px] p-8 shadow-2xl">
               <h3 className="text-xl font-serif text-white italic mb-8 flex items-center gap-3">
                  <PieChart className="w-5 h-5 text-brand-sand" /> En Çok Satanlar
               </h3>
               <div className="space-y-6">
                  {stats.popularProducts.length === 0 ? (
                    <p className="text-white/20 text-sm italic py-10 text-center">Henüz yeterli veri yok.</p>
                  ) : (
                    stats.popularProducts.map((p: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <span className="text-xs font-black text-white/20 w-4">0{idx + 1}</span>
                            <span className="text-sm font-bold text-white/80">{p.name}</span>
                         </div>
                         <span className={cn("text-[10px] font-black px-3 py-1 rounded-full bg-white/5", accentColor)}>
                            {p.count} Satış
                         </span>
                      </div>
                    ))
                  )}
               </div>
            </div>
         </div>

         {/* Recent Sales Table */}
         <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#0d0d0d] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl flex flex-col h-full">
               <div className="p-8 border-b border-white/5">
                  <h3 className="text-xl font-serif text-white italic flex items-center gap-3">
                     <Activity className="w-5 h-5 text-brand-terracotta" /> Son İşlemler
                  </h3>
               </div>
               <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-white/[0.01] border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-white/20">
                        <tr>
                           <th className="p-6">Sipariş</th>
                           <th className="p-6">Müşteri</th>
                           <th className="p-6 text-right">Tutar</th>
                           <th className="p-6 text-center">Durum</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {stats.recentSales.length === 0 ? (
                          <tr><td colSpan={4} className="p-20 text-center text-white/20 italic font-serif">Kayıt bulunamadı.</td></tr>
                        ) : (
                          stats.recentSales.map((sale: any) => (
                            <tr key={sale.id} className="group hover:bg-white/[0.02] transition-colors">
                               <td className="p-6 font-mono text-white/60 text-xs">#{sale.orderNo}</td>
                               <td className="p-6 font-bold text-white/80 text-xs">{sale.customer}</td>
                               <td className="p-6 text-right font-black text-white text-sm">₺{sale.amount.toFixed(2)}</td>
                               <td className="p-6 text-center">
                                  <span className={cn(
                                    "px-3 py-1 rounded-full text-[8px] font-black uppercase border",
                                    sale.status === 'DELIVERED' ? "border-green-500/20 text-green-500 bg-green-500/5" : "border-white/10 text-white/30"
                                  )}>
                                     {sale.status}
                                  </span>
                               </td>
                            </tr>
                          ))
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}
