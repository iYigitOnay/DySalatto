"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Trash2, Plus, Layers, Settings2, RefreshCw, 
  CheckCircle2, Circle, Search, Check, GripVertical, 
  Tag, LayoutGrid, Package, ChefHat, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/components/ui/ToastProvider";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Ingredient = { 
  id: string; 
  name: string; 
  price: string | number; 
  isStock: boolean; 
  categoryId?: string;
  category?: { name: string };
};

type IngredientCategory = {
  id: string;
  name: string;
  orderIndex: number;
  ingredients: Ingredient[];
};

type DIYStep = {
  id: string;
  name: string;
  orderIndex: number;
  isRequired: boolean;
  minSelect: number;
  maxSelect: number;
  ingredients: Ingredient[];
};

// --- Sortable Item for Ingredient Categories ---
function SortableCategoryItem({ 
  cat, 
  onDelete, 
  accentColor 
}: { 
  cat: IngredientCategory; 
  onDelete: (id: string) => void;
  accentColor: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "flex items-center justify-between p-6 bg-[#0d0d0d] border border-white/5 rounded-3xl mb-3 hover:border-white/10 transition-all group",
        isDragging && "opacity-50 scale-95 border-white/20 shadow-2xl"
      )}
    >
      <div className="flex items-center gap-6">
        <div className="cursor-grab active:cursor-grabbing text-white/10 group-hover:text-white/40 transition-colors" {...attributes} {...listeners}>
          <GripVertical className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Malzeme Kategorisi</p>
          <span className="font-serif italic text-white text-lg">{cat.name}</span>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="text-right hidden sm:block">
           <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">İçerik</p>
           <span className="text-xs font-bold text-white/60">{cat.ingredients?.length || 0} Malzeme</span>
        </div>
        <button 
          onClick={() => onDelete(cat.id)} 
          className="p-3 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function AdminIngredientsPage() {
  const params = useParams();
  const brand = params.brand as string;
  const dbBrand = brand === "dycake" ? "DYCAKE" : "DYSALATTO";
  const isCake = brand === "dycake";
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  
  const accentColor = isCake ? "text-brand-sand" : "text-brand-terracotta";
  const accentBg = isCake ? "bg-brand-sand" : "bg-brand-terracotta";
  const accentHoverBg = isCake ? "hover:bg-brand-sand/10" : "hover:bg-brand-terracotta/10";

  const [activeTab, setActiveTab] = useState<"ingredients" | "categories" | "steps">("ingredients");
  const [ingSearchQuery, setIngSearchTerm] = useState("");
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>("Tümü");

  // Form states
  const [ingName, setIngName] = useState("");
  const [ingPrice, setIngPrice] = useState("0");
  const [ingStock, setIngStock] = useState(true);
  const [ingCategoryId, setIngCategoryId] = useState("");
  const [newCatName, setNewCatName] = useState("");

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  // --- Queries ---
  const { data: ingredientsRes, isLoading: ingLoading } = useQuery({
    queryKey: ['admin-ingredients', dbBrand],
    queryFn: () => fetchApi(`/ingredients?brand=${dbBrand}`)
  });

  const { data: ingCatsRes, isLoading: catsLoading } = useQuery({
    queryKey: ['admin-ing-categories', dbBrand],
    queryFn: () => fetchApi(`/ingredients/categories?brand=${dbBrand}`)
  });

  const { data: stepsRes, isLoading: stepsLoading } = useQuery({
    queryKey: ['admin-diy-steps', dbBrand],
    queryFn: () => fetchApi(`/ingredients/steps?brand=${dbBrand}`)
  });

  const ingredients: Ingredient[] = ingredientsRes?.data || [];
  const ingCategories: IngredientCategory[] = ingCatsRes?.data || [];
  const steps: DIYStep[] = stepsRes?.data || [];

  // --- Mutations ---
  const createIngMutation = useMutation({
    mutationFn: (data: any) => fetchApi("/ingredients", {
      method: "POST",
      body: JSON.stringify({ brand: dbBrand, ...data })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ingredients'] });
      setIngName(""); setIngPrice("0"); setIngStock(true); setIngCategoryId("");
      showToast("Malzeme başarıyla eklendi.", "success");
    }
  });

  const updateIngMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => fetchApi(`/ingredients/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-ingredients'] })
  });

  const deleteIngMutation = useMutation({
    mutationFn: (id: string) => fetchApi(`/ingredients/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ingredients'] });
      showToast("Malzeme silindi.", "info");
    }
  });

  const createCatMutation = useMutation({
    mutationFn: (name: string) => fetchApi("/ingredients/categories", {
      method: "POST",
      body: JSON.stringify({ brand: dbBrand, name })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ing-categories'] });
      setNewCatName("");
      showToast("Malzeme kategorisi oluşturuldu.", "success");
    }
  });

  const reorderCatsMutation = useMutation({
    mutationFn: (orders: any[]) => fetchApi("/ingredients/categories/reorder", {
      method: "PUT",
      body: JSON.stringify({ orders })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ing-categories'] });
      showToast("Sıralama güncellendi.", "success");
    }
  });

  const deleteCatMutation = useMutation({
    mutationFn: (id: string) => fetchApi(`/ingredients/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ing-categories'] });
      showToast("Kategori silindi.", "info");
    }
  });

  // --- Handlers ---
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = ingCategories.findIndex(c => c.id === active.id);
      const newIndex = ingCategories.findIndex(c => c.id === over?.id);
      const newArray = arrayMove(ingCategories, oldIndex, newIndex);
      const orders = newArray.map((c, index) => ({ id: c.id, orderIndex: index }));
      reorderCatsMutation.mutate(orders);
    }
  };

  const filteredIngredients = useMemo(() => {
    return ingredients.filter(ing => {
      const matchesSearch = ing.name.toLowerCase().includes(ingSearchQuery.toLowerCase());
      const matchesCat = selectedCatFilter === "Tümü" || ing.category?.name === selectedCatFilter;
      return matchesSearch && matchesCat;
    });
  }, [ingredients, ingSearchQuery, selectedCatFilter]);

  return (
    <div className="space-y-12 pb-40">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
           <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl", accentBg)}>
              <ChefHat className={cn("w-8 h-8", isCake ? "text-[#111]" : "text-white")} />
           </div>
           <div>
              <h1 className="text-4xl md:text-5xl font-serif text-white italic leading-tight">Hammadde <span className={accentColor}>Havuzu</span></h1>
              <p className="text-white/30 text-xs uppercase tracking-[0.3em] font-black mt-1">Malzeme ve DIY Yönetimi</p>
           </div>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex gap-8 border-b border-white/5 relative">
        {[
          { id: 'ingredients', label: 'Malzemeler', icon: Package },
          { id: 'categories', label: 'Kategoriler', icon: LayoutGrid },
          { id: 'steps', label: 'DIY Adımları', icon: Settings2 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "pb-4 text-sm font-bold tracking-widest uppercase transition-all relative",
              activeTab === tab.id ? "text-white" : "text-white/30 hover:text-white/60"
            )}
          >
            <div className="flex items-center gap-2"><tab.icon className="w-4 h-4" /> {tab.label}</div>
            {activeTab === tab.id && (
              <div className={cn("absolute bottom-0 left-0 right-0 h-0.5", accentBg)} />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "ingredients" && (
          <motion.div key="ing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
             {/* Left: Form */}
             <div className="lg:col-span-4">
                <div className="bg-[#0d0d0d] border border-white/5 rounded-[40px] p-10 sticky top-32 shadow-2xl overflow-hidden group">
                   <div className={cn("absolute -top-24 -right-24 w-48 h-48 blur-[100px] opacity-[0.05] rounded-full pointer-events-none transition-all duration-1000 group-hover:opacity-[0.1]", accentBg)} />
                   <h3 className="text-2xl font-serif text-white italic mb-8">Yeni Malzeme</h3>
                   <form onSubmit={(e) => { 
                      e.preventDefault(); 
                      createIngMutation.mutate({ 
                        name: ingName, 
                        price: parseFloat(ingPrice), 
                        isStock: ingStock, 
                        categoryId: ingCategoryId || undefined 
                      }); 
                   }} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-white/40 uppercase pl-2">Malzeme İsmi</label>
                        <input type="text" value={ingName} onChange={e => setIngName(e.target.value)} placeholder="Örn: Kinoa, Avokado" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-white/10 transition-all" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black tracking-widest text-white/40 uppercase pl-2">Ek Fiyat (₺)</label>
                          <input type="number" step="0.01" value={ingPrice} onChange={e => setIngPrice(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none" required />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black tracking-widest text-white/40 uppercase pl-2">Kategori</label>
                          <select value={ingCategoryId} onChange={e => setIngCategoryId(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none appearance-none">
                            <option value="">Kategorisiz</option>
                            {ingCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                      </div>
                      <div onClick={() => setIngStock(!ingStock)} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white/5 rounded-xl transition-all">
                        <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-all", ingStock ? "border-green-500 bg-green-500/20" : "border-white/10")}>
                           {ingStock && <Check className="w-3 h-3 text-green-500" />}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Stokta Mevcut</span>
                      </div>
                      <button type="submit" disabled={createIngMutation.isPending} className={cn("w-full py-5 rounded-[24px] font-black text-xs tracking-[0.2em] uppercase transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl mt-4", accentBg, isCake ? "text-[#111]" : "text-white", createIngMutation.isPending && "opacity-50")}>MALZEMEYİ EKLE</button>
                   </form>
                </div>
             </div>

             {/* Right: List */}
             <div className="lg:col-span-8 space-y-8">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                   <div className="flex-1 relative w-full">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input type="text" placeholder="Malzeme havuzunda ara..." value={ingSearchQuery} onChange={e => setIngSearchTerm(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none" />
                   </div>
                   <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide max-w-full pb-2 md:pb-0">
                      {['Tümü', ...ingCategories.map(c => c.name)].map(cat => (
                        <button key={cat} onClick={() => setSelectedCatFilter(cat)} className={cn("px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap", selectedCatFilter === cat ? "bg-white text-black" : "bg-white/5 text-white/30 hover:text-white/60")}>{cat}</button>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {ingLoading ? <div className="col-span-2 py-20 text-center animate-pulse"><RefreshCw className="w-8 h-8 text-white/10 animate-spin mx-auto" /></div> : filteredIngredients.length === 0 ? <div className="col-span-2 p-20 text-center border-2 border-dashed border-white/5 rounded-[40px] text-white/20 font-serif italic">Malzeme bulunamadı.</div> : (
                     filteredIngredients.map(ing => (
                       <div key={ing.id} className="bg-[#0d0d0d] border border-white/5 rounded-3xl p-6 flex items-center justify-between group hover:border-white/10 transition-all">
                          <div className="flex items-center gap-4">
                             <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center bg-white/5 text-white/20", !ing.isStock && "opacity-30")}>
                                <Tag className="w-5 h-5" />
                             </div>
                             <div>
                                <h4 className="text-white font-bold text-sm">{ing.name}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                   <span className="text-[9px] font-black uppercase tracking-widest text-brand-sand">₺{Number(ing.price).toFixed(2)}</span>
                                   <span className="text-[9px] font-black uppercase tracking-widest text-white/20">{ing.category?.name || "Kategorisiz"}</span>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <button onClick={() => updateIngMutation.mutate({ id: ing.id, data: { isStock: !ing.isStock } })} className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase border transition-all", ing.isStock ? "border-green-500/20 text-green-500 bg-green-500/5" : "border-red-500/20 text-red-500 bg-red-500/5 opacity-50")}>{ing.isStock ? "STOKTA" : "TÜKENDİ"}</button>
                             <button onClick={() => confirm("Silinsin mi?") && deleteIngMutation.mutate(ing.id)} className="p-2 text-white/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                          </div>
                       </div>
                     ))
                   )}
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === "categories" && (
          <motion.div key="cats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
             <div className="lg:col-span-4">
                <div className="bg-[#0d0d0d] border border-white/5 rounded-[40px] p-10 shadow-2xl">
                   <h3 className="text-2xl font-serif text-white italic mb-8">Malzeme Kategorisi</h3>
                   <form onSubmit={(e) => { e.preventDefault(); createCatMutation.mutate(newCatName); }} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-white/40 uppercase pl-2">Kategori Adı</label>
                        <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Örn: Proteinler, Sebzeler" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none" required />
                      </div>
                      <button type="submit" disabled={createCatMutation.isPending} className={cn("w-full py-5 rounded-[24px] font-black text-xs tracking-[0.2em] uppercase transition-all shadow-2xl", accentBg, isCake ? "text-[#111]" : "text-white")}>KATEGORİ OLUŞTUR</button>
                   </form>
                </div>
             </div>
             <div className="lg:col-span-8">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={ingCategories.map(c => c.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                       {ingCategories.length === 0 ? <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[40px] text-white/20">Kategori bulunmuyor.</div> : (
                         ingCategories.map(cat => (
                           <SortableCategoryItem key={cat.id} cat={cat} accentColor={accentColor} onDelete={(id) => confirm("Emin misiniz?") && deleteCatMutation.mutate(id)} />
                         ))
                       )}
                    </div>
                  </SortableContext>
                </DndContext>
             </div>
          </motion.div>
        )}

        {activeTab === "steps" && (
           <motion.div key="steps" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
             <p className="p-20 text-center text-white/20 font-serif italic">DIY Adımları yönetimi yakında buraya taşınacaktır. Şimdilik Malzemeler üzerinden ilerleyebilirsiniz.</p>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
