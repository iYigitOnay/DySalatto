'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Phone, Mail, MapPin, Instagram, MessageCircle, Send } from 'lucide-react';

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  brand: 'salatto' | 'cake';
  href: string;
}

const ContactCard = ({ icon, title, value, brand, href }: ContactCardProps) => {
  const isCake = brand === 'cake';
  const accentBorder = isCake ? 'hover:border-brand-sand/40' : 'hover:border-brand-terracotta/40';
  const accentIcon = isCake ? 'bg-brand-sand text-[#110C08]' : 'bg-brand-terracotta text-white';

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <motion.div 
        whileHover={{ y: -8 }}
        className={cn(
          "p-8 rounded-[32px] bg-white/[0.02] border border-white/5 transition-all duration-500 group",
          accentBorder
        )}
      >
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110", accentIcon)}>
          {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
        </div>
        <p className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase mb-2">{title}</p>
        <p className="text-lg font-serif text-white italic">{value}</p>
      </motion.div>
    </a>
  );
};

const ContactForm = ({ brand }: { brand: 'salatto' | 'cake' }) => {
  const isCake = brand === 'cake';
  const accentBg = isCake ? 'bg-brand-sand text-[#110C08] hover:bg-white' : 'bg-brand-terracotta text-white hover:bg-brand-terracotta-dark';
  const accentBorder = isCake ? 'focus:border-brand-sand/50' : 'focus:border-brand-terracotta/50';

  return (
    <div className="bg-[#0a0a0a] rounded-[48px] p-8 md:p-16 border border-white/5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.01] rounded-full blur-3xl -mr-32 -mt-32" />
      
      <div className="relative z-10">
        <h3 className="text-3xl md:text-5xl font-serif text-white italic mb-12">Artisan <span className={isCake ? 'text-brand-sand' : 'text-brand-terracotta'}>Sorgu Formu</span></h3>
        
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-4">Adınız Soyadınız</label>
              <input type="text" className={cn("w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white focus:outline-none transition-all", accentBorder)} placeholder="Örn: Yiğit Onay" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-4">E-Posta Adresiniz</label>
              <input type="email" className={cn("w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white focus:outline-none transition-all", accentBorder)} placeholder="yigit@dysalatto.com" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-4">Konu</label>
            <select className={cn("w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white focus:outline-none transition-all appearance-none", accentBorder)}>
                <option className="bg-[#0a0a0a]">Genel Bilgi</option>
                <option className="bg-[#0a0a0a]">Özel Sipariş / Catering</option>
                <option className="bg-[#0a0a0a]">Franchise / İş Birliği</option>
                <option className="bg-[#0a0a0a]">Geri Bildirim</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-4">Mesajınız</label>
            <textarea rows={5} className={cn("w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white focus:outline-none transition-all resize-none", accentBorder)} placeholder="Size nasıl yardımcı olabiliriz?" />
          </div>

          <button className={cn("w-full md:w-auto px-12 py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-4 transition-all shadow-2xl", accentBg)}>
            MESAJI GÖNDER <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export { ContactCard, ContactForm };
