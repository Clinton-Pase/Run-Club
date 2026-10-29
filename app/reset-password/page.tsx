
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data: { user }, error: userError } =
        await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(
          "Your recovery session is missing or expired. Request a new link."
        );
      }

      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      await supabase.auth.signOut();
      router.replace("/login?message=password_updated");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Password update failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#031429] px-4 text-white">
      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-5 rounded-2xl border border-zinc/10 bg-white p-8"
      >
        <h1 className="text-2xl text-[#031429] font-bold">Choose a new password</h1>

        <label className="block text-sm">
          New password
          <input
            className="mt-2 w-full rounded-lg border border-white/10 bg-zinc-950 p-3"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button
          disabled={loading}
          className="w-full rounded-lg bg-zinc-950 p-3 font-semibold disabled:opacity-60  hover:bg-red-800"
        >
          {loading ? "Updating..." : "Update password"}
        </button>

        {message && <p role="status" className="text-sm text-[#031429]">{message}</p>}
      </form>
    </main>
  );
}