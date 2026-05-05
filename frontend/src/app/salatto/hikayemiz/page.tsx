"use client";

import React from "react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { StorySection, Manifesto } from "@/components/sections/StoryComponents";
import { motion } from "framer-motion";

export default function SalattoStoryPage() {
  return (
    <main className="min-h-screen bg-brand-charcoal overflow-hidden">
      <Navbar />

      {/* Hero / Genesis */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/forDYSalatto/header1.jpg"
            className="w-full h-full object-cover opacity-40 scale-105"
            alt="Genesis"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black tracking-[0.6em] text-brand-terracotta uppercase mb-6"
          >
            Hikayemiz Başlıyor
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-9xl font-serif text-white italic leading-tight"
          >
            Toprağın <br />{" "}
            <span className="text-brand-terracotta not-italic font-sans font-black uppercase tracking-tighter">
              Sessiz Gücü
            </span>
          </motion.h1>
        </div>
      </section>

      {/* Narrative Section 1 */}
      <StorySection
        brand="salatto"
        subtitle="İlk Kıvılcım"
        title="Tazelik Bir Tercih Değil, Bir Sözdür."
        desc="DySalatto, sadece bir kâse salata sunma hayaliyle değil; tarlanın doğallığını, toprağın bereketini modern şehir hayatına en saf haliyle taşıma sözüyle kuruldu."
        image="/images/forDYSalatto/header1.jpg"
      />

      {/* Manifesto */}
      <Manifesto brand="salatto" />

      {/* BTS / Artisan Textures */}
      <section className="py-32 bg-brand-charcoal px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[800px]">
          <div className="lg:col-span-2 rounded-[40px] overflow-hidden group border border-white/5 relative">
            <img
              src="/images/forDYSalatto/header1.jpg"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              alt="BTS 1"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
          </div>
          <div className="rounded-[40px] overflow-hidden group border border-white/5 relative">
            <img
              src="/images/forDYSalatto/header1.jpg"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              alt="BTS 2"
            />
          </div>
          <div className="rounded-[40px] overflow-hidden group border border-white/5 relative">
            <img
              src="/images/forDYSalatto/header1.jpg"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              alt="BTS 3"
            />
          </div>
        </div>
      </section>

      {/* Sustainability / Future */}
      <StorySection
        brand="salatto"
        subtitle="Gelecek Vizyonu"
        title="Sürdürülebilir Bir Mutfak Kültürü."
        desc="Doğaya borcumuzu biliyoruz. Paketlemelerimizden atık yönetimimize kadar her adımda, yarının topraklarını koruyarak büyüyoruz. Yerel üreticinin her zaman yanındayız."
        image="/images/forDYSalatto/header1.jpg"
        reversed
      />

      <Footer />
    </main>
  );
}
