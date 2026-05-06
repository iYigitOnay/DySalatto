"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Trash2, Tag, Layers, GripVertical, CheckSquare, Square, 
  Plus, Filter, Hash, Globe, MousePointer2, Settings2, X,
  ChevronRight, LayoutGrid
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

type Category = { id: string; name: string; slug: string; orderIndex: number; _count?: { products: number } };
type Trait = { id: string; name: string };
type TraitGroup = { id: string; name: string; traits: Trait[]; categories: Category[] };

// --- Sortable Category Item ---
function SortableCategoryItem({ 
  cat, 
  onDelete, 
  accentColor 
}: { 
  cat: Category; 
  onDelete: (id: string) => void;
  accentColor: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: cat.id });

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
        "grid grid-cols-12 gap-4 p-6 items-center bg-[#0d0d0d] border border-white/5 rounded-3xl mb-3 hover:border-white/10 transition-all group",
        isDragging && "opacity-50 scale-95 border-white/20 shadow-2xl"
      )}
    >
      <div className="col-span-1 cursor-grab active:cursor-grabbing text-white/10 group-hover:text-white/40 transition-colors" {...attributes} {...listeners}>
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="col-span-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Kategori Adı</p>
        <span className="font-serif italic text-white text-lg">{cat.name}</span>
      </div>
      <div className="col-span-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Sistem Slug</p>
        <span className="text-xs text-white/40 font-mono bg-white/5 px-3 py-1 rounded-lg border border-white/5">{cat.slug}</span>
      </div>
      <div className="col-span-2">
         <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Ürün Sayısı</p>
         <span className="text-xs font-bold text-white/60">{cat._count?.products || 0} Ürün</span>
      </div>
      <div className="col-span-2 text-right">
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

// --- Sortable Trait Group Item ---
function SortableTraitGroupItem({ 
  group, 
  onDelete, 
  onDeleteTrait 
}: { 
  group: TraitGroup; 
  onDelete: (id: string) => void;
  onDeleteTrait: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: group.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
  };

  return (
    <motion.div 
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "bg-[#0d0d0d] border border-white/5 rounded-[40px] overflow-hidden flex flex-col group hover:border-white/10 transition-all",
        isDragging && "opacity-50 scale-95 border-white/20 shadow-2xl z-[100]"
      )}
    >
      <div className="p-8 border-b border-white/5 flex justify-between items-start bg-white/[0.02]">
          <div className="flex gap-4">
             <div className="cursor-grab active:cursor-grabbing text-white/10 group-hover:text-white/40 transition-colors mt-1" {...attributes} {...listeners}>
                <GripVertical className="w-4 h-4" />
             </div>
             <div>
                <div className="flex items-center gap-2 mb-1">
                   {group.categories.length === 0 ? <Globe className="w-3 h-3 text-brand-sand" /> : <Layers className="w-3 h-3 text-brand-terracotta" />}
                   <span className="text-[9px] font-black uppercase tracking-widest text-white/20">
                      {group.categories.length === 0 ? "Global Ortak Grup" : "Kategoriye Özel"}
                   </span>
                </div>
                <h4 className="text-xl font-serif text-white italic">{group.name}</h4>
             </div>
          </div>
          <button onClick={() => onDelete(group.id)} className="p-3 rounded-2xl bg-white/5 text-white/10 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
             <Trash2 className="w-4 h-4" />
          </button>
      </div>
      <div className="p-8 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-8">
             {group.traits.map(trait => (
               <div key={trait.id} className="group/tag flex items-center gap-2 pl-4 pr-1 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white/40 transition-all hover:border-white/20 hover:text-white">
                  {trait.name}
                  <button onClick={() => onDeleteTrait(trait.id)} className="p-1 rounded-full hover:bg-red-500/20 text-white/10 hover:text-red-400 transition-all opacity-0 group-hover/tag:opacity-100">
                     <X className="w-3 h-3" />
                  </button>
               </div>
             ))}
             {group.traits.length === 0 && <p className="text-[10px] italic text-white/10">Henüz filtre eklenmedi.</p>}
          </div>
          <div className="mt-auto pt-6 border-t border-white/5">
             <div className="flex flex-wrap gap-1">
                {group.categories.map(c => (
                  <span key={c.id} className="text-[8px] font-black uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded text-white/30">{c.name}</span>
                ))}
             </div>
          </div>
      </div>
    </motion.div>
  );
}

