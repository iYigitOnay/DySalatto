"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import DIYWizard from "@/components/sections/DIYWizard";
import FloatingCart from "@/components/ui/FloatingCart";

export default function SalattoDIYPage() {
  return (
    <main className="min-h-screen bg-brand-charcoal selection:bg-brand-terracotta/30">
      <Navbar />

      {/* Header Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <p className="text-[10px] font-black tracking-[0.5em] text-brand-terracotta uppercase mb-4">Artisan Deneyim</p>
          <h1 className="text-5xl md:text-8xl font-serif text-white italic leading-tight">
            Kendi Kâseni <br /> <span className="text-brand-terracotta not-italic font-sans font-black uppercase tracking-tighter">Tasarlamaya Başla</span>
          </h1>
          <p className="text-white/40 text-lg mt-8 max-w-2xl mx-auto leading-relaxed">
            Damak tadınıza en uygun malzemeleri seçin, şeflerimiz sizin için taze taze hazırlasın. Her seçim bir sanat eseri.
          </p>
        </div>
        
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-full bg-gradient-to-b from-brand-terracotta/10 to-transparent blur-[120px] pointer-events-none opacity-30" />
      </section>

      {/* DIY Wizard Component */}
      <section className="pb-40">
        <DIYWizard brand="salatto" />
      </section>

      <FloatingCart />
      <Footer />
    </main>
  );
}
