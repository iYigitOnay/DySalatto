"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, Menu, X, User, ShoppingBag, MapPin, ShieldCheck, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WetPaintButton from "../ui/WetPaintButton";
import { useAuth } from "../providers/AuthProvider";

const FILL_MS = 250;

// --- Data ---
const BOWL_DATA = {
  title: "Bowl Tariflerimiz",
  desc: "Doğadan tabağınıza gelen en taze malzemelerle hazırlanan gurme lezzetler.",
  items: [
    { title: "Protein Bowl", desc: "Tavuk, kinoa ve taze sebzeler." },
    { title: "Veggie Bowl", desc: "Avokado, nohut ve özel soslar." },
    { title: "Akdeniz Salatası", desc: "Peynir, zeytin ve Ege esintisi." },
    { title: "Detox Bowl", desc: "Yeşil elma, chia ve ferahlık." },
  ],
};

const CAKE_DATA = {
  title: "Artisan Tatlılarımız",
  desc: "Rafine şekersiz ve glutensiz seçeneklerle hazırlanan butik pastalar.",
  items: [
    { title: "San Sebastian", desc: "Akışkan dokulu meşhur Bask keki." },
    { title: "Çikolatalı Tart", desc: "Belçika çikolatalı yoğun lezzet." },
    { title: "Fit Orman Meyveli", desc: "Şekersiz ve hafif meyve şöleni." },
    { title: "Bademli Cookies", desc: "Glutensiz ve kıtır artisan kurabiye." },
  ],
};

