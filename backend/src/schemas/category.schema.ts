import { z } from "zod";
import { Brand } from "@prisma/client";

export const categorySchema = z.object({
  brand: z.nativeEnum(Brand),
  name: z.string().min(2, "Kategori adı en az 2 karakter olmalıdır."),
});
