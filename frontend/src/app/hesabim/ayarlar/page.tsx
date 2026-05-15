"use client";

import React from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import { motion } from "framer-motion";
import { Settings, User, Mail, Shield, Save, Key, RefreshCcw, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";

export default function SettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const pathname = usePathname();
  const isCakePage = pathname?.startsWith("/cake") || pathname?.includes("brand=cake");

  const [showVerify, setShowVerify] = React.useState(false);
  const [pendingEmail, setEmail] = React.useState("");
  const [verificationCode, setVerificationCode] = React.useState("");

  const accentColor = isCakePage ? "text-brand-sand" : "text-brand-terracotta";
  const accentBtn = isCakePage ? "bg-brand-sand text-brand-charcoal" : "bg-brand-terracotta text-white";

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => fetchApi("/auth/update-profile", { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: (res: any) => {
      if (res.requiresVerification) {
        showToast(res.message, "info");
        setEmail(res.data.email);
        setShowVerify(true);
      } else {
        showToast("Profil bilgileriniz güncellendi.", "success");
      }
    }
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (data: any) => fetchApi("/auth/verify-email", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      showToast("E-posta adresiniz başarıyla doğrulandı.", "success");
      setShowVerify(false);
      window.location.reload(); // Refresh to update user context
    },
    onError: (err: any) => {
      showToast(err.message || "Doğrulama başarısız.", "error");
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: any) => fetchApi("/auth/change-password", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      showToast("Şifreniz başarıyla değiştirildi.", "success");
      (document.getElementById("password-form") as HTMLFormElement)?.reset();
    },
    onError: (err: any) => {
      showToast(err.message || "Şifre değiştirilemedi.", "error");
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    updateProfileMutation.mutate(data);
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    if (data.newPassword !== data.confirmPassword) {
      return showToast("Yeni şifreler eşleşmiyor.", "error");
    }

    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    });
  };

  if (!user) return null;

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5", accentColor)}>
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-serif text-white italic">Hesap Ayarları</h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Kişisel Bilgilerinizi Yönetin</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Profile Form */}
        <div className="space-y-8">
            <h3 className="text-white font-bold flex items-center gap-3">
                <User className={cn("w-5 h-5", accentColor)} />
                Profil Bilgileri
            </h3>

            {showVerify ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-brand-terracotta/10 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-brand-terracotta" />
                  </div>
                  <h4 className="text-white font-bold">E-postayı Doğrulayın</h4>
                  <p className="text-white/40 text-xs leading-relaxed">
                    {pendingEmail} adresine bir doğrulama kodu gönderdik. Lütfen aşağıdaki kutuya girin.
                  </p>
                </div>

                <div className="space-y-4">
                  <input 
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="6 Haneli Kod" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-center text-2xl font-black tracking-[0.5em] text-white focus:outline-none focus:border-brand-terracotta/50 transition-all" 
                  />
                  
                  <button 
                    onClick={() => verifyEmailMutation.mutate({ email: pendingEmail, code: verificationCode })}
                    disabled={verifyEmailMutation.isPending || verificationCode.length < 6}
                    className={cn("w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50", accentBtn)}
                  >
                    {verifyEmailMutation.isPending ? "Doğrulanıyor..." : "Kodu Onayla"}
                  </button>

                  <button 
                    onClick={() => setShowVerify(false)}
                    className="w-full text-[10px] font-black text-white/20 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Vazgeç ve Bilgileri Düzenle
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                      <div>
                          <label className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-4 mb-2 block">Tam Adınız</label>
                          <div className="relative">
                              <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                              <input 
                                  name="name" 
                                  defaultValue={user.name} 
                                  required 
                                  className="w-full bg-white/5 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-white/10 transition-colors" 
                              />
                          </div>
                      </div>

                      <div>
                          <label className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-4 mb-2 block">E-Posta Adresi</label>
                          <div className="relative">
                              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                              <input 
                                  name="email" 
                                  defaultValue={user.email} 
                                  required 
                                  type="email"
                                  className="w-full bg-white/5 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-white/10 transition-colors" 
                              />
                          </div>
                          {user.isVerified && (
                            <div className="flex items-center gap-1.5 mt-2 ml-4">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span className="text-[9px] font-bold text-emerald-500/80 uppercase tracking-widest">Doğrulanmış Hesap</span>
                            </div>
                          )}
                      </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={updateProfileMutation.isPending}
                    className={cn("flex items-center gap-3 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50", accentBtn)}
                  >
                    <Save className="w-4 h-4" />
                    {updateProfileMutation.isPending ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                  </button>
              </form>
            )}
        </div>

        {/* Account Security */}
        <div className="space-y-8">
            <h3 className="text-white font-bold flex items-center gap-3">
                <Shield className={cn("w-5 h-5", accentColor)} />
                Hesap Güvenliği
            </h3>

            <div className="bg-white/[0.03] border border-white/5 rounded-[32px] p-8 space-y-8">
                <form id="password-form" onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-4 mb-2 block">Mevcut Şifre</label>
                            <div className="relative">
                                <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input 
                                    name="currentPassword" 
                                    type="password"
                                    required 
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-white/10 transition-colors placeholder:text-white/10" 
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-4 mb-2 block">Yeni Şifre</label>
                            <div className="relative">
                                <RefreshCcw className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input 
                                    name="newPassword" 
                                    type="password"
                                    required 
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-white/10 transition-colors placeholder:text-white/10" 
                                    placeholder="En az 6 karakter"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-4 mb-2 block">Yeni Şifre (Tekrar)</label>
                            <div className="relative">
                                <RefreshCcw className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input 
                                    name="confirmPassword" 
                                    type="password"
                                    required 
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-white/10 transition-colors placeholder:text-white/10" 
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={changePasswordMutation.isPending}
                      className={cn("w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-white/10 border border-white/5 text-white/60 hover:text-white disabled:opacity-50")}
                    >
                      <Key className="w-3.5 h-3.5" />
                      {changePasswordMutation.isPending ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                    </button>
                </form>
            </div>

            <div className="bg-white/[0.01] border border-dashed border-white/5 rounded-[32px] p-8">
                <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-4 text-center">Hesap Durumu</p>
                <div className="flex justify-center gap-2">
                    <span className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/5 text-white/40")}>
                        {user.role}
                    </span>
                    <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-500/10 text-green-500">
                        {user.isVerified ? "Doğrulanmış" : "Doğrulanmamış"}
                    </span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
