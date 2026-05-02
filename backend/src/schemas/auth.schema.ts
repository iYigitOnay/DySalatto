import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır."),
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır.").optional(),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  password: z.string().min(1, "Şifre zorunludur."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
