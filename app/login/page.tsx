
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

type AuthFormProps = {
  mode: "login" | "signup";
};
import Navbar from "../components/Navbar";
import Alx from "../components/assets/alxlogo.png";
import Footer from "../components/Footer";

export default function AuthForm({ mode }: AuthFormProps) {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isSignup = mode === "signup";

  function getCallbackUrl() {
    const url = new URL("/auth/callback", window.location.origin);
    const requestedNext = searchParams.get("next");

    // Only allow safe, local redirect paths.
    const next =
      requestedNext?.startsWith("/") &&
      !requestedNext.startsWith("//")
        ? requestedNext
        : "/dashboard";

    url.searchParams.set("next", next);
    return url.toString();
  }

  async function signInWithGoogle() {
    setLoading(true);
    setMessage("");

    try {
      const { data, error } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: getCallbackUrl(),
          },
        });

      if (error) throw error;

      if (data.url) {
        window.location.assign(data.url);
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Google sign-in could not be started."
      );
      setLoading(false);
    }
  }

  async function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: getCallbackUrl(),
          },
        });

        if (error) throw error;

        if (data.session) {
          window.location.assign("/dashboard");
          return;
        }

        setMessage(
          "Account created. Check your email to verify your address before signing in."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        window.location.assign("/dashboard");
        return;
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function signInWithStrava() {
    // Supabase does not have a native Strava provider.
    // Do not silently route Strava users through Google.
    window.location.assign("/api/auth/strava");
  }

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#0b2a53] px-4 py-32 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-50 p-7 shadow-2xl sm:p-9">
      <Navbar />
        <Link
          href="/"
          className=""
        >
            <Image
            src={Alx}
            alt="ALX Run Club"
            className="h-10 w-auto  mx-auto"
            priority
          />
        </Link>

        <h1 className="mt-8 text-3xl text-[#031429] font-bold text-center">
          {isSignup ? "Join the club" : "Welcome back"}
        </h1>

        <p className="mt-2 text-sm text-[#031429] text-center">
          {isSignup
            ? "Create your account and get moving with us."
            : "Sign in to access your running community."}
        </p>

        <div className="mt-7 grid gap-3">
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#031429] px-4 py-3 font-semibold text-gray-50 hover:bg-zinc-950 disabled:opacity-60"
          >
            <span className="text-lg font-bold">G</span>
            Continue with Google
          </button>

        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase text-zinc-950">
            Or continue with email
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={submitEmail} className="space-y-4">
          {isSignup && (
            <div>
              <label
                htmlFor="fullName"
                className="mb-1.5 block text-sm text-[#031429]"
              >
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#031429] px-4 py-3 outline-none focus:border-orange-950"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm text-[#031429]"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#031429] px-4 py-3 outline-none focus:border-orange-950"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm text-[#031429]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={
                isSignup ? "new-password" : "current-password"
              }
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#031429] px-4 py-3 outline-none focus:border-orange-950"
              placeholder="At least 8 characters"
            />
          </div>

          {!isSignup && (
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-zinc-950 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-zinc-950 px-4 py-3 font-bold text-white hover:bg-gray-600 disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : isSignup
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        {message && (
          <p
            role="status"
            aria-live="polite"
            className="mt-4 rounded-lg bg-zinc-800 p-3 text-sm text-zinc-200"
          >
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-[#031429]">
          {isSignup ? "Already a member? " : "New to ALX Run Club? "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="font-semibold text-zinc-900 hover:underline"
          >
            {isSignup ? "Log in" : "Create an account"}
          </Link>
        </p>

        <Link
          href="/"
          className="mt-5 block text-center text-sm text-[#031429] hover:text-gray-900"
        >
          ← Back to home
        </Link>
      </div>
      
    </main>
    
  );
}