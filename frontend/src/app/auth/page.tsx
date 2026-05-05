'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Star, User, ShoppingBag, ShieldCheck, Eye, EyeOff, CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';

const AuthPage = () => {
  const [mode, setMode] = useState<'selection' | 'login' | 'register'>('selection');
  const [showPassword, setShowPassword] = useState(false);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Status States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const requirements = [
    { label: 'En az 6 karakter', met: password.length >= 6 },
    { label: 'En az 1 rakam', met: /\d/.test(password) },
    { label: 'En az 1 özel karakter', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const handleModeChange = (newMode: 'selection' | 'login' | 'register') => {
    setMode(newMode);
    setShowPassword(false);
    setEmail('');
    setPassword('');
    setName('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      
      // Eğer kullanıcı adı girilmediyse email'in @ işaretine kadar olan kısmını isim yapıyoruz.
      const body = mode === 'login' 
        ? { email, password }
        : { email, password, name: name || email.split('@')[0] };

      // Backend'in 3001 portunda çalıştığını varsayarak istek atıyoruz
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        // Eğer backend hata döndürdüyse
        setError(data.message || data.errors?.[0]?.message || 'Bir hata oluştu.');
        return;
      }

      // Başarılı senaryo
      if (mode === 'register') {
        alert('Kayıt başarılı! Lütfen giriş yapınız.');
        setMode('login'); // handleModeChange kullanmıyoruz ki şifre ve mail silinmesin
      } else {
        // Herkesi (Admin dahil) ana sayfaya yönlendiriyoruz.
        // Admin panele geçiş, ana sayfadaki profil menüsünden yapılacak.
        window.location.href = '/';
      }

    } catch (err) {
      setError('Sunucuya bağlanılamadı. Lütfen backendin (3001 portunda) çalıştığından emin olun.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#050505] selection:bg-brand-terracotta/30">
      {/* 1. Ultra-Smooth Performance Background */}
      <div className="absolute inset-0 z-0 flex pointer-events-none">
        <div className="w-1/2 h-full relative overflow-hidden bg-brand-charcoal">
          <img 
            src="/images/forDYSalatto/header1.jpg" 
            className="w-full h-full object-cover opacity-20 scale-105" 
            alt="" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        </div>
        <div className="w-1/2 h-full relative overflow-hidden bg-[#110c08]">
          <img 
            src="/images/forDYCake/header1.png" 
            className="w-full h-full object-cover opacity-20 scale-105" 
            alt="" 
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 to-transparent" />
        </div>
        <div className="absolute inset-0 bg-[url('/images/grain.png')] opacity-[0.02]" />
      </div>

      {/* 2. Focused Artisan Interface */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
        <motion.div 
          layout
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className={cn(
            "w-full bg-white/[0.03] border border-white/5 rounded-[48px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-700 transform-gpu min-h-[650px]",
            mode === 'selection' ? "max-w-5xl" : "max-w-2xl"
          )}
        >
          <AnimatePresence mode="wait">
            {mode === 'selection' ? (
              <motion.div 
                key="selection"
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                className="w-full min-h-[650px] flex flex-col md:flex-row"
              >
                {/* Left: Guest Entry */}
                <div 
                  onClick={() => {/* Navigate to menu */}}
                  className="flex-1 p-12 md:p-16 flex flex-col justify-between group cursor-pointer hover:bg-white/[0.01] transition-colors relative border-b md:border-b-0 md:border-r border-white/5"
                >
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center mb-8 group-hover:border-white/30 transition-all duration-500">
                      <ShoppingBag className="w-6 h-6 text-white/40 group-hover:text-white" />
                    </div>
                    <h2 className="text-4xl font-serif text-white italic mb-6 leading-tight">Hızlıca <br/> Başlayın</h2>
                    <p className="text-white/40 text-base leading-relaxed max-w-[280px]">Üye olmadan misafir girişi ile lezzet dünyamızı keşfedin.</p>
                  </div>
                  
                  <div className="relative z-10 flex items-center gap-3 text-[10px] font-black tracking-[0.3em] text-white/20 uppercase group-hover:text-brand-terracotta transition-colors duration-500">
                    MİSAFİR GİRİŞİ <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>

                {/* Right: Membership Entry */}
                <div className="flex-1 p-12 md:p-16 flex flex-col justify-between bg-white/[0.02] relative group">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-2 h-2 rounded-full bg-brand-terracotta shadow-[0_0_15px_rgba(211,84,0,0.8)]" />
                      <span className="text-[10px] font-black tracking-[0.4em] text-brand-terracotta uppercase">Ayrıcalıklı Sanat</span>
                    </div>
                    <h2 className="text-4xl font-serif text-white italic mb-8 leading-tight">Sanatın <br/> Parçası Olun</h2>
                    
                    <div className="space-y-5">
                       <div className="flex items-start gap-4">
                          <div className="p-2 bg-brand-terracotta/10 rounded-lg"><Star className="w-4 h-4 text-brand-terracotta" /></div>
                          <p className="text-white/60 text-sm leading-snug">İlk siparişe özel <span className="text-white font-bold">%15 indirim</span> fırsatını yakalayın.</p>
                       </div>
                       <div className="flex items-start gap-4">
                          <div className="p-2 bg-brand-sand/10 rounded-lg"><ShieldCheck className="w-4 h-4 text-brand-sand" /></div>
                          <p className="text-white/60 text-sm leading-snug">Sipariş geçmişi ve <span className="text-white font-bold">hızlı ödeme</span> avantajlarından yararlanın.</p>
                       </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col gap-4 mt-10">
                    <button 
                      onClick={() => handleModeChange('register')}
                      className="w-full py-5 bg-brand-terracotta text-white rounded-[24px] font-black text-xs tracking-widest hover:shadow-[0_0_40px_rgba(211,84,0,0.4)] transition-all uppercase transform-gpu active:scale-95"
                    >
                      Bize Katılın
                    </button>
                    <button 
                      onClick={() => handleModeChange('login')}
                      className="text-[10px] font-black tracking-[0.3em] text-white/30 hover:text-white transition-colors uppercase text-center"
                    >
                      Zaten Üyeyim, Giriş Yap
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full min-h-[650px] flex flex-col items-center justify-center p-12 md:p-16 text-center relative"
              >
                {/* Close/Back Button */}
                <button 
                  type="button"
                  onClick={() => handleModeChange('selection')}
                  className="absolute top-10 left-10 flex items-center gap-2 text-white/20 hover:text-white transition-colors text-[9px] font-black tracking-widest uppercase group"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Seçime Dön
                </button>

                <div className="max-w-md w-full">
                  <div className="w-16 h-16 rounded-3xl bg-brand-terracotta/10 flex items-center justify-center mb-6 mx-auto border border-brand-terracotta/20 shadow-[0_0_30px_rgba(211,84,0,0.1)]">
                    {mode === 'login' ? <User className="w-6 h-6 text-brand-terracotta" /> : <Star className="w-6 h-6 text-brand-terracotta" />}
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-serif text-white italic mb-4 leading-tight">
                    {mode === 'login' ? 'Tekrar Hoş Geldiniz' : 'Aramıza Katılın'}
                  </h2>
                  <p className="text-white/40 text-sm mb-6 max-w-[280px] mx-auto leading-relaxed">
                    {mode === 'login' ? 'Sanat dolu bir öğün için kaldığınız yerden devam edin.' : 'Kayıt olun ve ilk siparişinize özel %15 indirimi kapın.'}
                  </p>

                  {/* HATA MESAJI */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-left">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5 text-left">
                    {/* Sadece Kayıt modunda Ad Soyad Göster */}
                    {mode === 'register' && (
                       <div className="group relative">
                         <input 
                           type="text" 
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           placeholder="Adınız Soyadınız (Opsiyonel)" 
                           className="w-full bg-white/[0.06] border border-white/10 rounded-2xl py-5 px-6 text-white text-sm focus:outline-none focus:border-brand-terracotta/50 focus:bg-white/[0.08] transition-all placeholder:text-white/30" 
                         />
                       </div>
                    )}

                    <div className="group relative">
                      <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-Posta Adresiniz" 
                        className="w-full bg-white/[0.06] border border-white/10 rounded-2xl py-5 px-6 text-white text-sm focus:outline-none focus:border-brand-terracotta/50 focus:bg-white/[0.08] transition-all placeholder:text-white/30" 
                      />
                    </div>
                    
                    <div className="group relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Şifreniz" 
                        className="w-full bg-white/[0.06] border border-white/10 rounded-2xl py-5 px-6 text-white text-sm focus:outline-none focus:border-brand-terracotta/50 focus:bg-white/[0.08] transition-all placeholder:text-white/30 pr-14" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Registration Requirements */}
                    {mode === 'register' && (
                      <div className="grid grid-cols-1 gap-2 px-2 py-2">
                        {requirements.map((req, i) => (
                          <div key={i} className="flex items-center gap-3">
                            {req.met ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-terracotta" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-white/10" />
                            )}
                            <span className={cn(
                              "text-[10px] font-bold tracking-widest uppercase transition-colors",
                              req.met ? "text-white/60" : "text-white/20"
                            )}>
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {mode === 'login' && (
                      <div className="text-right px-2">
                        <button type="button" className="text-[10px] font-black text-white/30 hover:text-brand-terracotta transition-colors uppercase tracking-widest">
                          Şifremi Unuttum
                        </button>
                      </div>
                    )}
                    
                    <button 
                      disabled={loading}
                      type="submit" 
                      className="w-full py-6 bg-brand-terracotta text-white rounded-[24px] font-black text-xs tracking-widest hover:shadow-[0_0_40px_rgba(211,84,0,0.4)] transition-all uppercase transform-gpu active:scale-95 mt-2 disabled:opacity-50"
                    >
                      {loading ? 'YÜKLENİYOR...' : (mode === 'login' ? 'OTURUM AÇ' : 'KAYDI TAMAMLA')}
                    </button>
                  </form>
                  
                  <div className="mt-8 pt-8 border-t border-white/5">
                    <button 
                      type="button"
                      onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
                      className="text-[10px] font-black tracking-[0.2em] text-white/20 hover:text-white transition-colors uppercase inline-flex flex-wrap justify-center items-center gap-2 leading-relaxed"
                    >
                      {mode === 'login' ? 'HENÜZ ÜYE DEĞİL MİSİNİZ?' : 'ZATEN BİR HESABINIZ VAR MI?'}
                      <span className="text-brand-terracotta underline underline-offset-4 decoration-brand-terracotta/30">
                        {mode === 'login' ? 'HEMEN KAYDOLUN' : 'GİRİŞ YAPIN'}
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 3. Minimal Branding */}
      <div className="absolute top-10 left-10 md:left-20 z-20 pointer-events-none overflow-hidden">
        <Link href="/" className="pointer-events-auto flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:border-brand-terracotta transition-colors">
            <span className="text-white font-black text-sm tracking-tighter group-hover:text-brand-terracotta">DY</span>
          </div>
          <span className="text-[10px] font-black text-white/30 tracking-[0.4em] uppercase group-hover:text-white transition-colors">Portal</span>
        </Link>
      </div>
    </main>
  );
};

export default AuthPage;
