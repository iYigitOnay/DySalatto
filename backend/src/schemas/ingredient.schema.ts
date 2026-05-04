import { z } from "zod";
import { Brand } from "@prisma/client";

export const ingredientSchema = z.object({
  brand: z.nativeEnum(Brand),
  name: z.string().min(2, "Malzeme adı en az 2 karakter olmalıdır."),
  price: z.number().min(0, "Fiyat 0'dan küçük olamaz.").optional().default(0),
  isStock: z.boolean().optional().default(true),
});

export const updateIngredientSchema = z.object({
  name: z.string().min(2, "Malzeme adı en az 2 karakter olmalıdır.").optional(),
  price: z.number().min(0, "Fiyat 0'dan küçük olamaz.").optional(),
  isStock: z.boolean().optional(),
});

export const ingredientStepSchema = z.object({
  brand: z.nativeEnum(Brand),
  name: z.string().min(2, "Adım adı en az 2 karakter olmalıdır. (Örn: Taban Seç)"),
  orderIndex: z.number().int().min(0).optional().default(0),
  isRequired: z.boolean().optional().default(false),
  minSelect: z.number().int().min(0).optional().default(0),
  maxSelect: z.number().int().min(1).optional().default(1),
  ingredientIds: z.array(z.string().uuid()).optional().default([]), // Bu adıma eklenecek malzemelerin ID'leri
});

export const updateIngredientStepSchema = ingredientStepSchema.partial().omit({ brand: true });
