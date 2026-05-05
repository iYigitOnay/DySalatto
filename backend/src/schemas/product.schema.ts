import { z } from "zod";
import { Brand, ProductStatus } from "@prisma/client";

export const productSchema = z.object({
  brand: z.nativeEnum(Brand),
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  description: z.string().optional(),
  price: z.number().positive("Fiyat pozitif bir değer olmalıdır"),
  image: z.string().optional(),
  status: z.nativeEnum(ProductStatus).default(ProductStatus.ACTIVE),
  categoryId: z.string().uuid("Geçerli bir kategori ID'si gereklidir"),
  traitIds: z.array(z.string().uuid()).optional(),
  ingredientIds: z.array(z.string().uuid()).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
