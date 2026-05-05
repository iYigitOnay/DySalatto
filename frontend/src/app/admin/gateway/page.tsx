'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';

export default function AdminGateway() {
  const router = useRouter();
  const { user } = useAuth();
  const [hoveredBrand, setHoveredBrand] = useState<'dysalatto' | 'dycake' | null>(null);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3001/api/auth/logout', { method: 'POST', credentials: 'include' });
      router.push('/auth');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <main className="relative w-full h-screen bg-[#050505] overflow-hidden flex flex-col md:flex-row">
      {/* Top Fixed Header */}
      <div className="absolute top-0 left-0 w-full p-8 z-50 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-[#050505]/50 backdrop-blur-md">
            <span className="text-white font-black text-base tracking-tighter">DY</span>
          </div>
          <div className="hidden sm:block">
            <h2 className="text-sm font-bold text-white tracking-widest uppercase">
              {user ? `Hoş Geldiniz, ${user.name.split(' ')[0]}` : 'Yönetim Geçidi'}
            </h2>
            <p className="text-[10px] text-white/40 tracking-[0.3em] uppercase">Sistem Seçimi</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="pointer-events-auto flex items-center gap-3 px-6 py-3 rounded-full border border-white/5 bg-[#050505]/50 backdrop-blur-md hover:bg-white/10 text-[10px] font-black text-white/60 tracking-[0.2em] uppercase hover:text-white transition-all"
        >
          OTURUMU KAPAT <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Center Welcome Text (Fades out on hover) */}
      <AnimatePresence>
        {hoveredBrand === null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 text-center pointer-events-none"
          >
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full border border-white/10 bg-[#050505]/50 backdrop-blur-md">
               <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
               <span className="text-[10px] font-black tracking-[0.3em] text-white/60 uppercase">Güvenli Alan</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif text-white italic drop-shadow-2xl">
              Çalışma Alanınızı <br /> Seçin
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Side: DYSalatto */}
      <Link 
        href="/admin/dysalatto/dashboard"
        onMouseEnter={() => setHoveredBrand('dysalatto')}
        onMouseLeave={() => setHoveredBrand(null)}
        className={cn(
          "relative flex-1 flex flex-col justify-end p-8 md:p-16 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group border-b md:border-b-0 md:border-r border-white/5",
          hoveredBrand === 'dysalatto' ? "md:flex-[1.5]" : hoveredBrand === 'dycake' ? "md:flex-[0.5]" : ""
        )}
      >
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="/images/forDYSalatto/header1.jpg" 
            alt="DYSalatto" 
            className={cn(
              "w-full h-full object-cover transition-all duration-1000",
              hoveredBrand === 'dysalatto' ? "scale-105 opacity-40 grayscale-[20%]" : "scale-100 opacity-10 grayscale-[80%]"
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
        </div>

        {/* Content */}
        <div className={cn(
          "relative z-10 transition-all duration-700 transform",
          hoveredBrand === 'dysalatto' ? "translate-y-0 opacity-100" : "translate-y-8 opacity-60"
        )}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-brand-terracotta" />
            <span className="text-[10px] font-black tracking-[0.4em] text-brand-terracotta uppercase">Taze & Canlı</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-6">DYSalatto</h2>
          
          <div className={cn(
            "overflow-hidden transition-all duration-700",
            hoveredBrand === 'dysalatto' ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          )}>
            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-sm font-medium">
              Kaseler, salatalar ve doğal içeceklerin operasyon merkezi. Siparişleri ve taze malzemeleri yönetin.
            </p>
            <div className="inline-flex items-center gap-3 text-[11px] font-black tracking-[0.3em] text-[#050505] uppercase bg-brand-terracotta hover:bg-brand-terracotta-dark px-8 py-4 rounded-full transition-colors">
              PANELE GİRİŞ YAP <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>

      {/* Right Side: DYCake */}
      <Link 
        href="/admin/dycake/dashboard"
        onMouseEnter={() => setHoveredBrand('dycake')}
        onMouseLeave={() => setHoveredBrand(null)}
        className={cn(
          "relative flex-1 flex flex-col justify-end p-8 md:p-16 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group",
          hoveredBrand === 'dycake' ? "md:flex-[1.5]" : hoveredBrand === 'dysalatto' ? "md:flex-[0.5]" : ""
        )}
      >
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="/images/forDYCake/header1.png" 
            alt="DYCake" 
            className={cn(
              "w-full h-full object-cover transition-all duration-1000",
              hoveredBrand === 'dycake' ? "scale-105 opacity-40 grayscale-[20%]" : "scale-100 opacity-10 grayscale-[80%]"
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
        </div>

        {/* Content */}
        <div className={cn(
          "relative z-10 transition-all duration-700 transform",
          hoveredBrand === 'dycake' ? "translate-y-0 opacity-100" : "translate-y-8 opacity-60"
        )}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-brand-sand" />
            <span className="text-[10px] font-black tracking-[0.4em] text-brand-sand uppercase">Tatlı & Artisan</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-6">DYCake</h2>
          
          <div className={cn(
            "overflow-hidden transition-all duration-700",
            hoveredBrand === 'dycake' ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          )}>
            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-sm font-medium">
              Rafine şekersiz tatlılar, pastalar ve özel siparişlerin yönetim dünyası. Artisan reçeteleri düzenleyin.
            </p>
            <div className="inline-flex items-center gap-3 text-[11px] font-black tracking-[0.3em] text-[#050505] uppercase bg-brand-sand hover:bg-white px-8 py-4 rounded-full transition-colors">
              PANELE GİRİŞ YAP <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </main>
  );
}
