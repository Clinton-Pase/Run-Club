"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  function validateSignup() {
    const trimmedName = fullName.trim();
    const normalizedEmail = email.trim();

    if (trimmedName.length < 2) {
      return "Please enter your full name.";
    }

    if (trimmedName.length > 100) {
      return "Your name must be 100 characters or less.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return "Please enter a valid email address.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }

    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return null;
  }

  function validateLogin() {
    const normalizedEmail = email.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return "Please enter a valid email address.";
    }

    if (!password) {
      return "Please enter your password.";
    }

    return null;
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

    setMessage("");

    const validationError = isSignup
      ? validateSignup()
      : validateLogin();

    if (validationError) {
      setMessage(validationError);
      return;
    }

    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
            emailRedirectTo: getCallbackUrl(),
          },
        });

        if (error) throw error;

        if (data.session) {
          window.location.assign("/dashboard");
          return;
        }

        setMessage(
          "Account created successfully. Check your email to verify your address before signing in."
        );

        setPassword("");
        setConfirmPassword("");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-7 shadow-2xl sm:p-9">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400"
        >
          ALX Run Club
        </Link>

        <h1 className="mt-8 text-3xl font-bold">
          {isSignup ? "Join the club." : "Welcome back."}
        </h1>

        <p className="mt-2 text-sm text-zinc-400">
          {isSignup
            ? "Create your account and get moving with us."
            : "Sign in to access your running community."}
        </p>

        <div className="mt-7 grid gap-3">
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 font-semibold text-zinc-900 hover:bg-zinc-100 disabled:opacity-60"
          >
            <span className="text-lg font-bold">G</span>
            Continue with Google
          </button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />

          <span className="text-xs uppercase text-zinc-500">
            Or continue with email
          </span>

          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={submitEmail} className="space-y-4">
          {isSignup && (
            <div>
              <label
                htmlFor="fullName"
                className="mb-1.5 block text-sm text-zinc-300"
              >
                Full name
              </label>

              <input
                id="fullName"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 outline-none focus:border-orange-400"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm text-zinc-300"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 outline-none focus:border-orange-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm text-zinc-300"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete={
                isSignup
                  ? "new-password"
                  : "current-password"
              }
              minLength={8}
              required
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 outline-none focus:border-orange-400"
              placeholder={
                isSignup
                  ? "At least 8 characters"
                  : "Your password"
              }
            />
          </div>

          {isSignup && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm text-zinc-300"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 outline-none focus:border-orange-400"
                placeholder="Enter your password again"
              />
            </div>
          )}

          {!isSignup && (
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-orange-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-orange-500 px-4 py-3 font-bold text-white hover:bg-orange-600 disabled:opacity-60"
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

        <p className="mt-6 text-center text-sm text-zinc-400">
          {isSignup
            ? "Already a member? "
            : "New to ALX Run Club? "}

          <Link
            href={isSignup ? "/login" : "/signup"}
            className="font-semibold text-orange-400 hover:underline"
          >
            {isSignup
              ? "Log in"
              : "Create an account"}
          </Link>
        </p>

        <Link
          href="/"
          className="mt-5 block text-center text-sm text-zinc-500 hover:text-white"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
