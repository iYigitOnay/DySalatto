"use client";

import React from "react";
import Link from "next/link";
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  FileText,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

// High-Quality Social Icons
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const Footer: React.FC = () => {
  const pathname = usePathname();
  const isCakePage = pathname?.startsWith("/cake");

  const brandName = isCakePage ? "DyCake" : "DySalatto";
  const primaryColorClass = isCakePage ? "text-brand-sand" : "text-brand-terracotta";
  const primaryBgClass = isCakePage ? "bg-brand-sand" : "bg-brand-terracotta";
  const primaryHoverClass = isCakePage ? "hover:text-brand-sand hover:border-brand-sand" : "hover:text-brand-terracotta hover:border-brand-terracotta";
  const primaryBorderFocusClass = isCakePage ? "focus:border-brand-sand/50" : "focus:border-brand-terracotta/50";
  const primaryButtonHoverClass = isCakePage ? "hover:bg-white" : "hover:bg-brand-terracotta-dark";
  const primaryButtonTextClass = isCakePage ? "text-[#110C08]" : "text-white";

  return (
    <footer className="bg-brand-charcoal pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[url('/images/grain.png')] opacity-[0.02] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          
          {/* 1. Brand & Identity (4 Columns) */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-8">
              <span className="text-3xl font-black text-white tracking-tighter uppercase">
                {brandName}<span className={primaryColorClass}>.</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-sm font-medium">
              {isCakePage 
                ? "Tatlı kaçamaklarını bir sanat eserine dönüştürüyoruz. Rafine şekersiz ve artisan dokunuşlarla ruhunuzu şımartın."
                : "Tazeliğin sanatla buluştuğu noktada, her öğünü bir deneyime dönüştürüyoruz. Modern beslenme kültürünü artisan dokunuşlarla yeniden tanımlıyoruz."}
            </p>
            <div className="flex gap-5">
              {[
                { icon: <InstagramIcon className="w-5 h-5" />, label: "Instagram", href: "#" },
                { icon: <TwitterIcon className="w-5 h-5" />, label: "Twitter", href: "#" },
                { icon: <FacebookIcon className="w-5 h-5" />, label: "Facebook", href: "#" }
              ].map((social) => (
                <a 
                  key={social.label} 
                  href={social.href} 
                  className={cn(
                    "w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-white/40 transition-all duration-500 bg-white/5",
                    primaryHoverClass
                  )}
                >
                  <span className="sr-only">{social.label}</span>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* 2. Navigation & Art (2 Columns) */}
          <div className="lg:col-span-2">
            <h3 className={cn("text-[10px] font-black tracking-[0.3em] uppercase mb-8", primaryColorClass)}>Kurumsal</h3>
            <ul className="space-y-4">
              {["Anasayfa", "Mutfak Sanatı", "Hikayemiz", "Sürdürülebilirlik", "Kariyer"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-white/60 hover:text-white transition-colors text-[13px] font-medium tracking-wide">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Support & Contact (3 Columns) */}
          <div className="lg:col-span-3">
            <h3 className={cn("text-[10px] font-black tracking-[0.3em] uppercase mb-8", primaryColorClass)}>İletişim & Destek</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-white/20 shrink-0" />
                <span className="text-white/60 text-[13px] font-medium leading-relaxed">Nişantaşı Mah. Abdi İpekçi Cad.<br/>No: 24, Şişli / İstanbul</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-white/20 shrink-0" />
                <span className="text-white/60 text-[13px] font-medium">+90 (212) 000 00 00</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-white/20 shrink-0" />
                <span className="text-white/60 text-[13px] font-medium">artisan@dysalatto.com</span>
              </li>
              <li className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-white/20 shrink-0" />
                <span className="text-white/60 text-[13px] font-medium italic">Her gün: 09:00 — 22:00</span>
              </li>
            </ul>
          </div>

          {/* 4. Newsletter (3 Columns) */}
          <div className="lg:col-span-3">
            <h3 className={cn("text-[10px] font-black tracking-[0.3em] uppercase mb-8", primaryColorClass)}>Bülten</h3>
            <p className="text-white/40 text-[13px] mb-6 font-medium">Yeni lezzetlerden ve sanatsal etkinliklerden haberdar olun.</p>
            <form className="relative group">
              <input 
                type="email" 
                placeholder="E-posta adresiniz" 
                className={cn(
                  "w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[13px] focus:outline-none transition-all duration-500 placeholder:text-white/20",
                  primaryBorderFocusClass
                )}
              />
              <button className={cn(
                "absolute right-2 top-2 bottom-2 px-5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300",
                primaryBgClass,
                primaryButtonTextClass,
                primaryButtonHoverClass
              )}>
                KAYDOL
              </button>
            </form>
            <p className="mt-4 text-[10px] text-white/20 leading-relaxed">
              Kaydolarak <Link href="#" className="underline hover:text-white transition-colors">Gizlilik Politikamızı</Link> kabul etmiş olursunuz.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Legal & Compliance */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
               <ShieldCheck className="w-4 h-4 text-white/20" />
            </div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase">
              © 2026 {brandName.toUpperCase()} ARTISAN FOODS. TÜM HAKLARI SAKLIDIR.
            </p>
          </div>
          
          <div className="flex items-center gap-8">
            {[
              { title: "K.V.K.K", icon: <FileText className="w-3.5 h-3.5" /> },
              { title: "Kullanım Koşulları", icon: <FileText className="w-3.5 h-3.5" /> },
              { title: "Çerez Politikası", icon: <FileText className="w-3.5 h-3.5" /> }
            ].map((legal) => (
              <a 
                key={legal.title} 
                href="#" 
                className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-white/20 uppercase hover:text-white transition-all duration-300 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">{legal.icon}</span>
                {legal.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
