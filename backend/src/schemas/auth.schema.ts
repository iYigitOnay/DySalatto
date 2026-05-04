import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
});

// Admin tarafında şimdilik adminleri doğrudan seed ile ekleyeceğiz. 
// Ancak genel kullanıcılar için register schema da dursun.
export const registerSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır."),
  phone: z.string().optional(),
});
