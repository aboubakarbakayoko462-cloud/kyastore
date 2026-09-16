"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Identifiants incorrects.");
      return;
    }
    router.push("/admin/dashboard");
  }

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 md:px-10 py-20 flex justify-center">
      <div className="w-full max-w-[340px] bg-surface border border-line rounded-lg p-7">
        <h1 className="font-heading font-semibold text-xl text-center mb-6">
          Espace boutique
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-line rounded-md px-3.5 py-2.5 text-sm bg-surface focus:outline-none focus:border-brand transition-colors"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-line rounded-md px-3.5 py-2.5 text-sm bg-surface focus:outline-none focus:border-brand transition-colors"
          />
          {error && (
            <p className="text-[12.5px] text-danger bg-danger-bg px-3 py-2 rounded-md">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 bg-brand text-white rounded-md py-2.5 text-sm font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
