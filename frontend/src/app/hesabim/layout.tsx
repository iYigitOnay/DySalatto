"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ShoppingBag, MapPin, Settings, User, ChevronRight } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import FloatingCart from "@/components/ui/FloatingCart";

const sidebarLinks = [
  { title: "Siparişlerim", href: "/hesabim/siparisler", icon: ShoppingBag },
  { title: "Adreslerim", href: "/hesabim/adresler", icon: MapPin },
  { title: "Ayarlar", href: "/hesabim/ayarlar", icon: Settings },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCakePage = pathname?.startsWith("/cake") || pathname?.includes("brand=cake"); // Marka tespiti için ek mantık gerekebilir

  // Manuel brand tespiti (Şu anlık path'e göre, gerekirse geliştirilir)
  const isCakeBrand = pathname?.includes("/cake") || (typeof window !== 'undefined' && window.location.search.includes('brand=cake'));

  const accentColor = isCakePage ? "text-brand-sand" : "text-brand-terracotta";
  const accentBg = isCakePage ? "bg-brand-sand/10" : "bg-brand-terracotta/10";
  const accentBorder = isCakePage ? "border-brand-sand/20" : "border-brand-terracotta/20";

  return (
    <div className="min-h-screen bg-brand-charcoal flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar */}
            <aside className="w-full lg:w-64 shrink-0">
              <div className="sticky top-32">
                <div className="mb-8">
                  <h1 className="text-3xl font-serif text-white italic mb-2">Hesabım</h1>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Kişisel Artisan Paneli</p>
                </div>

                <nav className="flex flex-col gap-2">
                  {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group",
                          isActive
                            ? cn("bg-white/5 border-white/10 text-white shadow-xl", accentBorder)
                            : "bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <link.icon className={cn(
                            "w-5 h-5 transition-colors",
                            isActive ? accentColor : "group-hover:text-white"
                          )} />
                          <span className="text-sm font-bold tracking-tight">{link.title}</span>
                        </div>
                        <ChevronRight className={cn(
                          "w-4 h-4 transition-all opacity-0 group-hover:opacity-100",
                          isActive ? "opacity-100 translate-x-0" : "-translate-x-2"
                        )} />
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Content Area */}
            <section className="flex-1 min-w-0">
              <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl">
                {children}
              </div>
            </section>

          </div>
        </div>
      </main>

      <FloatingCart />
      <Footer />
    </div>
  );
}
