"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Trash2, Plus, Layers, Settings2, RefreshCw, CheckCircle2, Circle } from "lucide-react";

type Ingredient = { id: string; name: string; price: string; isStock: boolean };
type DIYStep = {
  id: string;
  name: string;
  orderIndex: number;
  isRequired: boolean;
  minSelect: number;
  maxSelect: number;
  ingredients: Ingredient[];
};

export default function AdminIngredientsPage() {
  const params = useParams();
  const brand = params.brand as string;
  const dbBrand = brand === "dycake" ? "DYCAKE" : "DYSALATTO";
  const isCake = brand === "dycake";
  
  const primaryColor = isCake ? "text-brand-sand" : "text-brand-terracotta";
  const primaryBg = isCake ? "bg-brand-sand" : "bg-brand-terracotta";
  const hoverBg = isCake ? "hover:bg-brand-sand/10" : "hover:bg-brand-terracotta/10";

  const [activeTab, setActiveTab] = useState<"ingredients" | "steps">("ingredients");
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Data states
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<DIYStep[]>([]);

  // Form states - Ingredient
  const [ingName, setIngName] = useState("");
  const [ingPrice, setIngPrice] = useState("0");
  const [ingStock, setIngStock] = useState(true);

  // Form states - Step
  const [stepName, setStepName] = useState("");
  const [stepOrder, setStepOrder] = useState("0");
  const [stepIsRequired, setStepIsRequired] = useState(false);
  const [stepMin, setStepMin] = useState("0");
  const [stepMax, setStepMax] = useState("1");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger, brand]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ingRes, stepRes] = await Promise.all([
        fetch(`http://localhost:3001/api/ingredients?brand=${dbBrand}`),
        fetch(`http://localhost:3001/api/ingredients/steps?brand=${dbBrand}`)
      ]);
      const ingData = await ingRes.json();
      const stepData = await stepRes.json();
      
      if (ingData.success) setIngredients(ingData.data);
      if (stepData.success) setSteps(stepData.data);
    } catch (error) {
      console.error("Data fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  // --- INGREDIENT HANDLERS ---
  const createIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingName.trim()) return;
    try {
      await fetch("http://localhost:3001/api/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          brand: dbBrand, 
          name: ingName, 
          price: parseFloat(ingPrice), 
          isStock: ingStock 
        })
      });
      setIngName("");
      setIngPrice("0");
      setIngStock(true);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleIngredientStock = async (id: string, currentStock: boolean) => {
    try {
      await fetch(`http://localhost:3001/api/ingredients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isStock: !currentStock })
      });
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteIngredient = async (id: string) => {
    if (!confirm("Emin misiniz? Malzemeyi silmek onu kullanan reçeteleri etkileyebilir.")) return;
    try {
      await fetch(`http://localhost:3001/api/ingredients/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  // --- STEP HANDLERS ---
  const createStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepName.trim()) return;
    try {
      await fetch("http://localhost:3001/api/ingredients/steps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          brand: dbBrand, 
          name: stepName,
          orderIndex: parseInt(stepOrder),
          isRequired: stepIsRequired,
          minSelect: parseInt(stepMin),
          maxSelect: parseInt(stepMax),
          ingredientIds: selectedIngredients
        })
      });
      setStepName("");
      setStepOrder("0");
      setStepIsRequired(false);
      setStepMin("0");
      setStepMax("1");
      setSelectedIngredients([]);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteStep = async (id: string) => {
    if (!confirm("Emin misiniz?")) return;
    try {
      await fetch(`http://localhost:3001/api/ingredients/steps/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleIngredientSelection = (id: string) => {
    setSelectedIngredients(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-serif mb-2">Malzemeler & DIY</h1>
          <p className="text-white/40 text-sm max-w-xl leading-relaxed">
            {isCake ? "Pastalarınız" : "Kaseleriniz"} için hammadde havuzunu yönetin ve "Kendi Seçimini Yarat" (DIY) modülü için adımları (Örn: Taban Seç, Protein Ekle) yapılandırın.
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
          onClick={() => setActiveTab("ingredients")}
          className={cn(
            "pb-4 text-sm font-bold tracking-widest uppercase transition-all relative",
            activeTab === "ingredients" ? "text-white" : "text-white/30 hover:text-white/60"
          )}
        >
          <div className="flex items-center gap-2"><Layers className="w-4 h-4" /> Malzeme Havuzu</div>
          {activeTab === "ingredients" && (
            <div className={cn("absolute bottom-0 left-0 right-0 h-0.5", primaryBg)} />
          )}
        </button>
        <button
          onClick={() => setActiveTab("steps")}
          className={cn(
            "pb-4 text-sm font-bold tracking-widest uppercase transition-all relative",
            activeTab === "steps" ? "text-white" : "text-white/30 hover:text-white/60"
          )}
        >
          <div className="flex items-center gap-2"><Settings2 className="w-4 h-4" /> Oluşturma Adımları (DIY)</div>
          {activeTab === "steps" && (
            <div className={cn("absolute bottom-0 left-0 right-0 h-0.5", primaryBg)} />
          )}
        </button>
      </div>

      {/* Ingredients Pool Content */}
      {activeTab === "ingredients" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Add Ingredient Form */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] border border-white/5 rounded-[24px] p-8">
              <h3 className="text-lg font-serif mb-6">Yeni Malzeme Ekle</h3>
              <form onSubmit={createIngredient} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-white/40 uppercase mb-2">Malzeme Adı</label>
                  <input
                    type="text"
                    value={ingName}
                    onChange={(e) => setIngName(e.target.value)}
                    placeholder="Örn: Kinoa, Taze Çilek"
                    className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors focus:bg-white/5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-white/40 uppercase mb-2">Ek Fiyat (₺)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={ingPrice}
                    onChange={(e) => setIngPrice(e.target.value)}
                    className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors focus:bg-white/5"
                    required
                  />
                  <p className="text-[9px] text-white/30 mt-1 uppercase tracking-widest">Eğer ekstra ücreti yoksa 0 bırakın.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => setIngStock(!ingStock)}
                    className="flex items-center justify-center w-5 h-5 rounded border border-white/20"
                  >
                     {ingStock && <div className={cn("w-3 h-3 rounded-[2px]", primaryBg)} />}
                  </button>
                  <span className="text-xs font-bold text-white/70">Şu an stokta var</span>
                </div>
                <button
                  type="submit"
                  className={cn("w-full py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-colors mt-4", primaryBg, isCake ? "text-[#111]" : "text-white")}
                >
                  Havuza Ekle
                </button>
              </form>
            </div>
          </div>

          {/* Ingredients List */}
          <div className="lg:col-span-2">
             <div className="bg-transparent border border-white/5 rounded-[24px] overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-6 border-b border-white/5 bg-white/5 text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">
                   <div className="col-span-5">Malzeme Adı</div>
                   <div className="col-span-3 text-right">Fiyat</div>
                   <div className="col-span-2 text-center">Stok Durumu</div>
                   <div className="col-span-2 text-right">İşlem</div>
                </div>
                {ingredients.length === 0 ? (
                  <div className="p-12 text-center text-white/30 text-sm">Havuzda henüz malzeme bulunmuyor.</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {ingredients.map(ing => (
                      <div key={ing.id} className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-white/[0.02] transition-colors">
                        <div className="col-span-5 font-bold text-sm text-white">{ing.name}</div>
                        <div className="col-span-3 text-right text-xs font-mono text-white/60">₺{parseFloat(ing.price).toFixed(2)}</div>
                        <div className="col-span-2 flex justify-center">
                           <button 
                             onClick={() => toggleIngredientStock(ing.id, ing.isStock)}
                             className={cn("px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border transition-colors", 
                               ing.isStock ? "border-green-500/30 text-green-400 bg-green-500/10" : "border-red-500/30 text-red-400 bg-red-500/10"
                             )}
                           >
                              {ing.isStock ? "Var" : "Yok"}
                           </button>
                        </div>
                        <div className="col-span-2 text-right">
                          <button onClick={() => deleteIngredient(ing.id)} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
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

      {/* DIY Steps Content */}
      {activeTab === "steps" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Create Step Form */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#111] border border-white/5 rounded-[24px] p-8">
              <h3 className="text-lg font-serif mb-6">Yeni Adım Oluştur</h3>
              <form onSubmit={createStep} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-white/40 uppercase mb-2">Adım Başlığı</label>
                  <input
                    type="text"
                    value={stepName}
                    onChange={(e) => setStepName(e.target.value)}
                    placeholder="Örn: 1. Taban Seç, Kas İster misin?"
                    className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors focus:bg-white/5"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-[10px] font-black tracking-widest text-white/40 uppercase mb-2">Sıra (İndex)</label>
                     <input
                       type="number"
                       min="0"
                       value={stepOrder}
                       onChange={(e) => setStepOrder(e.target.value)}
                       className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
                     />
                   </div>
                   <div className="flex flex-col justify-end pb-3">
                     <div className="flex items-center gap-2">
                       <button 
                         type="button"
                         onClick={() => setStepIsRequired(!stepIsRequired)}
                         className="flex items-center justify-center w-5 h-5 rounded border border-white/20"
                       >
                          {stepIsRequired && <div className={cn("w-3 h-3 rounded-[2px]", primaryBg)} />}
                       </button>
                       <span className="text-[10px] font-black uppercase text-white/70 tracking-widest">Zorunlu</span>
                     </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-[10px] font-black tracking-widest text-white/40 uppercase mb-2">Min Seçim</label>
                     <input
                       type="number"
                       min="0"
                       value={stepMin}
                       onChange={(e) => setStepMin(e.target.value)}
                       className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
                     />
                   </div>
                   <div>
                     <label className="block text-[10px] font-black tracking-widest text-white/40 uppercase mb-2">Max Seçim</label>
                     <input
                       type="number"
                       min="1"
                       value={stepMax}
                       onChange={(e) => setStepMax(e.target.value)}
                       className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
                     />
                   </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                   <label className="block text-[10px] font-black tracking-widest text-white/40 uppercase mb-4">Adıma Bağlanacak Malzemeler</label>
                   {ingredients.length === 0 ? (
                      <p className="text-[10px] text-red-400">Lütfen önce Malzeme Havuzuna veri ekleyin.</p>
                   ) : (
                      <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                         {ingredients.map(ing => (
                           <div 
                              key={ing.id} 
                              onClick={() => toggleIngredientSelection(ing.id)}
                              className="flex items-center gap-3 cursor-pointer group"
                           >
                              {selectedIngredients.includes(ing.id) ? (
                                 <CheckCircle2 className={cn("w-4 h-4", primaryColor)} />
                              ) : (
                                 <Circle className="w-4 h-4 text-white/10 group-hover:text-white/30" />
                              )}
                              <span className={cn(
                                "text-xs font-bold transition-colors",
                                selectedIngredients.includes(ing.id) ? "text-white" : "text-white/40 group-hover:text-white/70"
                              )}>{ing.name}</span>
                              {parseFloat(ing.price) > 0 && (
                                <span className="text-[10px] text-white/20 ml-auto">+₺{ing.price}</span>
                              )}
                           </div>
                         ))}
                      </div>
                   )}
                </div>

                <button
                  type="submit"
                  className={cn("w-full py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-colors mt-4", primaryBg, isCake ? "text-[#111]" : "text-white")}
                >
                  Adımı Kaydet
                </button>
              </form>
            </div>
          </div>

          {/* Steps List */}
          <div className="lg:col-span-8">
             <div className="space-y-6">
                {steps.length === 0 ? (
                  <div className="p-12 text-center border border-dashed border-white/10 rounded-[24px] text-white/30 text-sm">
                     Henüz oluşturma adımı eklenmemiş. Müşterilerin kendi kase/pastasını oluşturabilmesi için adımlar tanımlayın.
                  </div>
                ) : (
                  steps.map(step => (
                    <div key={step.id} className="bg-transparent border border-white/5 rounded-[24px] overflow-hidden flex flex-col">
                       <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
                          <div className="flex items-center gap-4">
                             <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-black text-xs", primaryBg, isCake ? "text-[#111]" : "text-white")}>
                               {step.orderIndex}
                             </div>
                             <div>
                               <h4 className="font-bold text-white text-sm">{step.name}</h4>
                               <div className="flex items-center gap-3 mt-1 text-[10px] font-black tracking-widest text-white/30 uppercase">
                                  {step.isRequired && <span className={primaryColor}>Zorunlu</span>}
                                  <span>MİN: {step.minSelect}</span>
                                  <span>MAX: {step.maxSelect}</span>
                               </div>
                             </div>
                          </div>
                          
                          <button onClick={() => deleteStep(step.id)} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Adımı Sil">
                            <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                       
                       <div className="p-6 flex-1 bg-white/[0.01]">
                          <p className="text-[10px] font-black tracking-widest text-white/20 uppercase mb-3">Bağlı Malzemeler</p>
                          {step.ingredients.length === 0 ? (
                            <p className="text-xs text-red-400 italic">Bu adıma malzeme bağlanmamış.</p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {step.ingredients.map(ing => (
                                <div key={ing.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-xs text-white/70 bg-white/5">
                                   <span className={cn("w-1.5 h-1.5 rounded-full", ing.isStock ? "bg-green-500" : "bg-red-500")} title={ing.isStock ? "Stokta" : "Tükendi"} />
                                   <span className="font-bold">{ing.name}</span>
                                   {parseFloat(ing.price) > 0 && <span className="opacity-50">₺{parseFloat(ing.price).toFixed(2)}</span>}
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
