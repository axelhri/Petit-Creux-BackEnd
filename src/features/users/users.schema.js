import { z } from "zod";

const RegisterUserSchema = z.object({
  image: z
    .string()
    .url({ message: "Image invalide: doit être une URL valide" }) // If expecting a URL
    .or(
      z.string().regex(/^data:image\/(png|jpg|jpeg);base64,/, {
        message: "Image invalide: doit être une image encodée en base64",
      })
    ),

  name: z
    .string()
    .trim()
    .min(3, { message: "Doit avoir au minimum 3 caractères" })
    .max(15, { message: "Doit avoir au maximum 15 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  password: z
    .string()
    .trim()
    .min(6, { message: "Doit avoir au minimum 6 caractères" }),
});

const LoginUserSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().trim(),
});

export { LoginUserSchema, RegisterUserSchema };
