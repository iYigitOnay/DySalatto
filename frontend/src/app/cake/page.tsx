"use client";

import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { motion } from "framer-motion";
import RotatingText from "@/components/ui/RotatingText";
import CakeShowcase from "@/components/sections/CakeShowcase";
import CakePhilosophy from "@/components/sections/CakePhilosophy";
import CakePairings from "@/components/sections/CakePairings";
import CakeAtelier from "@/components/sections/CakeAtelier";
import CakeSpecialOrders from "@/components/sections/CakeSpecialOrders";

export default function CakePage() {
  return (
    <main className="relative min-h-screen bg-brand-charcoal overflow-x-hidden selection:bg-brand-sand/30">
      <style jsx global>{`
        :root {
          --brand-primary: #f5deb3;
          --brand-primary-dark: #ffffff;
        }
      `}</style>
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#110c08]" />
          <img
            src="/images/forDYCake/header1.png"
            alt="DyCake Artisan Sweets - Natural and Healthy"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            decoding="async"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#110c08]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
          <h1 className="text-[11vw] md:text-[8.5vw] font-black text-white leading-[0.9] tracking-[-0.05em] uppercase mb-8 flex flex-col items-center">
            <span className="block">TATLININ</span>
            <span className="flex items-center justify-center h-[1.1em] overflow-visible">
              <RotatingText
                texts={[
                  "en doğal",
                  "en sanatsal",
                  "en hafif",
                  "en sağlıklı",
                  "en tutkulu",
                ]}
                mainClassName="text-brand-sand italic font-serif lowercase tracking-tight"
                staggerFrom={"last"}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-120%", opacity: 0 }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-visible"
                elementLevelClassName="pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2500}
              />
            </span>
            <span className="block text-brand-sand text-[9vw] md:text-[7vw] tracking-[0.05em] font-light mt-[-0.1em]">
              HALİYLE TANIŞIN
            </span>
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-14">
            <button className="w-full md:w-[280px] h-[60px] bg-brand-sand text-brand-charcoal rounded-xl font-black text-xs tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(245,222,179,0.2)]">
              TATLI MENÜSÜNÜ GÖR
            </button>

            <button className="w-full md:w-[280px] h-[60px] border border-white/20 rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm group flex items-center justify-center">
              <span className="text-white font-black text-xs tracking-[0.2em] uppercase group-hover:text-brand-sand transition-colors">
                HİKAYEMİZİ DİNLE
              </span>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1 animate-bounce">
            <div className="w-1 h-2 bg-brand-sand rounded-full" />
          </div>
        </div>
      </section>

      {/* 1. Fırından Yeni Çıkanlar (Stagger Showcase) */}
      <CakeShowcase />

      {/* 2. Suçluluk Hissetmeden Şımar (Philosophy) */}
      <CakePhilosophy />

      {/* 3. Lezzet Eşleşmeleri (Sweet Pairings) */}
      <CakePairings />

      {/* 4. Şefin Atölyesi (Video/Parallax) */}
      <CakeAtelier />

      {/* 5. Özel Günler İçin Artisan Dokunuşlar */}
      <CakeSpecialOrders />

      <Footer />
    </main>
  );
}