export default function AdminMenuPage() {
  const params = useParams();
  const brand = params.brand as string;
  const dbBrand = brand === "dycake" ? "DYCAKE" : "DYSALATTO";
  const isCake = brand === "dycake";
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  
  const accentColor = isCake ? "text-brand-sand" : "text-brand-terracotta";
  const accentBg = isCake ? "bg-brand-sand" : "bg-brand-terracotta";
  const accentBorder = isCake ? "border-brand-sand/30" : "border-brand-terracotta/30";
  const accentHoverBg = isCake ? "hover:bg-brand-sand/10" : "hover:bg-brand-terracotta/10";

  const [activeTab, setActiveTab] = useState<"categories" | "traits">("categories");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("Tümü");
  
  // Form states
  const [newCatName, setNewCatName] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newTraitName, setNewTraitName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Sensors for DnD
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // --- Queries ---
  const { data: categoriesRes, isLoading: catsLoading } = useQuery({
    queryKey: ['admin-categories', dbBrand],
    queryFn: () => fetchApi(`/categories?brand=${dbBrand}`)
  });

  const { data: traitGroupsRes, isLoading: traitsLoading } = useQuery({
    queryKey: ['admin-trait-groups', dbBrand],
    queryFn: () => fetchApi(`/traits/groups?brand=${dbBrand}`)
  });

  const categories: Category[] = categoriesRes?.data || [];
  const traitGroups: TraitGroup[] = traitGroupsRes?.data || [];

  // --- Filtered Trait Groups ---
  const filteredTraitGroups = useMemo(() => {
    if (selectedCategoryFilter === "Tümü") return traitGroups;
    return traitGroups.filter(group => 
      group.categories.length === 0 || 
      group.categories.some(c => c.name === selectedCategoryFilter)
    );
  }, [traitGroups, selectedCategoryFilter]);

  // --- Mutations ---
  const createCatMutation = useMutation({
    mutationFn: (name: string) => fetchApi("/categories", {
      method: "POST",
      body: JSON.stringify({ brand: dbBrand, name })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setNewCatName("");
      showToast("Kategori başarıyla eklendi.", "success");
    }
  });

  const deleteCatMutation = useMutation({
    mutationFn: (id: string) => fetchApi(`/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      showToast("Kategori silindi.", "info");
    },
    onError: (error: any) => showToast(error.message, "error")
  });

  const reorderCatsMutation = useMutation({
    mutationFn: (orders: any[]) => fetchApi("/categories/reorder", {
      method: "PUT",
      body: JSON.stringify({ orders })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      showToast("Sıralama güncellendi.", "success");
    }
  });

  const createGroupMutation = useMutation({
    mutationFn: (data: any) => fetchApi("/traits/groups", {
      method: "POST",
      body: JSON.stringify({ brand: dbBrand, ...data })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-trait-groups'] });
      setNewGroupName("");
      setSelectedCategories([]);
      showToast("Özellik grubu oluşturuldu.", "success");
    }
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (id: string) => fetchApi(`/traits/groups/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-trait-groups'] });
      showToast("Grup silindi.", "info");
    }
  });

  const createTraitMutation = useMutation({
    mutationFn: (data: any) => fetchApi("/traits", {
      method: "POST",
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-trait-groups'] });
      setNewTraitName("");
      showToast("Etiket eklendi.", "success");
    }
  });

  const deleteTraitMutation = useMutation({
    mutationFn: (id: string) => fetchApi(`/traits/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-trait-groups'] });
      showToast("Etiket silindi.", "info");
    }
  });

  const reorderTraitGroupsMutation = useMutation({
    mutationFn: (orders: any[]) => fetchApi("/traits/groups/reorder", {
      method: "PUT",
      body: JSON.stringify({ orders })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-trait-groups'] });
      showToast("Sıralama güncellendi.", "success");
    }
  });

  // --- Handlers ---
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    if (activeTab === "categories") {
      const oldIndex = categories.findIndex((c: any) => c.id === active.id);
      const newIndex = categories.findIndex((c: any) => c.id === over.id);
      const newArray = arrayMove(categories, oldIndex, newIndex);
      
      const orders = newArray.map((c: any, index: number) => ({
        id: c.id,
        orderIndex: index
      }));
      
      reorderCatsMutation.mutate(orders);
    } else {
      const oldIndex = traitGroups.findIndex((g: any) => g.id === active.id);
      const newIndex = traitGroups.findIndex((g: any) => g.id === over.id);
      const newArray = arrayMove(traitGroups, oldIndex, newIndex);
      
      const orders = newArray.map((g: any, index: number) => ({
        id: g.id,
        orderIndex: index
      }));
      
      reorderTraitGroupsMutation.mutate(orders);
    }
  };

  const toggleCategorySelection = (catId: string) => {
    setSelectedCategories(prev => 
        prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  return (
    <div className="space-y-12 pb-40">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
           <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl", accentBg)}>
              <Settings2 className={cn("w-8 h-8", isCake ? "text-[#111]" : "text-white")} />
           </div>
           <div>
              <h1 className="text-4xl md:text-5xl font-serif text-white italic leading-tight">Menü <span className={accentColor}>Mimarisi</span></h1>
              <p className="text-white/30 text-xs uppercase tracking-[0.3em] font-black mt-1">Hiyerarşi ve Filtre Yönetimi</p>
           </div>
        </div>
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
            <div className={cn("absolute bottom-0 left-0 right-0 h-0.5", accentBg)} />
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
            <div className={cn("absolute bottom-0 left-0 right-0 h-0.5", accentBg)} />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "categories" ? (
          <motion.div 
            key="cats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
          >
            {/* Form Column */}
            <div className="lg:col-span-4">
               <div className="bg-[#0d0d0d] border border-white/5 rounded-[40px] p-10 sticky top-32 shadow-2xl relative overflow-hidden group">
                  <div className={cn("absolute -top-24 -right-24 w-48 h-48 blur-[100px] opacity-[0.05] rounded-full pointer-events-none transition-all duration-1000 group-hover:opacity-[0.1]", accentBg)} />
                  
                  <h3 className="text-2xl font-serif text-white italic mb-8">Yeni Kategori</h3>
                  <form onSubmit={(e) => { e.preventDefault(); createCatMutation.mutate(newCatName); }} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black tracking-widest text-white/40 uppercase pl-2">Kategori İsmi</label>
                      <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="Örn: Taze Kaseler"
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-white/10 transition-all focus:bg-white/[0.07]"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={createCatMutation.isPending}
                      className={cn(
                        "w-full py-5 rounded-[24px] font-black text-xs tracking-[0.2em] uppercase transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl",
                        accentBg, isCake ? "text-[#111]" : "text-white",
                        createCatMutation.isPending && "opacity-50"
                      )}
                    >
                      {createCatMutation.isPending ? "EKLENİYOR..." : "KATEGORİ EKLE"}
                    </button>
                  </form>
               </div>
            </div>

            {/* List Column */}
            <div className="lg:col-span-8">
               <div className="space-y-4">
                  <div className="flex items-center justify-between px-6 mb-6">
                     <p className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">Sıralanabilir Liste ({categories.length})</p>
                     <div className="flex items-center gap-2 text-white/20">
                        <MousePointer2 className="w-3 h-3" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Sürükle & Bırak</span>
                     </div>
                  </div>

                  {catsLoading ? (
                    <div className="p-20 text-center"><RefreshCw className="w-8 h-8 text-white/10 animate-spin mx-auto" /></div>
                  ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={categories.map(c => c.id)} strategy={verticalListSortingStrategy}>
                        {categories.map(cat => (
                          <SortableCategoryItem 
                            key={cat.id} 
                            cat={cat} 
                            accentColor={accentColor}
                            onDelete={(id) => confirm("Emin misiniz?") && deleteCatMutation.mutate(id)} 
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  )}
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="traits"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            {/* Category Filter Bar */}
            <div className="flex items-center gap-4 bg-[#0d0d0d] p-3 rounded-[32px] border border-white/5 w-fit overflow-x-auto scrollbar-hide max-w-full">
               <div className="flex items-center gap-2 px-6 border-r border-white/5 mr-2 hidden md:flex">
                  <Filter className="w-4 h-4 text-white/20" />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Görünüm</span>
               </div>
               {['Tümü', ...categories.map(c => c.name)].map(cat => (
                 <button
                   key={cat}
                   onClick={() => setSelectedCategoryFilter(cat)}
                   className={cn(
                     "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                     selectedCategoryFilter === cat ? "bg-white text-black shadow-xl scale-100" : "text-white/20 hover:text-white/60 scale-95 hover:bg-white/5"
                   )}
                 >
                   {cat}
                 </button>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               {/* Forms Column */}
               <div className="lg:col-span-4 space-y-8">
                  <div className="bg-[#0d0d0d] border border-white/5 rounded-[40px] p-10 shadow-2xl">
                    <h3 className="text-2xl font-serif text-white italic mb-8">Grup & Kategori</h3>
                    <form onSubmit={(e) => { e.preventDefault(); createGroupMutation.mutate({ name: newGroupName, categoryIds: selectedCategories }); }} className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black tracking-widest text-white/40 uppercase pl-2">Grup Adı</label>
                        <input
                          type="text"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          placeholder="Örn: Protein Tezgahı"
                          className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-white/10 transition-all focus:bg-white/[0.07]"
                          required
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black tracking-widest text-white/40 uppercase pl-2">Kategori İlişkisi</label>
                        <div className="flex flex-wrap gap-2">
                           {categories.map(cat => (
                             <button
                               key={cat.id}
                               type="button"
                               onClick={() => toggleCategorySelection(cat.id)}
                               className={cn(
                                 "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all",
                                 selectedCategories.includes(cat.id)
                                   ? cn(accentBorder, accentColor, "bg-white/5 shadow-xl")
                                   : "border-white/5 text-white/20 hover:border-white/10"
                               )}
                             >
                               {selectedCategories.includes(cat.id) ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                               {cat.name}
                             </button>
                           ))}
                        </div>
                        <p className="text-[9px] text-white/10 italic pl-1 leading-relaxed">Seçim yapılmazsa bu grup tüm kategorilerde ortak olarak gösterilir.</p>
                      </div>

                      <button
                        type="submit"
                        disabled={createGroupMutation.isPending}
                        className={cn(
                          "w-full py-5 rounded-[24px] font-black text-xs tracking-[0.2em] uppercase transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl",
                          accentBg, isCake ? "text-[#111]" : "text-white",
                          createGroupMutation.isPending && "opacity-50"
                        )}
                      >
                        {createGroupMutation.isPending ? "OLUŞTURULUYOR..." : "GRUP OLUŞTUR"}
                      </button>
                    </form>
                  </div>

                  {traitGroups.length > 0 && (
                    <div className="bg-[#0d0d0d] border border-white/5 rounded-[40px] p-10 shadow-2xl">
                      <h3 className="text-2xl font-serif text-white italic mb-8">Hızlı Filtre Ekle</h3>
                      <form onSubmit={(e) => { e.preventDefault(); createTraitMutation.mutate({ traitGroupId: selectedGroupId, name: newTraitName }); }} className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black tracking-widest text-white/40 uppercase pl-2">Hedef Grup</label>
                          <select
                            value={selectedGroupId}
                            onChange={(e) => setSelectedGroupId(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-white/10 transition-all appearance-none"
                            required
                          >
                            <option value="" disabled>Seçiniz...</option>
                            {traitGroups.map(g => (
                              <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black tracking-widest text-white/40 uppercase pl-2">Filtre İsmi</label>
                          <input
                            type="text"
                            value={newTraitName}
                            onChange={(e) => setNewTraitName(e.target.value)}
                            placeholder="Örn: Vegan, Az Kalorili"
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-white/10 transition-all focus:bg-white/[0.07]"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={createTraitMutation.isPending}
                          className="w-full py-4 rounded-[20px] border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-[10px] font-black tracking-widest uppercase transition-all"
                        >
                          FİLTREYİ EKLE
                        </button>
                      </form>
                    </div>
                  )}
               </div>

               {/* Grid Column */}
               <div className="lg:col-span-8">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={filteredTraitGroups.map(g => g.id)} strategy={verticalListSortingStrategy}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <AnimatePresence mode="popLayout">
                          {filteredTraitGroups.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-2 p-20 text-center border-2 border-dashed border-white/5 rounded-[40px]">
                               <Hash className="w-12 h-12 text-white/5 mx-auto mb-4" />
                               <p className="text-white/20 font-serif italic text-lg">Bu kategoride henüz bir grup bulunmuyor.</p>
                            </motion.div>
                          ) : (
                            filteredTraitGroups.map(group => (
                              <SortableTraitGroupItem 
                                key={group.id}
                                group={group}
                                onDelete={(id) => confirm("Silmek istediğinize emin misiniz?") && deleteGroupMutation.mutate(id)}
                                onDeleteTrait={(id) => deleteTraitMutation.mutate(id)}
                              />
                            ))
                          )}
                        </AnimatePresence>
                      </div>
                    </SortableContext>
                  </DndContext>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
)
