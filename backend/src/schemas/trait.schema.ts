import { z } from "zod";
import { Brand } from "@prisma/client";

export const traitGroupSchema = z.object({
  brand: z.nativeEnum(Brand),
  name: z.string().min(2, "Grup adı en az 2 karakter olmalıdır. (Örn: Beslenme Tercihi)"),
});

export const traitSchema = z.object({
  traitGroupId: z.string().uuid("Geçerli bir grup ID'si gereklidir."),
  name: z.string().min(2, "Etiket adı en az 2 karakter olmalıdır. (Örn: Vegan)"),
});
