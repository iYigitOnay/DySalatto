"use client";

import React from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "../providers/AuthProvider";

const FloatingWhatsApp = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  
  // Sadece admin veya auth sayfalarında gizle
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/auth")) return null;

  // Sadece giriş yapmış kullanıcılarda göster
  if (!user) return null;

  const isCakePage = pathname?.startsWith("/cake");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-[88px] right-8 z-[150] pointer-events-auto"
    >
      <a href="https://wa.me/yournumber" target="_blank" rel="noopener noreferrer">
        <motion.div
          whileHover="hover"
          initial="initial"
          className="relative flex items-center justify-center group cursor-pointer"
        >
          {/* Buton - BrandSwitcher ile birebir aynı boyut (w-10 h-10) */}
          <motion.div 
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center relative z-20 transition-all duration-500",
              "bg-[#25D366] border border-white/10",
              "group-hover:shadow-[0_0_20px_rgba(37,211,102,0.4)]"
            )}
          >
            <img
              src="/cvgs/whatsapp-color-svgrepo-com.svg"
              alt="WhatsApp"
              className="w-5 h-5 brightness-0 invert"
            />
          </motion.div>

          {/* Sola doğru açılan yazı (Hover effect) */}
          <motion.div
            variants={{
              initial: { opacity: 0, width: 0, x: 10, filter: "blur(4px)" },
              hover: { opacity: 1, width: "auto", x: 0, filter: "blur(0px)" }
            }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-full overflow-hidden pr-4 z-10 hidden md:block"
          >
            <span className={cn(
              "text-[10px] font-black tracking-[0.3em] uppercase whitespace-nowrap transition-colors duration-500",
              isCakePage ? "text-brand-terracotta" : "text-[#25D366]"
            )}>
              BİZE ULAŞIN
            </span>
          </motion.div>

          {/* Hafif arkadan parlayan Ambient Glow */}
          <div className={cn(
            "absolute w-10 h-10 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 z-0",
            "bg-[#25D366]"
          )} />
        </motion.div>
      </a>
    </motion.div>
  );
};

export default FloatingWhatsApp;