// --- Sub-components ---
const MegaMenu = ({ data, isCakePage }: { data?: typeof BOWL_DATA, isCakePage: boolean }) => {
  if (!data) return null;
  const primaryColor = isCakePage ? "text-brand-sand" : "text-brand-terracotta";
  const hoverBorder = isCakePage ? "hover:border-brand-sand/20" : "hover:border-brand-terracotta/20";
  const hoverBg = isCakePage ? "hover:bg-brand-sand/5" : "hover:bg-brand-cream/10";
  const hoverText = isCakePage ? "group-hover:text-brand-sand" : "group-hover:text-brand-terracotta";

  return (
    <div className="megamenu-container w-[700px] flex border-0 ring-1 ring-white/10 shadow-2xl overflow-hidden rounded-3xl">
      {/* Left Panel: Brand Title */}
      <div className="menu-left-dark w-[260px] bg-[#0a0a0a] p-10 border-r border-white/5">
        <div>
          <h3 className={cn("text-2xl font-serif mb-4 tracking-tight leading-tight", primaryColor)}>
            {isCakePage ? "Tatlı" : "Tazeliğin"} <br />
            <span className="italic font-normal">{isCakePage ? "Sanatı" : "Sanatı"}</span>
          </h3>
          <p className="text-[12px] text-white/80 leading-relaxed font-medium">
            {data.desc}
          </p>
        </div>
        <a
          href="#"
          className={cn("flex items-center gap-2 text-[10px] font-black tracking-widest group mt-12 uppercase", primaryColor)}
        >
          TÜMÜNÜ İNCELE{" "}
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      {/* Right Panel: Clean White Grid */}
      <div className="flex-1 p-8 grid grid-cols-2 gap-4 bg-white">
        {data.items.map((item, i) => (
          <a
            key={i}
            href="#"
            className={cn("p-5 border border-gray-50 rounded-2xl transition-all group", hoverBorder, hoverBg)}
          >
            <p className={cn("text-sm font-bold text-brand-charcoal mb-1 transition-colors", hoverText)}>
              {item.title}
            </p>
            <p className="text-[11px] text-gray-400 leading-tight font-medium">
              {item.desc}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
};

const NavItem = ({
  title,
  hasMenu = false,
  data,
  isCakePage,
  href
}: {
  title: string;
  hasMenu?: boolean;
  data: typeof BOWL_DATA;
  isCakePage: boolean;
  href: string;
}) => {
  const [isFilling, setIsFilling] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (window.innerWidth < 1024) return;
    if (isOpen) return;
    setIsFilling(true);
    timerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, FILL_MS);
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 1024) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsFilling(false);
    setIsOpen(false);
  };

  return (
    <li
      className={cn(
        "nav-item relative h-full flex items-center",
        isOpen && "open",
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={href}
        className={cn(
          "nav-link flex items-center gap-1.5 px-5 py-1 text-[11px] font-black uppercase tracking-[0.2em] transition-all",
          isFilling || isOpen
            ? "text-white filling"
            : "text-white/70 hover:text-white",
        )}
      >
        {title}
        {hasMenu && (
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 opacity-50 transition-transform",
              isOpen && "rotate-180 opacity-100",
            )}
          />
        )}
      </Link>

      <AnimatePresence>
        {isOpen && hasMenu && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 z-50 pt-3 hidden lg:block"
          >
            {/* Elegant Arrow */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0a0a0a] rotate-45 z-0" />
            <MegaMenu data={data} isCakePage={isCakePage} />
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const { user, logout } = useAuth();

  const isCakePage = pathname?.startsWith("/cake");
  const logoSrc = isCakePage
    ? "/images/forDYCake/DyCakeLogo.png"
    : "/images/forDYSalatto/DySalattoLogo.png";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { title: "DYSALATTO", hasMenu: true, data: BOWL_DATA, visible: !isCakePage, href: "/salatto" },
    { title: "DYCAKE", hasMenu: true, data: CAKE_DATA, visible: isCakePage, href: "/cake" },
    { title: "MUTFAĞIMIZ", hasMenu: false, data: isCakePage ? CAKE_DATA : BOWL_DATA, visible: true, href: isCakePage ? "/cake/mutfagimiz" : "/salatto/mutfagimiz" },
    { title: "HİKAYEMİZ", hasMenu: false, data: isCakePage ? CAKE_DATA : BOWL_DATA, visible: true, href: isCakePage ? "/cake/hikayemiz" : "/salatto/hikayemiz" },
    { title: "İLETİŞİM", hasMenu: false, data: isCakePage ? CAKE_DATA : BOWL_DATA, visible: true, href: isCakePage ? "/cake/iletisim" : "/salatto/iletisim" },
  ].filter(link => link.visible);

  return (
    <>
      <nav
        style={{
          "--brand-primary": isCakePage ? "#F5DEB3" : "#D35400",
          "--brand-primary-dark": isCakePage ? "#E5CE93" : "#A04000",
        } as React.CSSProperties}
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] flex items-center transition-all duration-500 ease-in-out px-4 md:px-8",
          isScrolled
            ? "h-16 bg-[#0a0a0a]/95 backdrop-blur-[12px] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]"
            : "h-24 bg-transparent",
        )}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center h-full relative">
          {/* 1. Left Column: Logo - Anchored container */}
          <div className="flex-1 flex items-center justify-start h-full">
            <div className="flex items-center min-w-[120px] md:min-w-[160px]">
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-white/70 hover:text-white transition-colors mr-2"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>

              <a
                href="#"
                className="flex items-center transition-all duration-500 hover:scale-105 active:scale-95"
              >
                <img
                  src={logoSrc}
                  alt={isCakePage ? "DyCake Logo" : "DySalatto Logo"}
                  className="h-8 md:h-10.5 w-auto object-contain brightness-0 invert transition-all duration-500"
                />
              </a>
            </div>
          </div>

          {/* 2. Middle Column: Desktop Nav Links - Fixed absolute center */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-0 bottom-0 items-center justify-center">
            <ul className="flex items-center gap-4">
              {navLinks.map((link) => (
                <NavItem
                  key={link.title}
                  title={link.title}
                  hasMenu={link.hasMenu}
                  data={link.data}
                  isCakePage={isCakePage}
                  href={link.href}
                />
              ))}
            </ul>
          </div>

          {/* 3. Right Column: Actions Group */}
          <div className="flex-1 flex items-center justify-end h-full">
            <div className="flex items-center gap-4 w-full max-w-[320px] justify-end shrink-0">
              
              {/* User Profile Dropdown or WP Button */}
              {user ? (
                <div className="relative" onMouseLeave={() => setIsProfileDropdownOpen(false)}>
                  <button 
                    onMouseEnter={() => setIsProfileDropdownOpen(true)}
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 group h-10 px-3 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black",
                      isCakePage ? "bg-brand-sand text-brand-charcoal" : "bg-brand-terracotta text-white"
                    )}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-white/80 group-hover:text-white transition-colors hidden sm:block">
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-white/50 group-hover:text-white" />
                  </button>

                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full pt-2 w-56 z-[200]"
                      >
                        <div className="bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                          <div className="p-4 border-b border-white/5 bg-white/5">
                            <p className="text-xs font-bold text-white mb-1">{user.name}</p>
                            <p className="text-[10px] text-white/50">{user.email}</p>
                          </div>
                          <div className="p-2 flex flex-col gap-1">
                            <Link href="/hesabim/siparisler" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-colors text-xs font-semibold">
                              <ShoppingBag className="w-4 h-4" />
                              Siparişlerim
                            </Link>
                            <Link href="/hesabim/adresler" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-colors text-xs font-semibold">
                              <MapPin className="w-4 h-4" />
                              Adreslerim
                            </Link>
                            <Link href="/hesabim/ayarlar" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-colors text-xs font-semibold">
                              <Settings className="w-4 h-4" />
                              Ayarlar
                            </Link>
                            
                            {user.role === "ADMIN" && (
                              <Link href="/admin/gateway" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-terracotta/10 text-brand-terracotta transition-colors text-xs font-bold mt-1 bg-brand-terracotta/5">
                                <ShieldCheck className="w-4 h-4" />
                                Yönetim Paneli
                              </Link>
                            )}
                          </div>
                          <div className="p-2 border-t border-white/5">
                            <button 
                              onClick={logout}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors text-xs font-semibold"
                            >
                              <LogOut className="w-4 h-4" />
                              Çıkış Yap
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {/* Animated WhatsApp Button (Giriş Yapmayanlar İçin Navbar'da) */}
                  <motion.a
                    href="https://wa.me/yournumber"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={false}
                    animate="initial"
                    whileHover="hover"
                    className="relative hidden sm:flex items-center justify-end h-10 rounded-full cursor-pointer shrink-0"
                  >
                    <motion.div
                      variants={{
                        initial: { backgroundColor: "#25D366", width: "40px" },
                        hover: { 
                          backgroundColor: isCakePage ? "#F5DEB3" : "#D35400", 
                          width: "125px" 
                        },
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="absolute right-0 inset-y-0 rounded-full"
                    />

                    <div className="relative flex items-center h-full px-[10px] whitespace-nowrap overflow-hidden">
                      <motion.span
                        variants={{
                          initial: { opacity: 0, x: -5 },
                          hover: { opacity: 1, x: 0 },
                        }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "mr-2 text-[9px] font-black tracking-widest uppercase",
                          isCakePage ? "text-[#110C08]" : "text-white"
                        )}
                      >
                        BİZE ULAŞIN
                      </motion.span>
                      <img
                        src="/cvgs/whatsapp-color-svgrepo-com.svg"
                        alt="WhatsApp"
                        className="w-5 h-5 shrink-0 brightness-0 invert"
                      />
                    </div>
                  </motion.a>
                </div>
              )}

              <div className="flex items-center h-10 shrink-0 min-w-[120px] justify-end">
                <Link href={user ? (isCakePage ? "/cake/mutfagimiz" : "/salatto/mutfagimiz") : "/auth"}>
                  <WetPaintButton
                    isScrolled={isScrolled}
                    className="whitespace-nowrap"
                    theme={isCakePage ? "cake" : "salatto"}
                  >
                    SİPARİŞ VER
                  </WetPaintButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-[#0a0a0a] z-[120] lg:hidden flex flex-col p-8 border-r border-white/5"
            >
              <div className="flex items-center justify-between mb-12">
                <img
                  src={logoSrc}
                  alt={isCakePage ? "DyCake Logo" : "DySalatto Logo"}
                  className="h-10 brightness-0 invert"
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile User Profile Area */}
              {user && (
                <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-black text-lg",
                      isCakePage ? "bg-brand-sand text-[#111]" : "bg-brand-terracotta text-white"
                    )}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-white/50">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Link href="/hesabim/siparisler" className="flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/5">
                       <ShoppingBag className="w-4 h-4" /> Siparişlerim
                    </Link>
                    <Link href="/hesabim/adresler" className="flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/5">
                       <MapPin className="w-4 h-4" /> Adreslerim
                    </Link>
                    <Link href="/hesabim/ayarlar" className="flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/5">
                       <Settings className="w-4 h-4" /> Ayarlar
                    </Link>
                    {user.role === "ADMIN" && (
                      <Link href="/admin/gateway" className="flex items-center gap-2 text-xs font-bold text-brand-terracotta hover:text-brand-terracotta p-2 rounded-lg bg-brand-terracotta/10">
                        <ShieldCheck className="w-4 h-4" /> Yönetim Paneli
                      </Link>
                    )}
                    <button onClick={logout} className="w-full flex items-center gap-2 text-xs font-semibold text-red-400 p-2 rounded-lg hover:bg-red-500/10">
                      <LogOut className="w-4 h-4" /> Çıkış Yap
                    </button>
                  </div>
                </div>
              )}

              <nav className="flex-1">
                <ul className="flex flex-col gap-6">
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={link.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <a
                        href={link.href}
                        className={cn(
                          "text-2xl font-serif text-white/90 transition-colors flex items-center justify-between group",
                          isCakePage ? "hover:text-brand-sand" : "hover:text-brand-terracotta"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.title}
                        <ArrowRight className={cn(
                          "w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all",
                          isCakePage ? "text-brand-sand" : "text-brand-terracotta"
                        )} />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
                <Link href={isCakePage ? "/cake/mutfagimiz" : "/salatto/mutfagimiz"}>
                  <WetPaintButton
                    isScrolled={false}
                    className="w-full justify-center"
                    theme={isCakePage ? "cake" : "salatto"}
                  >
                    SİPARİŞ VER
                  </WetPaintButton>
                </Link>

                <div>
                  <p className="text-[10px] text-white/30 tracking-[0.3em] uppercase mb-4">
                    Sosyal Medya
                  </p>
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="text-white/50 hover:text-brand-terracotta transition-colors text-sm font-bold uppercase tracking-widest"
                    >
                      Instagram
                    </a>
                    <a
                      href="#"
                      className="text-white/50 hover:text-brand-terracotta transition-colors text-sm font-bold uppercase tracking-widest"
                    >
                      Twitter
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
