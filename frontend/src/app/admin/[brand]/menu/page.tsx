"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Trash2, Tag, Layers, RefreshCw, GripVertical, CheckSquare, Square } from "lucide-react";
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

// --- Sortable Item Component ---
function SortableCategoryItem({ 
  cat, 
  onDelete, 
  primaryColor 
}: { 
  cat: Category; 
  onDelete: (id: string) => void;
  primaryColor: string;
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
        "grid grid-cols-12 gap-4 p-6 items-center bg-[#0a0a0a] border-b border-white/5 hover:bg-white/[0.02] transition-colors",
        isDragging && "opacity-50 border-white/20"
      )}
    >
      <div className="col-span-1 cursor-grab active:cursor-grabbing text-white/20 hover:text-white/60 transition-colors" {...attributes} {...listeners}>
        <GripVertical className="w-4 h-4" />
      </div>
      <div className="col-span-3 font-bold text-sm text-white">{cat.name}</div>
      <div className="col-span-4 text-xs text-white/40 bg-white/5 px-3 py-1 rounded-md w-fit font-mono">{cat.slug}</div>
      <div className="col-span-2 text-xs text-white/30 italic">
        {cat._count?.products || 0} Ürün
      </div>
      <div className="col-span-2 text-right">
        <button onClick={() => onDelete(cat.id)} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function AdminMenuPage() {
  const params = useParams();
  const brand = params.brand as string;
  const dbBrand = brand === "dycake" ? "DYCAKE" : "DYSALATTO";
  const isCake = brand === "dycake";
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  
  const primaryColor = isCake ? "text-brand-sand" : "text-brand-terracotta";
  const primaryBg = isCake ? "bg-brand-sand" : "bg-brand-terracotta";
  const hoverBg = isCake ? "hover:bg-brand-sand/10" : "hover:bg-brand-terracotta/10";

  const [activeTab, setActiveTab] = useState<"categories" | "traits">("categories");
  
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

  const categories = categoriesRes?.data || [];
  const traitGroups = traitGroupsRes?.data || [];

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

  const updateGroupMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => fetchApi(`/traits/groups/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-trait-groups'] });
      showToast("Grup güncellendi.", "success");
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

  // --- Handlers ---
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = categories.findIndex((c: any) => c.id === active.id);
      const newIndex = categories.findIndex((c: any) => c.id === over?.id);
      const newArray = arrayMove(categories, oldIndex, newIndex);
      
      const orders = newArray.map((c: any, index: number) => ({
        id: c.id,
        orderIndex: index
      }));
      
      reorderCatsMutation.mutate(orders);
    }
  };

  const toggleCategorySelection = (catId: string) => {
    setSelectedCategories(prev => 
        prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const handleGroupCategoryUpdate = (groupId: string, catIds: string[], groupName: string) => {
    updateGroupMutation.mutate({
      id: groupId,
      data: { name: groupName, categoryIds: catIds }
    });
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-serif mb-2">Menü & Kategori Yönetimi</h1>
          <p className="text-white/40 text-sm max-w-xl leading-relaxed">
            {isCake ? "Pastalarınız" : "Kaseleriniz"} için ana kategorileri belirleyin, sıralayın ve dinamik filtreleri yönetin.
          </p>
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
            <div className="bg-[#111] border border-white/5 rounded-[24px] p-8 sticky top-8">
              <h3 className="text-lg font-serif mb-6">Yeni Kategori Ekle</h3>
              <form onSubmit={(e) => { e.preventDefault(); createCatMutation.mutate(newCatName); }} className="space-y-4">
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
                  disabled={createCatMutation.isPending}
                  className={cn("w-full py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-colors", primaryBg, isCake ? "text-[#111]" : "text-white", createCatMutation.isPending && "opacity-50")}
                >
                  {createCatMutation.isPending ? "Oluşturuluyor..." : "Oluştur"}
                </button>
              </form>
              <p className="mt-6 text-[10px] text-white/20 italic leading-relaxed">
                * Kategori sıralamasını değiştirmek için listedeki öğeleri tutup sürükleyebilirsiniz.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
             <div className="bg-transparent border border-white/5 rounded-[24px] overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-6 border-b border-white/5 bg-white/5 text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">
                   <div className="col-span-1"></div>
                   <div className="col-span-3">Kategori Adı</div>
                   <div className="col-span-4">Sistem Adı (Slug)</div>
                   <div className="col-span-2 text-center">Ürün Sayısı</div>
                   <div className="col-span-2 text-right">İşlem</div>
                </div>
                
                {catsLoading ? (
                  <div className="p-12 text-center text-white/30 text-sm animate-pulse">Yükleniyor...</div>
                ) : categories.length === 0 ? (
                  <div className="p-12 text-center text-white/30 text-sm">Henüz kategori bulunmuyor.</div>
                ) : (
                  <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext 
                      items={categories.map((c: any) => c.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="divide-y divide-white/5">
                        {categories.map((cat: any) => (
                          <SortableCategoryItem 
                            key={cat.id} 
                            cat={cat} 
                            primaryColor={primaryColor}
                            onDelete={(id) => { if(confirm("Emin misiniz?")) deleteCatMutation.mutate(id); }} 
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
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
            <div className="bg-[#111] border border-white/5 rounded-[24px] p-8">
              <h3 className="text-lg font-serif mb-6">Yeni Özellik Grubu Ekle</h3>
              <form onSubmit={(e) => { e.preventDefault(); createGroupMutation.mutate({ name: newGroupName, categoryIds: selectedCategories }); }} className="space-y-6">
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

                <div>
                  <label className="block text-[10px] font-black tracking-widest text-white/40 uppercase mb-3">Hangi Kategorilerde Görünsün?</label>
                  <div className="grid grid-cols-2 gap-3">
                     {categories.map((cat: any) => (
                       <button
                         key={cat.id}
                         type="button"
                         onClick={() => toggleCategorySelection(cat.id)}
                         className={cn(
                           "flex items-center gap-2 px-3 py-2 rounded-lg border text-[10px] font-bold transition-all",
                           selectedCategories.includes(cat.id)
                             ? "border-white/40 bg-white/10 text-white"
                             : "border-white/5 text-white/30 hover:border-white/20"
                         )}
                       >
                         {selectedCategories.includes(cat.id) ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                         {cat.name}
                       </button>
                     ))}
                  </div>
                  <p className="mt-3 text-[9px] text-white/20 italic">* Hiçbirini seçmezseniz tüm kategorilerde görünür.</p>
                </div>

                <button
                  type="submit"
                  disabled={createGroupMutation.isPending}
                  className={cn("w-full py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-colors", primaryBg, isCake ? "text-[#111]" : "text-white", createGroupMutation.isPending && "opacity-50")}
                >
                  {createGroupMutation.isPending ? "Oluşturuluyor..." : "Grubu Oluştur"}
                </button>
              </form>
            </div>

            {traitGroups.length > 0 && (
              <div className="bg-[#111] border border-white/5 rounded-[24px] p-8">
                <h3 className="text-lg font-serif mb-6">Alt Etiket (Filtre) Ekle</h3>
                <form onSubmit={(e) => { e.preventDefault(); createTraitMutation.mutate({ traitGroupId: selectedGroupId, name: newTraitName }); }} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black tracking-widest text-white/40 uppercase mb-2">Hangi Gruba Eklenecek?</label>
                    <select
                      value={selectedGroupId}
                      onChange={(e) => setSelectedGroupId(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 appearance-none"
                      required
                    >
                      <option value="" disabled>Grup Seçiniz...</option>
                      {traitGroups.map((g: any) => (
                        <option key={g.id} value={g.id}>
                          {g.name} {g.categories.length > 0 ? `(${g.categories.map((c: any) => c.name).join(", ")})` : "(Tümü)"}
                        </option>
                      ))}
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
                    disabled={createTraitMutation.isPending}
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
                {traitsLoading ? (
                  <div className="col-span-2 p-12 text-center text-white/30 text-sm animate-pulse">Yükleniyor...</div>
                ) : traitGroups.length === 0 ? (
                  <div className="col-span-2 p-12 text-center border border-dashed border-white/10 rounded-[24px] text-white/30 text-sm">
                     Henüz özellik grubu eklenmemiş. Lütfen önce sol taraftan bir grup oluşturun.
                  </div>
                ) : (
                  traitGroups.map((group: any) => (
                    <div key={group.id} className="bg-transparent border border-white/5 rounded-[24px] overflow-hidden flex flex-col">
                       <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
                          <div>
                            <h4 className="font-bold text-white text-sm">{group.name}</h4>
                            <p className="text-[9px] text-white/30 mt-1 uppercase tracking-wider">
                              {group.categories.length === 0 ? "Tüm Kategoriler" : group.categories.map((c: any) => c.name).join(", ")}
                            </p>
                          </div>
                          <button onClick={() => { if(confirm("Emin misiniz?")) deleteGroupMutation.mutate(group.id); }} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Grubu Sil">
                            <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                       <div className="p-6 flex-1 bg-white/[0.01]">
                          {group.traits.length === 0 ? (
                            <p className="text-xs text-white/30 italic">Bu grupta henüz etiket yok.</p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {group.traits.map((trait: any) => (
                                <div key={trait.id} className={cn("group flex items-center gap-2 pl-3 pr-1 py-1 rounded-full border border-white/10 text-xs text-white/70", hoverBg)}>
                                   {trait.name}
                                   <button onClick={() => deleteTraitMutation.mutate(trait.id)} className="p-1 rounded-full hover:bg-red-500/20 hover:text-red-400 text-white/20 opacity-0 group-hover:opacity-100 transition-all">
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
