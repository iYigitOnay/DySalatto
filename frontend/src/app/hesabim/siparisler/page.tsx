"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight, Clock, CheckCircle2, Package, Truck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const statusMap = {
  PENDING: { label: "Bekliyor", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  PREPARING: { label: "Hazırlanıyor", icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
  SHIPPED: { label: "Yolda", icon: Truck, color: "text-purple-500", bg: "bg-purple-500/10" },
  DELIVERED: { label: "Teslim Edildi", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
  CANCELLED: { label: "İptal Edildi", icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
};

export default function OrdersPage() {
  const pathname = usePathname();
  const isCakePage = pathname?.startsWith("/cake") || pathname?.includes("brand=cake");

  const { data: ordersRes, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => fetchApi("/orders/me"),
  });

  const orders = ordersRes?.data || [];

  const accentColor = isCakePage ? "text-brand-sand" : "text-brand-terracotta";
  const accentBorder = isCakePage ? "border-brand-sand/20" : "border-brand-terracotta/20";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white/5 rounded-[32px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5", accentColor)}>
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-serif text-white italic">Siparişlerim</h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Geçmiş ve Aktif Siparişleriniz</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
          <ShoppingBag className="w-16 h-16 text-white/10 mx-auto mb-6" />
          <p className="text-white/40 font-serif italic text-xl">Henüz bir siparişiniz bulunmuyor.</p>
          <Link 
            href={isCakePage ? "/cake/mutfagimiz" : "/salatto/mutfagimiz"}
            className={cn("inline-block mt-8 text-[10px] font-black uppercase tracking-widest hover:underline", accentColor)}
          >
            Hemen Keşfetmeye Başla
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order: any) => {
            const status = statusMap[order.status as keyof typeof statusMap] || statusMap.PENDING;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-[32px] p-6 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden">
                       <img 
                        src={order.subOrders?.[0]?.items[0]?.product?.image || (isCakePage ? "/images/forDYCake/DyCakeLogo.png" : "/images/forDYSalatto/DySalattoLogo.png")} 
                        className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity"
                        alt="" 
                       />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">
                        Sipariş #{order.orderNumber}
                      </p>
                      <h4 className="text-lg font-bold text-white mb-1">
                        {order.subOrders?.reduce((acc: number, sub: any) => acc + sub.items.length, 0)} Ürün
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white/80">{order.totalAmount} TL</span>
                        <span className="text-white/20 text-xs">•</span>
                        <span className="text-white/40 text-xs font-medium">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest", status.bg, status.color)}>
                      <status.icon className="w-3.5 h-3.5" />
                      {status.label}
                    </div>
                    <Link 
                      href={`/hesabim/siparisler/${order.id}`}
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all group/btn"
                    >
                      <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Decorative Brand Accent */}
                <div className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full opacity-0 group-hover:opacity-100 transition-all", isCakePage ? "bg-brand-sand" : "bg-brand-terracotta")} />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
