'use client';

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { ContactCard, ContactForm } from "@/components/sections/ContactComponents";
import { Phone, MessageCircle, MapPin, Mail } from 'lucide-react';
import { motion } from "framer-motion";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

export default function CakeContactPage() {
  return (
    <main className="min-h-screen bg-brand-charcoal overflow-hidden">
      <style jsx global>{`
        :root {
          --brand-primary: #F5DEB3;
          --brand-primary-dark: #FFFFFF;
        }
      `}</style>
      <Navbar />

      {/* Header Section */}
      <section className="relative pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] font-black tracking-[0.6em] text-brand-sand uppercase mb-6"
          >
            Bize Ulaşın
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-serif text-white italic leading-tight"
          >
            Tatlı <br /> <span className="text-brand-sand not-italic font-sans font-black uppercase tracking-tighter">Bir Sohbet</span>
          </motion.h1>
          <p className="text-white/40 text-lg mt-8 max-w-2xl mx-auto leading-relaxed">
            Butik pastalarımız, özel gün siparişleriniz veya sadece bir merhaba demek için buradayız. Artisan dünyamıza davetlisiniz.
          </p>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <ContactCard 
            brand="cake"
            icon={<Phone />}
            title="Sipariş Hattı"
            value="+90 (212) 000 00 00"
            href="tel:+902120000000"
          />
          <ContactCard 
            brand="cake"
            icon={<MessageCircle />}
            title="WhatsApp Atölye"
            value="Atölyeye Yazın"
            href="https://wa.me/yournumber"
          />
          <ContactCard 
            brand="cake"
            icon={<InstagramIcon />}
            title="Instagram"
            value="@dycakeartisan"
            href="https://instagram.com/dycake"
          />
        </div>
      </section>

      {/* Form & Map Section */}
      <section className="pb-40 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <ContactForm brand="cake" />
          </div>
          <div className="lg:col-span-5 space-y-12">
            <div className="bg-[#0a0a0a] rounded-[48px] border border-white/5 overflow-hidden h-[400px] relative group">
                {/* Simulated Dark Map */}
                <div className="absolute inset-0 bg-[#111] flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-brand-sand animate-bounce" />
                    <p className="absolute bottom-12 text-white/20 text-[10px] font-black uppercase tracking-widest">Nişantaşı, İstanbul</p>
                </div>
                <div className="absolute inset-0 bg-brand-sand/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="space-y-8 px-8">
                <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-sand shrink-0">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-1 uppercase text-xs tracking-widest">Atölye Adres</h4>
                        <p className="text-white/40 text-sm leading-relaxed">Nişantaşı Mah. Abdi İpekçi Cad.<br/>No: 24, Şişli / İstanbul</p>
                    </div>
                </div>
                <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-sand shrink-0">
                        <Mail className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-1 uppercase text-xs tracking-widest">E-Posta</h4>
                        <p className="text-white/40 text-sm leading-relaxed">atelier@dycake.com</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
