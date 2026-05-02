"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email("Geçerli bir e-posta adresi giriniz."),
    password: zod_1.z.string().min(8, "Şifre en az 8 karakter olmalıdır."),
    name: zod_1.z.string().min(2, "İsim en az 2 karakter olmalıdır.").optional(),
    phone: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Geçerli bir e-posta adresi giriniz."),
    password: zod_1.z.string().min(1, "Şifre zorunludur."),
});
//# sourceMappingURL=auth.schema.js.map