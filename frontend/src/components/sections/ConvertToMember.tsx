'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';
import { cn } from '@/lib/utils';

export default function ConvertToMember() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!user || user.role !== 'GUEST') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetchApi('/auth/convert-guest', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });

      if (res.success) {
        setSuccess(true);
        // Sayfayı yenileyerek yeni user state'ini almasını sağlayalım
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setError(res.message || 'Bir hata oluştu.');
      }
    } catch (err: any) {
      setError(err.message || 'Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden p-8 md:p-12 rounded-[48px] bg-gradient-to-br from-brand-terracotta/20 to-brand-charcoal border border-brand-terracotta/20 shadow-2xl">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Star className="w-32 h-32 text-brand-terracotta rotate-12" />
      </div>

      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-brand-terracotta flex items-center justify-center text-white">
                <Star className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-terracotta">Ayrıcalıklı Sanat</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-serif text-white italic mb-4">Siparişinizi Sanata Dönüştürün</h2>
            <p className="text-white/60 text-sm mb-8 max-w-lg leading-relaxed">
              Misafir olarak verdiğiniz bu siparişi hesabınıza kaydedin. Bir şifre belirleyerek sonraki siparişlerinizde %15 indirim kazanın ve sipariş takibi yapın.
            </p>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20">
                  <User className="w-4 h-4" />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="Adınız Soyadınız"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:border-brand-terracotta/50 transition-all"
                />
              </div>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  type="email" 
                  required
                  placeholder="E-Posta Adresiniz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:border-brand-terracotta/50 transition-all"
                />
              </div>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type="password" 
                  required
                  placeholder="Şifreniz"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:border-brand-terracotta/50 transition-all"
                />
              </div>
              
              {error && (
                <p className="md:col-span-3 text-red-400 text-xs font-bold mt-2 ml-2">
                  {error}
                </p>
              )}

              <div className="md:col-span-3 mt-4">
                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full md:w-auto px-12 py-4 bg-brand-terracotta text-white rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase hover:shadow-[0_10px_30px_rgba(211,84,0,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? 'İşleniyor...' : (
                    <>
                      ÜYELİĞİMİ TAMAMLA <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-10 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-serif text-white italic mb-2">Aramıza Hoş Geldiniz!</h2>
            <p className="text-white/60 text-sm">Hesabınız başarıyla oluşturuldu. Profilinize yönlendiriliyorsunuz...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
