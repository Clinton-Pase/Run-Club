
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email,
        {
         redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        }
      );

      if (error) throw error;

      setMessage(
        "If an account exists for this email, a password reset link will be sent."
      );
    } catch {
      setMessage("Unable to request a reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-5 rounded-2xl border border-white/10 bg-zinc-900 p-8"
      >
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-sm text-zinc-400">
          Enter your email and we&apos;ll send you a recovery link.
        </p>

        <label className="block text-sm">
          Email address
          <input
            className="mt-2 w-full rounded-lg border border-white/10 bg-zinc-950 p-3"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <button
          disabled={loading}
          className="w-full rounded-lg bg-orange-500 p-3 font-semibold disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>

        {message && <p role="status" className="text-sm">{message}</p>}

        <Link href="/login" className="block text-sm text-orange-400">
          Back to login
        </Link>
      </form>
    </main>
  );
}