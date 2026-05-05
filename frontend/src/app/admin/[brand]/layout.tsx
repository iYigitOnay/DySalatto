"use client";

import React, { useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { ArrowLeft } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const brand = params.brand as string;
  const isCake = brand === "dycake";
  
  const primaryColor = isCake ? "text-brand-sand" : "text-brand-terracotta";
  const primaryBg = isCake ? "bg-brand-sand" : "bg-brand-terracotta";

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-white animate-spin" /></div>;

  const sidebarLinks = [
    { name: "Dashboard", href: `/admin/${brand}/dashboard` },
    { name: "Siparişler", href: `/admin/${brand}/orders` },
    { name: "Ürün Yönetimi", href: `/admin/${brand}/products` },
    { name: "Menü Yönetimi", href: `/admin/${brand}/menu` },
    { name: "Malzemeler (DIY)", href: `/admin/${brand}/ingredients` },
    { name: "Finans & Rapor", href: `/admin/${brand}/finance` },
  ];

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden text-white font-sans selection:bg-brand-terracotta/30">
      
      {/* Ultra-Minimalist Artisan Sidebar */}
      <motion.aside 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-[280px] flex-shrink-0 bg-[#050505] flex flex-col z-20 relative border-r border-white/5"
      >
        {/* Brand Header */}
        <div className="pt-16 pb-12 px-10 shrink-0 relative">
          <Link href="/admin/gateway" className="inline-flex items-center gap-3 group mb-2">
            <ArrowLeft className="w-3.5 h-3.5 text-white/30 group-hover:text-white transition-colors" />
            <span className="text-[9px] font-black tracking-[0.4em] text-white/30 uppercase group-hover:text-white transition-colors">Geçide Dön</span>
          </Link>
          <h2 className="font-serif text-3xl italic mt-6 tracking-wide text-white">{isCake ? "DYCake" : "DYSalatto"}</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-10 space-y-6 mt-4">
          {sidebarLinks.map((link) => {
            const isActive = pathname.includes(link.href);
            
            return (
              <Link key={link.name} href={link.href} className="block group">
                <div className="flex items-center gap-4 relative">
                  {/* Subtle active line indicator */}
                  <div className={cn(
                    "absolute -left-10 w-[3px] h-full rounded-r-full transition-all duration-500",
                    isActive ? primaryBg : "bg-transparent"
                  )} />
                  
                  <span className={cn(
                    "text-xs font-bold tracking-widest uppercase transition-all duration-500",
                    isActive ? "text-white" : "text-white/30 group-hover:text-white/70"
                  )}>
                    {link.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Footer (Minimal) */}
        <div className="p-10 shrink-0">
           <div className="flex items-center gap-4 mb-6">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-black text-xs", isCake ? "bg-brand-sand text-[#111]" : "bg-brand-terracotta text-white")}>
                 {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-bold text-white tracking-wide">{user.name.split(' ')[0]}</p>
              </div>
           </div>
           
           <button 
              onClick={logout}
              className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 hover:text-brand-terracotta transition-colors"
           >
              Oturumu Kapat
           </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#0a0a0a] rounded-l-[40px] my-4 mr-4 border border-white/5 shadow-2xl">
         {/* Adaptive Background Glow inside content area */}
         <div className={cn("absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.04] pointer-events-none transition-colors duration-1000", primaryBg)} />
         
         <div className="flex-1 overflow-y-auto p-12 lg:p-16 relative z-10">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: 0.2 }}
               className="max-w-6xl mx-auto h-full"
            >
               {children}
            </motion.div>
         </div>
      </main>
    </div>
  );
}