"use client";

import React from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ServerCrash, Database } from "lucide-react";

export default function AdminDashboard() {
  const params = useParams();
  const brand = params.brand as string;
  const isCake = brand === "dycake";
  const primaryColor = isCake ? "text-brand-sand" : "text-brand-terracotta";
  const primaryBg = isCake ? "bg-brand-sand" : "bg-brand-terracotta";

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-serif mb-2">Dashboard</h1>
        <p className="text-white/40 text-sm">
          {isCake ? "DYCake" : "DYSalatto"} operasyon merkezi.
        </p>
      </div>

      {/* Empty State / Waiting for Backend */}
      <div className="flex-1 border-2 border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center p-12 text-center bg-white/[0.02]">
        <div className="relative mb-8">
           <div className={cn("absolute inset-0 blur-2xl opacity-20 rounded-full", primaryBg)} />
           <div className={cn("w-24 h-24 rounded-full border border-white/10 flex items-center justify-center bg-[#0a0a0a] relative z-10", primaryColor)}>
             <Database className="w-10 h-10" />
           </div>
        </div>
        
        <h2 className="text-2xl font-serif text-white mb-4">Sistem Veri Bekliyor</h2>
        <p className="text-white/40 text-sm max-w-md leading-relaxed mb-8">
          Henüz veritabanında görüntülenecek bir sipariş veya ürün kaydı bulunmuyor. Öncelikle menü ve kategori oluşturarak sisteme hayat vermelisiniz.
        </p>
        
        <div className="flex gap-4">
          <button className={cn("px-8 py-4 rounded-full text-xs font-black tracking-widest uppercase text-white transition-all hover:scale-105", primaryBg)}>
            Hemen Ürün Ekle
          </button>
        </div>
      </div>
    </div>
  );
}
