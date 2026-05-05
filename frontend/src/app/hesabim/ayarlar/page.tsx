"use client";

import React from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import { motion } from "framer-motion";
import { Settings, User, Mail, Shield, Save, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";

export default function SettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const pathname = usePathname();
  const isCakePage = pathname?.startsWith("/cake") || pathname?.includes("brand=cake");

  const accentColor = isCakePage ? "text-brand-sand" : "text-brand-terracotta";
  const accentBtn = isCakePage ? "bg-brand-sand text-brand-charcoal" : "bg-brand-terracotta text-white";

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => fetchApi("/auth/update-profile", { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => {
      showToast("Profil bilgileriniz güncellendi.", "success");
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    updateProfileMutation.mutate(data);
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
        </div>

        {/* Account Status / Info */}
        <div className="space-y-8">
            <h3 className="text-white font-bold flex items-center gap-3">
                <Shield className={cn("w-5 h-5", accentColor)} />
                Hesap Güvenliği
            </h3>

            <div className="bg-white/[0.03] border border-white/5 rounded-[32px] p-8 space-y-6">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm">Hesabınız Güvende</p>
                        <p className="text-white/40 text-xs mt-1 leading-relaxed">Şifreniz ve kişisel verileriniz artisan standartlarında korunmaktadır.</p>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                    <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors group">
                        <Key className="w-4 h-4 transition-transform group-hover:rotate-12" />
                        Şifre Değiştirme (Çok Yakında)
                    </button>
                </div>
            </div>

            <div className="bg-white/[0.01] border border-dashed border-white/5 rounded-[32px] p-8">
                <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-4 text-center">Hesap Durumu</p>
                <div className="flex justify-center gap-2">
                    <span className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/5 text-white/40")}>
                        {user.role}
                    </span>
                    <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-500/10 text-green-500">
                        Aktif
                    </span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
