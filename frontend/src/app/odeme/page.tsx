'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CreditCard, Home, MapPin, ShoppingBag, Check, Wallet, Smartphone, MessageSquare, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';

type CheckoutStep = 'summary' | 'shipping' | 'payment';

export default function CheckoutPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { items, clearCart, getTotalPrice } = useCartStore();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('summary');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentType, setPaymentType] = useState<'ONLINE' | 'CASH_AT_DOOR' | 'CARD_AT_DOOR'>('ONLINE');
  const [note, setNote] = useState('');
  const [couponCode, setCouponCode] = useState('');

  // Queries
  const { data: addressesRes } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => fetchApi('/addresses')
  });
  const addresses = addressesRes?.data || [];

  // Mutations
  const createOrderMutation = useMutation({
    mutationFn: (data: any) => fetchApi('/orders', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: (res) => {
      if (res.success) {
        showToast("Siparişiniz başarıyla alındı!", "success");
        clearCart();
        router.push(`/hesabim/siparisler/${res.data.id}`);
      }
    },
    onError: (error: any) => showToast(error.message, "error")
  });

  const handleOrderSubmit = () => {
    if (!selectedAddressId) {
      showToast("Lütfen teslimat adresi seçin.", "error");
      return;
    }
    
    createOrderMutation.mutate({
      items: items.map(item => ({
        id: item.id,
        brand: item.brand,
        quantity: item.quantity,
        price: item.price,
        isCustom: item.isCustom,
        ingredients: item.ingredients?.map(ing => ({
          id: ing.id,
          price: ing.price
        }))
      })),
      addressId: selectedAddressId,
      paymentType,
      note
    });
  };

  if (items.length === 0 && !createOrderMutation.isSuccess) {
    return (
      <main className="min-h-screen bg-[#050505] pt-40 pb-20">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 text-center">
           <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8 text-white/20">
             <ShoppingBag className="w-10 h-10" />
           </div>
           <h1 className="text-4xl font-serif text-white italic mb-4">Sepetiniz Boş</h1>
           <p className="text-white/40 mb-12">Henüz artisan bir seçim yapmadınız.</p>
           <button onClick={() => router.push('/salatto')} className="px-12 py-4 rounded-2xl bg-brand-terracotta text-white font-black text-xs uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95">MENÜYÜ KEŞFET</button>
        </div>
        <Footer />
      </main>
    );
  }

  const steps = [
    { id: 'summary', label: 'Özet', icon: ShoppingBag },
    { id: 'shipping', label: 'Adres', icon: MapPin },
    { id: 'payment', label: 'Ödeme', icon: CreditCard },
  ];

  return (
    <main className="min-h-screen bg-[#050505] selection:bg-brand-terracotta/30">
      <Navbar />

      <section className="pt-32 pb-40">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Progress Steps */}
          <div className="flex justify-center mb-16">
            <div className="flex items-center gap-4 md:gap-12 bg-white/5 border border-white/10 p-2 rounded-[32px] backdrop-blur-xl">
              {steps.map((step, idx) => {
                const isActive = currentStep === step.id;
                const isPast = steps.findIndex(s => s.id === currentStep) > idx;
                const StepIcon = step.icon;

                return (
                  <div key={step.id} className="flex items-center">
                    <button 
                      onClick={() => {
                        const targetIdx = steps.findIndex(s => s.id === step.id);
                        const currentIdx = steps.findIndex(s => s.id === currentStep);
                        if (targetIdx < currentIdx) setCurrentStep(step.id as CheckoutStep);
                      }}
                      className={cn(
                        "flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-500",
                        isActive ? "bg-white text-black shadow-2xl" : isPast ? "text-brand-terracotta" : "text-white/20"
                      )}
                    >
                      <StepIcon className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">{step.label}</span>
                      {isPast && <Check className="w-3 h-3 ml-1" />}
                    </button>
                    {idx < steps.length - 1 && (
                      <div className="w-4 h-[1px] bg-white/10 mx-2 sm:hidden" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Wizard Steps */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {currentStep === 'summary' && (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-4xl font-serif text-white italic">Sipariş Özeti</h2>
                      <span className="text-[10px] font-black tracking-widest text-white/20 uppercase">{items.length} Kalem</span>
                    </div>

                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-6 p-6 rounded-[32px] bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/5">
                            <img src={item.image || '/images/logo.png'} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-1">
                              <h3 className="text-white font-bold">{item.name}</h3>
                              <span className="text-white font-mono text-sm">{Number(item.price) * item.quantity} TL</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={cn(
                                "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                                item.brand === 'salatto' ? "bg-brand-terracotta/20 text-brand-terracotta" : "bg-brand-sand/20 text-brand-sand"
                              )}>
                                {item.brand}
                              </span>
                              <span className="text-white/30 text-xs font-medium">x{item.quantity}</span>
                            </div>
                            {item.ingredients && item.ingredients.length > 0 && (
                              <p className="text-white/20 text-[10px] mt-2 italic">
                                {item.ingredients.map(i => i.name).join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                      <div className="space-y-4">
                        <label className="flex items-center gap-2 text-[10px] font-black tracking-widest text-white/40 uppercase pl-2">
                          <MessageSquare className="w-3 h-3" /> Restorana Not
                        </label>
                        <textarea 
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Örn: Kapıyı çalmayın, bebek uyuyor..."
                          className="w-full bg-white/5 border border-white/5 rounded-[24px] p-6 text-white text-sm focus:outline-none focus:border-white/10 min-h-[120px] resize-none transition-all"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="flex items-center gap-2 text-[10px] font-black tracking-widest text-white/40 uppercase pl-2">
                          <Ticket className="w-3 h-3" /> İndirim Kodu
                        </label>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="ARTISAN15"
                            className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-white/10 transition-all"
                          />
                          <button className="px-6 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black text-white hover:bg-white/10 transition-all uppercase tracking-widest">Uygula</button>
                        </div>
                        <p className="text-white/20 text-[9px] pl-2 leading-relaxed">İlk siparişinize özel %15 indirim için ARTISAN15 kodunu kullanabilirsiniz.</p>
                      </div>
                    </div>

                    <div className="pt-12 flex justify-end">
                      <button 
                        onClick={() => setCurrentStep('shipping')}
                        className="group flex items-center gap-4 px-12 py-5 rounded-[32px] bg-white text-black font-black text-xs uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95"
                      >
                        DEVAM ET <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 'shipping' && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-4xl font-serif text-white italic">Teslimat Adresi</h2>
                      <button onClick={() => router.push('/hesabim/adresler')} className="text-[10px] font-black tracking-widest text-brand-terracotta uppercase hover:underline">Yeni Adres Ekle</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.length === 0 ? (
                        <div className="col-span-2 p-12 text-center border-2 border-dashed border-white/5 rounded-[40px]">
                          <Home className="w-10 h-10 text-white/10 mx-auto mb-4" />
                          <p className="text-white/40 text-sm">Kayıtlı adresiniz bulunamadı.</p>
                        </div>
                      ) : (
                        addresses.map((addr: any) => (
                          <button
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={cn(
                              "relative text-left p-8 rounded-[40px] border transition-all duration-500 overflow-hidden group",
                              selectedAddressId === addr.id 
                                ? "bg-white/10 border-brand-terracotta shadow-[0_0_40px_rgba(211,84,0,0.1)]" 
                                : "bg-white/5 border-white/5 hover:border-white/10"
                            )}
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div className={cn(
                                "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
                                selectedAddressId === addr.id ? "bg-brand-terracotta text-white" : "bg-white/5 text-white/20"
                              )}>
                                <Home className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="text-white font-bold">{addr.title}</h3>
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{addr.neighborhood}</p>
                              </div>
                            </div>
                            <p className="text-white/40 text-xs leading-relaxed line-clamp-2">
                              {addr.street}, No:{addr.buildingNo} Kat:{addr.floor} D:{addr.apartmentNo} <br />
                              {addr.district} / {addr.city}
                            </p>

                            {selectedAddressId === addr.id && (
                              <div className="absolute top-6 right-6">
                                <div className="w-6 h-6 rounded-full bg-brand-terracotta flex items-center justify-center">
                                  <Check className="w-3.5 h-3.5 text-white" />
                                </div>
                              </div>
                            )}
                          </button>
                        ))
                      )}
                    </div>

                    <div className="pt-12 flex items-center justify-between">
                      <button 
                        onClick={() => setCurrentStep('summary')}
                        className="flex items-center gap-3 text-white/40 hover:text-white transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Geri</span>
                      </button>
                      <button 
                        onClick={() => {
                          if (!selectedAddressId) return showToast("Lütfen bir adres seçin", "info");
                          setCurrentStep('payment');
                        }}
                        disabled={!selectedAddressId}
                        className={cn(
                          "group flex items-center gap-4 px-12 py-5 rounded-[32px] font-black text-xs uppercase tracking-widest shadow-2xl transition-all",
                          selectedAddressId ? "bg-white text-black hover:scale-105 active:scale-95" : "bg-white/5 text-white/10 cursor-not-allowed"
                        )}
                      >
                        ÖDEMEYE GEÇ <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 'payment' && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-10"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-4xl font-serif text-white italic">Ödeme Yöntemi</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: 'ONLINE', label: 'Online Ödeme', icon: CreditCard, desc: 'Kredi / Banka Kartı' },
                        { id: 'CARD_AT_DOOR', label: 'Kapıda Kart', icon: Smartphone, desc: 'Kuryede Öde' },
                        { id: 'CASH_AT_DOOR', label: 'Kapıda Nakit', icon: Wallet, desc: 'Nakit Ödeme' },
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setPaymentType(type.id as any)}
                          className={cn(
                            "relative p-6 rounded-[32px] border text-left transition-all duration-500 overflow-hidden",
                            paymentType === type.id 
                              ? "bg-white/10 border-brand-terracotta shadow-[0_0_40px_rgba(211,84,0,0.1)]" 
                              : "bg-white/5 border-white/5 hover:border-white/10"
                          )}
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all",
                            paymentType === type.id ? "bg-brand-terracotta text-white" : "bg-white/5 text-white/20"
                          )}>
                            <type.icon className="w-6 h-6" />
                          </div>
                          <h3 className="text-white font-bold text-sm mb-1">{type.label}</h3>
                          <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">{type.desc}</p>
                          
                          {paymentType === type.id && (
                            <div className="absolute top-6 right-6">
                               <div className="w-4 h-4 rounded-full bg-brand-terracotta" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Conditional Payment UI */}
                    <div className="p-10 rounded-[40px] bg-white/5 border border-white/5 relative overflow-hidden">
                       <AnimatePresence mode="wait">
                          {paymentType === 'ONLINE' ? (
                            <motion.div 
                              key="card-form"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="space-y-6"
                            >
                               <div className="flex items-center gap-4 mb-4">
                                  <CreditCard className="w-5 h-5 text-brand-terracotta" />
                                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Kart Bilgileri (Simülasyon)</span>
                               </div>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <input type="text" placeholder="Kart Üzerindeki İsim" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-white/20" />
                                  <input type="text" placeholder="Kart Numarası" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-white/20" />
                                  <input type="text" placeholder="AA / YY" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-white/20" />
                                  <input type="text" placeholder="CVC" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-white/20" />
                               </div>
                            </motion.div>
                          ) : (
                            <motion.div 
                              key="at-door-info"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-center py-6"
                            >
                               <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6", paymentType === 'CASH_AT_DOOR' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500')}>
                                  {paymentType === 'CASH_AT_DOOR' ? <Wallet className="w-8 h-8" /> : <Smartphone className="w-8 h-8" />}
                               </div>
                               <h4 className="text-xl font-serif text-white italic mb-2">Kapıda Ödeme</h4>
                               <p className="text-white/40 text-sm max-w-xs mx-auto">Sipariş tutarını ürünlerinizi teslim alırken {paymentType === 'CASH_AT_DOOR' ? 'nakit olarak' : 'kredi kartınızla'} kuryemize ödeyebilirsiniz.</p>
                            </motion.div>
                          )}
                       </AnimatePresence>
                    </div>

                    <div className="pt-12 flex items-center justify-between">
                      <button 
                        onClick={() => setCurrentStep('shipping')}
                        className="flex items-center gap-3 text-white/40 hover:text-white transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Geri</span>
                      </button>
                      <button 
                        onClick={handleOrderSubmit}
                        disabled={createOrderMutation.isPending}
                        className={cn(
                          "group flex items-center gap-4 px-12 py-5 rounded-[32px] bg-white text-black font-black text-xs uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95",
                          createOrderMutation.isPending && "opacity-50"
                        )}
                      >
                        {createOrderMutation.isPending ? 'İŞLENİYOR...' : 'SİPARİŞİ TAMAMLA'} <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Checkout Sidebar (Total) */}
            <div className="lg:col-span-4 lg:sticky lg:top-32">
               <div className="p-8 md:p-10 rounded-[48px] bg-white/5 border border-white/5 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-terracotta blur-[100px] opacity-[0.05] rounded-full pointer-events-none" />
                  
                  <h3 className="text-xl font-serif text-white italic mb-8">Ödeme Özeti</h3>

                  <div className="space-y-4 mb-10">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Ürünler</span>
                       <span className="text-sm font-mono text-white/60">{getTotalPrice()} TL</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Teslimat Ücreti</span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-green-400 bg-green-500/10 px-2 py-0.5 rounded">Ücretsiz</span>
                    </div>
                    {couponCode && (
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-brand-terracotta">İndirim (ARTISAN15)</span>
                          <span className="text-sm font-mono text-brand-terracotta">- 0 TL</span>
                       </div>
                    )}
                    <div className="h-[1px] bg-white/5 w-full my-4" />
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white">Genel Toplam</span>
                       <span className="text-4xl font-black text-white tracking-tighter">{getTotalPrice()} TL</span>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 flex-shrink-0">
                           <Home className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Teslimat Adresi</p>
                           <p className="text-[10px] text-white/60 leading-relaxed font-bold">
                              {selectedAddressId ? (
                                addresses.find((a: any) => a.id === selectedAddressId)?.title || 'Adres Seçildi'
                              ) : (
                                'Henüz seçim yapılmadı'
                              )}
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="mt-8">
                     <p className="text-[9px] text-white/20 text-center leading-relaxed italic px-4">
                        Siparişi onaylayarak kullanıcı sözleşmesini ve gizlilik politikasını kabul etmiş sayılırsınız.
                     </p>
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
