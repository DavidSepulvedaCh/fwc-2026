"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "El usuario debe tener al menos 3 caracteres.")
      .max(20, "Máximo 20 caracteres.")
      .regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guion bajo."),
    name: z.string().trim().max(50, "Máximo 50 caracteres.").optional(),
    password: z.string().min(8, "Mínimo 8 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export type AuthFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = {
    username: String(formData.get("username") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim() || undefined,
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const existing = await prisma.user.findUnique({
    where: { username: parsed.data.username },
  });
  if (existing) {
    return { fieldErrors: { username: ["Ese usuario ya existe."] } };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.create({
    data: {
      username: parsed.data.username,
      name: parsed.data.name,
      passwordHash,
    },
  });

  try {
    await signIn("credentials", {
      username: parsed.data.username,
      password: parsed.data.password,
      redirect: false,
    });
  } catch {
    redirect("/login");
  }
  redirect("/");
}

const loginSchema = z.object({
  username: z.string().min(1, "Requerido."),
  password: z.string().min(1, "Requerido."),
});

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = {
    username: String(formData.get("username") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    await signIn("credentials", {
      username: parsed.data.username,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Usuario o contraseña incorrectos." };
    }
    throw err;
  }
  redirect("/");
}

export async function logoutAction() {
  await signOut({ redirect: false });
  redirect("/");
}

export async function googleSignInAction() {
  await signIn("google", { redirectTo: "/" });
}
