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

export default function AuthForm({ mode }: AuthFormProps) {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isSignup = mode === "signup";

  function getCallbackUrl() {
    const url = new URL("/auth/callback", window.location.origin);
    const requestedNext = searchParams.get("next");

    const next =
      requestedNext?.startsWith("/") &&
      !requestedNext.startsWith("//")
        ? requestedNext
        : "/dashboard";

    url.searchParams.set("next", next);
    return url.toString();
  }

  function validateEmail(normalizedEmail: string) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!normalizedEmail) {
      return "Please enter your email address.";
    }

    if (!emailPattern.test(normalizedEmail)) {
      return "Please enter a valid email address, such as you@example.com.";
    }

    return null;
  }

  function validateSignup() {
    const trimmedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      return "Please enter your full name.";
    }

    if (trimmedName.length > 100) {
      return "Your name must be 100 characters or less.";
    }

    const emailError = validateEmail(normalizedEmail);
    if (emailError) return emailError;

    if (password.length < 8) {
      return "Your password must be at least 8 characters.";
    }

    if (password !== confirmPassword) {
      return "Your passwords do not match. Please check them and try again.";
    }

    return null;
  }

  function validateLogin() {
    const normalizedEmail = email.trim().toLowerCase();

    const emailError = validateEmail(normalizedEmail);
    if (emailError) return emailError;

    if (!password) {
      return "Please enter your password.";
    }

    return null;
  }

  function getAuthErrorMessage(error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message.toLowerCase() : "";

    if (
      errorMessage.includes("email not confirmed") ||
      errorMessage.includes("email_not_confirmed")
    ) {
      return "Your email address has not been verified yet. Please check your inbox for the confirmation link.";
    }

    if (
      errorMessage.includes("invalid login credentials") ||
      errorMessage.includes("invalid_credentials")
    ) {
      return "The email or password is incorrect. Please check your details and try again.";
    }

    if (
      errorMessage.includes("user already registered") ||
      errorMessage.includes("user_already_exists")
    ) {
      return "An account may already exist with this email. Try logging in instead.";
    }

    if (
      errorMessage.includes("password should be at least") ||
      errorMessage.includes("weak_password")
    ) {
      return "Please choose a stronger password with at least 8 characters.";
    }

    if (
      errorMessage.includes("rate limit") ||
      errorMessage.includes("too many requests")
    ) {
      return "Too many attempts have been made. Please wait a little and try again.";
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }

    return "Authentication failed. Please try again.";
  }

  async function signInWithGoogle() {
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getCallbackUrl(),
        },
      });

      if (error) throw error;

      if (data.url) {
        window.location.assign(data.url);
      } else {
        setMessage("Google sign-in could not be started. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      setMessage(getAuthErrorMessage(error));
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
          "Account created successfully. Check your email for the verification link before logging in."
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
      setMessage(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#0b2a53] px-4 py-32 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-50 p-7 shadow-2xl sm:p-9">
        <Navbar />

        <Link href="/">
          <Image
            src={Alx}
            alt="ALX Run Club"
            className="mx-auto h-10 w-auto"
            priority
          />
          <h1 className="text-center text-[0.6rem] font-bold text-[#031429]">
            RUN CLUB
          </h1>
        </Link>

        <h1 className="mt-6 text-center text-3xl font-bold text-[#031429]">
          {isSignup ? "Join the club" : "Welcome back"}
        </h1>

        <p className="mt-2 text-center text-sm text-[#031429]">
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
                minLength={2}
                maxLength={100}
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#031429] px-4 py-3 text-white outline-none focus:border-orange-950"
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
              className="w-full rounded-lg border border-white/10 bg-[#031429] px-4 py-3 text-white outline-none focus:border-orange-950"
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
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete={
                  isSignup ? "new-password" : "current-password"
                }
                minLength={isSignup ? 8 : undefined}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#031429] px-4 py-3 pr-20 text-white outline-none focus:border-orange-950"
                placeholder={isSignup ? "At least 8 characters" : "Your password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-3 text-sm text-gray-300 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {isSignup && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm text-[#031429]"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#031429] px-4 py-3 pr-20 text-white outline-none focus:border-orange-950"
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirmation password"
                      : "Show confirmation password"
                  }
                  className="absolute inset-y-0 right-3 text-sm text-gray-300 hover:text-white"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          )}

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
            className="mt-4 rounded-lg bg-red-800 p-3 text-sm text-zinc-200"
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