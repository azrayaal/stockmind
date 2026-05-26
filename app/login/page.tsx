"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "budi@tokoberkahjaya.id", password: "demo123" },
  });

  const onSubmit = (data: LoginForm) => {
    setError("");
    const success = login(data.email, data.password);
    if (success) {
      router.push("/dashboard");
    } else {
      setError("Login gagal. Periksa kredensial Anda.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-gradient-to-br from-blue-500 via-blue-600 to-violet-600 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold">StockMind AI</span>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Kelola inventori
            <br />
            dengan kecerdasan AI
          </h1>
          <p className="max-w-md text-blue-100">
            Dashboard inventori cerdas untuk UMKM Indonesia. Prediksi restock,
            pantau stok, dan tingkatkan efisiensi bisnis Anda.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { label: "Produk", value: "12+", bg: "bg-white/15" },
              { label: "Akurasi AI", value: "92%", bg: "bg-pink-400/20" },
              { label: "Hemat Waktu", value: "40%", bg: "bg-violet-400/20" },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-2xl ${stat.bg} p-4 backdrop-blur`}>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-blue-200">
          © 2026 StockMind AI — Proof of Concept
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-slate-50 p-6">
        <Card className="w-full max-w-md rounded-2xl border-slate-100 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 shadow-sm shadow-blue-200 lg:hidden">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Masuk ke StockMind</CardTitle>
            <CardDescription>
              Demo login — gunakan email apapun untuk masuk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-500">{errors.password.message}</p>
                )}
              </div>
              {error && (
                <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-900/20">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                Masuk
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
            <p className="mt-6 text-center text-xs text-zinc-500">
              POC Demo — Tidak memerlukan backend nyata
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
