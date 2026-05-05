"use client";

import Navbar from "@/components/sections/Navbar";
import OrderButton from "@/components/ui/OrderButton";
import Kaselerimiz from "@/components/sections/Kaselerimiz";
import Philosophy from "@/components/sections/Philosophy";
import ArtisanJourney from "@/components/sections/ArtisanJourney";
import SocialProof from "@/components/sections/SocialProof";
import Footer from "@/components/sections/Footer";
import RotatingText from "@/components/ui/RotatingText";

export default function SalattoPage() {
  return (
    <main className="relative min-h-screen bg-brand-charcoal overflow-x-hidden selection:bg-brand-terracotta/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* ... (Hero background remains) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-brand-charcoal" />
          <img
            src="/images/forDYSalatto/header1.jpg"
            alt="DySalatto Artisan Bowls - Fresh and Healthy"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            decoding="async"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-brand-charcoal" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
          <h1 className="text-[11vw] md:text-[8.5vw] font-black text-white leading-[0.9] tracking-[-0.05em] uppercase mb-8 flex flex-col items-center">
            <span className="block">TAZELİĞİN</span>
            <span className="flex items-center justify-center h-[1.1em] overflow-visible">
              <RotatingText
                texts={["sanatla", "sağlıkla", "uygunlukla", "tutkuyla", "aşkla"]}
                mainClassName="text-brand-terracotta italic font-serif lowercase tracking-tight"
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
              BULUŞMASI
            </span>
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-14">
            <OrderButton
              isScrolled={false}
              className="w-full md:w-[280px] h-[60px] flex justify-center items-center px-0"
            >
              Siparişe Başla
            </OrderButton>

            <button className="w-full md:w-[280px] h-[60px] border border-white/20 rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm group flex items-center justify-center">
              <span className="text-white font-black text-xs tracking-[0.2em] uppercase group-hover:text-brand-terracotta transition-colors">
                LEZZET REHBERİNİ KEŞFET
              </span>
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1 animate-bounce">
            <div className="w-1 h-2 bg-brand-terracotta rounded-full" />
          </div>
        </div>
      </section>

      {/* 1. Kaselerimiz Showcase */}
      <Kaselerimiz />

      {/* 2. Philosophy Storytelling */}
      <Philosophy />

      {/* 3. Artisan Journey (Customization + Process) */}
      <ArtisanJourney />

      {/* 4. Social Proof */}
      <SocialProof />

      {/* 5. Footer */}
      <Footer />
    </main>
  );
}
