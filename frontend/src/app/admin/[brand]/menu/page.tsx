"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Trash2, Tag, Layers, RefreshCw } from "lucide-react";

type Category = { id: string; name: string; slug: string };
type Trait = { id: string; name: string };
type TraitGroup = { id: string; name: string; traits: Trait[] };

export default function AdminMenuPage() {
  const params = useParams();
  const brand = params.brand as string;
  const dbBrand = brand === "dycake" ? "DYCAKE" : "DYSALATTO";
  const isCake = brand === "dycake";
  
  const primaryColor = isCake ? "text-brand-sand" : "text-brand-terracotta";
  const primaryBg = isCake ? "bg-brand-sand" : "bg-brand-terracotta";
  const hoverBg = isCake ? "hover:bg-brand-sand/10" : "hover:bg-brand-terracotta/10";

  const [activeTab, setActiveTab] = useState<"categories" | "traits">("categories");
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [traitGroups, setTraitGroups] = useState<TraitGroup[]>([]);

  // Form states
  const [newCatName, setNewCatName] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newTraitName, setNewTraitName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger, brand]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, traitRes] = await Promise.all([
        fetch(`http://localhost:3001/api/categories?brand=${dbBrand}`),
        fetch(`http://localhost:3001/api/traits/groups?brand=${dbBrand}`)
      ]);
      const catData = await catRes.json();
      const traitData = await traitRes.json();
      
      if (catData.success) setCategories(catData.data);
      if (traitData.success) setTraitGroups(traitData.data);
    } catch (error) {
      console.error("Data fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await fetch("http://localhost:3001/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ brand: dbBrand, name: newCatName })
      });
      setNewCatName("");
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Emin misiniz?")) return;
    try {
      await fetch(`http://localhost:3001/api/categories/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const createTraitGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    try {
      await fetch("http://localhost:3001/api/traits/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ brand: dbBrand, name: newGroupName })
      });
      setNewGroupName("");
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTraitGroup = async (id: string) => {
    if (!confirm("Bu grup ve içindeki tüm etiketler silinecek. Emin misiniz?")) return;
    try {
      await fetch(`http://localhost:3001/api/traits/groups/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const createTrait = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTraitName.trim() || !selectedGroupId) return;
    try {
      await fetch("http://localhost:3001/api/traits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ traitGroupId: selectedGroupId, name: newTraitName })
      });
      setNewTraitName("");
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTrait = async (id: string) => {
    try {
      await fetch(`http://localhost:3001/api/traits/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-serif mb-2">Menü & Kategori Yönetimi</h1>
          <p className="text-white/40 text-sm max-w-xl leading-relaxed">
            {isCake ? "Pastalarınız" : "Kaseleriniz"} için ana kategorileri belirleyin ve müşterilerin filtreleme yapabilmesi için özellikleri (Örn: Vegan, Glutensiz) düzenleyin.
          </p>
        </div>
        <button 
          onClick={fetchData}
          className={cn("flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 text-xs font-bold uppercase tracking-widest transition-all", hoverBg, primaryColor)}
        >
          <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} /> Yenile
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-white/5 relative">
        <button
          onClick={() => setActiveTab("categories")}
          className={cn(
            "pb-4 text-sm font-bold tracking-widest uppercase transition-all relative",
            activeTab === "categories" ? "text-white" : "text-white/30 hover:text-white/60"
          )}
        >
          <div className="flex items-center gap-2"><Layers className="w-4 h-4" /> Ana Kategoriler</div>
          {activeTab === "categories" && (
            <div className={cn("absolute bottom-0 left-0 right-0 h-0.5", primaryBg)} />
          )}
        </button>
        <button
          onClick={() => setActiveTab("traits")}
          className={cn(
            "pb-4 text-sm font-bold tracking-widest uppercase transition-all relative",
            activeTab === "traits" ? "text-white" : "text-white/30 hover:text-white/60"
          )}
        >
          <div className="flex items-center gap-2"><Tag className="w-4 h-4" /> Özellikler & Filtreler</div>
          {activeTab === "traits" && (
            <div className={cn("absolute bottom-0 left-0 right-0 h-0.5", primaryBg)} />
          )}
        </button>
      </div>

      {/* Categories Content */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <div className="bg-[#111] border border-white/5 rounded-[24px] p-8">
              <h3 className="text-lg font-serif mb-6">Yeni Kategori Ekle</h3>
              <form onSubmit={createCategory} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-white/40 uppercase mb-2">Kategori Adı</label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Örn: Taze Kaseler"
                    className={cn("w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors focus:bg-white/5")}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={cn("w-full py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-colors", primaryBg, isCake ? "text-[#111]" : "text-white")}
                >
                  Oluştur
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
             <div className="bg-transparent border border-white/5 rounded-[24px] overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-6 border-b border-white/5 bg-white/5 text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">
                   <div className="col-span-4">Kategori Adı</div>
                   <div className="col-span-6">Sistem Adı (Slug)</div>
                   <div className="col-span-2 text-right">İşlem</div>
                </div>
                {categories.length === 0 ? (
                  <div className="p-12 text-center text-white/30 text-sm">Henüz kategori bulunmuyor.</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {categories.map(cat => (
                      <div key={cat.id} className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-white/[0.02] transition-colors">
                        <div className="col-span-4 font-bold text-sm text-white">{cat.name}</div>
                        <div className="col-span-6 text-xs text-white/40 bg-white/5 px-3 py-1 rounded-md w-fit">{cat.slug}</div>
                        <div className="col-span-2 text-right">
                          <button onClick={() => deleteCategory(cat.id)} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* Traits Content */}
      {activeTab === "traits" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Add Forms */}
          <div className="lg:col-span-4 space-y-6">
            {/* Create Group Form */}
            <div className="bg-[#111] border border-white/5 rounded-[24px] p-8">
              <h3 className="text-lg font-serif mb-6">Yeni Özellik Grubu Ekle</h3>
              <form onSubmit={createTraitGroup} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-white/40 uppercase mb-2">Grup Adı</label>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Örn: Beslenme Tercihi"
                    className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors focus:bg-white/5"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={cn("w-full py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-colors", primaryBg, isCake ? "text-[#111]" : "text-white")}
                >
                  Grubu Oluştur
                </button>
              </form>
            </div>

            {/* Create Trait Form */}
            {traitGroups.length > 0 && (
              <div className="bg-[#111] border border-white/5 rounded-[24px] p-8">
                <h3 className="text-lg font-serif mb-6">Alt Etiket (Filtre) Ekle</h3>
                <form onSubmit={createTrait} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black tracking-widest text-white/40 uppercase mb-2">Hangi Gruba Eklenecek?</label>
                    <select
                      value={selectedGroupId}
                      onChange={(e) => setSelectedGroupId(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 appearance-none"
                      required
                    >
                      <option value="" disabled>Grup Seçiniz...</option>
                      {traitGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black tracking-widest text-white/40 uppercase mb-2">Etiket Adı</label>
                    <input
                      type="text"
                      value={newTraitName}
                      onChange={(e) => setNewTraitName(e.target.value)}
                      placeholder="Örn: Vegan, Şekersiz"
                      className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-white/5"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 text-xs font-black tracking-widest uppercase transition-colors"
                  >
                    Etiketi Ekle
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right Column: Traits List */}
          <div className="lg:col-span-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {traitGroups.length === 0 ? (
                  <div className="col-span-2 p-12 text-center border border-dashed border-white/10 rounded-[24px] text-white/30 text-sm">
                     Henüz özellik grubu eklenmemiş. Lütfen önce sol taraftan bir grup oluşturun.
                  </div>
                ) : (
                  traitGroups.map(group => (
                    <div key={group.id} className="bg-transparent border border-white/5 rounded-[24px] overflow-hidden flex flex-col">
                       <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
                          <h4 className="font-bold text-white text-sm">{group.name}</h4>
                          <button onClick={() => deleteTraitGroup(group.id)} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Grubu Sil">
                            <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                       <div className="p-6 flex-1 bg-white/[0.01]">
                          {group.traits.length === 0 ? (
                            <p className="text-xs text-white/30 italic">Bu grupta henüz etiket yok.</p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {group.traits.map(trait => (
                                <div key={trait.id} className={cn("group flex items-center gap-2 pl-3 pr-1 py-1 rounded-full border border-white/10 text-xs text-white/70", hoverBg)}>
                                   {trait.name}
                                   <button onClick={() => deleteTrait(trait.id)} className="p-1 rounded-full hover:bg-red-500/20 hover:text-red-400 text-white/20 opacity-0 group-hover:opacity-100 transition-all">
                                      <XIcon className="w-3 h-3" />
                                   </button>
                                </div>
                              ))}
                            </div>
                          )}
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
)
