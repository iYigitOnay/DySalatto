"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import { useParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Package, MapPin, CreditCard, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const statusMap = {
  PENDING: { label: "Bekliyor", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  PREPARING: { label: "Hazırlanıyor", icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
  SHIPPED: { label: "Yolda", icon: Truck, color: "text-purple-500", bg: "bg-purple-500/10" },
  DELIVERED: { label: "Teslim Edildi", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
  CANCELLED: { label: "İptal Edildi", icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
};

import { Truck, AlertCircle } from "lucide-react";
import ConvertToMember from "@/components/sections/ConvertToMember";

export default function OrderDetailPage() {
  const { id } = useParams();
  const pathname = usePathname();
  const isCakePage = pathname?.startsWith("/cake") || pathname?.includes("brand=cake");

  const { data: orderRes, isLoading } = useQuery({
    queryKey: ["order-detail", id],
    queryFn: () => fetchApi(`/orders/${id}`),
  });

  const order = orderRes?.data;

  const accentColor = isCakePage ? "text-brand-sand" : "text-brand-terracotta";
  const accentBg = isCakePage ? "bg-brand-sand/10" : "bg-brand-terracotta/10";

  if (isLoading) {
    return <div className="animate-pulse space-y-8">
      <div className="h-10 w-64 bg-white/5 rounded-xl" />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="h-64 bg-white/5 rounded-[40px]" />
        <div className="h-64 bg-white/5 rounded-[40px]" />
      </div>
    </div>;
  }

  if (!order) return <div className="text-white">Sipariş bulunamadı.</div>;

  const status = statusMap[order.status as keyof typeof statusMap] || statusMap.PENDING;

  return (
    <div className="space-y-12">
      {/* Convert to Member Banner for Guests */}
      <ConvertToMember />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/hesabim/siparisler"
            className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors border border-white/5"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h2 className="text-3xl font-serif text-white italic">Sipariş Detayı</h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Sipariş No: #{order.orderNumber}</p>
          </div>
        </div>
        <div className={cn("flex items-center gap-3 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest self-start md:self-center", status.bg, status.color)}>
          <status.icon className="w-4 h-4" />
          {status.label}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden">
            <div className="p-8 border-b border-white/5 bg-white/5">
              <h3 className="text-white font-bold flex items-center gap-3">
                <Package className={cn("w-5 h-5", accentColor)} />
                Ürünler
              </h3>
            </div>
            <div className="p-8 space-y-8">
              {order.subOrders.map((sub: any) => (
                <div key={sub.id} className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className={cn("text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full", sub.brand === 'DYSALATTO' ? 'bg-brand-terracotta/20 text-brand-terracotta' : 'bg-brand-sand/20 text-brand-sand')}>
                      {sub.brand}
                    </span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  {sub.items.map((item: any) => (
                    <div key={item.id} className="flex gap-6">
                      <div className="w-20 h-20 rounded-2xl bg-white/5 overflow-hidden shrink-0 border border-white/5">
                        <img 
                          src={item.product?.image || (sub.brand === 'DYSALATTO' ? "/images/forDYSalatto/DySalattoLogo.png" : "/images/forDYCake/DyCakeLogo.png")} 
                          className="w-full h-full object-cover"
                          alt="" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-bold text-lg">{item.product?.name || (item.isCustom ? "Özel Tasarım" : "Ürün")}</h4>
                          <span className="text-white font-black">{item.priceAtTime} TL</span>
                        </div>
                        <p className="text-white/40 text-xs font-medium mb-4">Adet: {item.quantity}</p>
                        
                        {item.selectedIngredients.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {item.selectedIngredients.map((si: any) => (
                              <span key={si.id} className="text-[10px] bg-white/5 text-white/60 px-3 py-1.5 rounded-xl border border-white/5">
                                {si.ingredient.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Summary & Address */}
        <div className="space-y-8">
          {/* Order Summary */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8">
            <h3 className="text-white font-bold mb-8 flex items-center gap-3">
              <CreditCard className={cn("w-5 h-5", accentColor)} />
              Ödeme Özeti
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Ara Toplam</span>
                <span className="text-white/80 font-bold">{order.totalAmount} TL</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Teslimat</span>
                <span className="text-green-500 font-bold">Ücretsiz</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                <span className="text-xs font-black text-white/20 uppercase tracking-widest">Toplam</span>
                <span className={cn("text-3xl font-black tracking-tighter", accentColor)}>{order.totalAmount} TL</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8">
            <h3 className="text-white font-bold mb-8 flex items-center gap-3">
              <MapPin className={cn("w-5 h-5", accentColor)} />
              Teslimat Adresi
            </h3>
            <div className="space-y-2">
              <p className="text-white font-bold">{order.address.title}</p>
              <p className="text-white/60 text-sm leading-relaxed">
                {order.address.street}<br />
                {order.address.state}, {order.address.city} {order.address.zip}
              </p>
              <div className="pt-4 flex items-center gap-2 text-white/40 text-xs">
                <Clock className="w-3.5 h-3.5" />
                {new Date(order.createdAt).toLocaleString('tr-TR')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
