"use client";

import React from "react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { StorySection, Manifesto } from "@/components/sections/StoryComponents";
import { motion } from "framer-motion";

export default function CakeStoryPage() {
  return (
    <main className="min-h-screen bg-brand-charcoal overflow-hidden">
      <style jsx global>{`
        :root {
          --brand-primary: #F5DEB3;
          --brand-primary-dark: #FFFFFF;
        }
      `}</style>
      <Navbar />

      {/* Hero / Genesis */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/forDYCake/header1.png"
            className="w-full h-full object-cover opacity-30 scale-105"
            alt="Genesis"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black tracking-[0.6em] text-brand-sand uppercase mb-6"
          >
            Sanatımız Hakkında
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-9xl font-serif text-white italic leading-tight"
          >
            Ruhunu <br />{" "}
            <span className="text-brand-sand not-italic font-sans font-black uppercase tracking-tighter">
              Şımartma Sanatı
            </span>
          </motion.h1>
        </div>
      </section>

      {/* Narrative Section 1 */}
      <StorySection
        brand="cake"
        subtitle="Tatlı Bir Aşk Hikayesi"
        title="Şekersiz Değil, Doğal Tatlı."
        desc="DyCake, tatlı yemenin suçluluk hissettirmemesi gerektiğine olan inançla doğdu. Rafine şeker ve glutenle aranıza mesafe koyarken, artisan lezzetin doruklarına çıkmanızı sağlıyoruz."
        image="/images/forDYCake/header1.png"
      />

      {/* Manifesto */}
      <Manifesto brand="cake" />

      {/* BTS / Artisan Textures */}
      <section className="py-32 bg-brand-charcoal px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[800px]">
          <div className="lg:col-span-2 rounded-[40px] overflow-hidden group border border-white/5 relative">
            <img
              src="/images/forDYCake/header1.png"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60"
              alt="BTS 1"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
          </div>
          <div className="rounded-[40px] overflow-hidden group border border-white/5 relative">
            <img
              src="/images/forDYCake/header1.png"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60"
              alt="BTS 2"
            />
          </div>
          <div className="rounded-[40px] overflow-hidden group border border-white/5 relative">
            <img
              src="/images/forDYCake/header1.png"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60"
              alt="BTS 3"
            />
          </div>
        </div>
      </section>

      {/* Sustainability / Future */}
      <StorySection
        brand="cake"
        subtitle="Artisan Gelecek"
        title="Butik Pastacılık Kültürü."
        desc="Fabrikasyon üretimin soğukluğuna karşı, her pastanın el emeğiyle hazırlandığı, malzemenin saygı gördüğü bir gelecek inşa ediyoruz. DyCake, modern atölye ruhunu her lokmada yaşatır."
        image="/images/forDYCake/header1.png"
        reversed
      />

      <Footer />
    </main>
  );
}
