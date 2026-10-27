
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ChallengeNavigation from "@/app/components/ChallengeNavigation";

type Tab = "profile" | "security" | "preferences" | "account";

type ProfilePageProps = {
  user: {
    id: string;
    email?: string;
  };
  profile: {
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
  };
};

export default function ProfileClient({
  user,
  profile,
}: ProfilePageProps) {
  const supabase = createClient();

  const [activeTab, setActiveTab] =
    useState<Tab>("profile");

  const [menuOpen, setMenuOpen] = useState(false);

  const [fullName, setFullName] = useState(
    profile.full_name ?? ""
  );

  const [avatarUrl, setAvatarUrl] = useState(
    profile.avatar_url ?? ""
  );

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function saveProfile(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const trimmedName = fullName.trim();
      const trimmedAvatar = avatarUrl.trim();

      if (!trimmedName) {
        throw new Error(
          "Please enter your full name."
        );
      }

      if (
        trimmedAvatar &&
        !/^https?:\/\/\S+$/i.test(trimmedAvatar)
      ) {
        throw new Error(
          "Please enter a valid image URL."
        );
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: trimmedName,
          avatar_url: trimmedAvatar || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setMessage(
        "Profile updated successfully."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update your profile."
      );
    } finally {
      setLoading(false);
    }
  }

  async function changePassword(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (newPassword.length < 8) {
        throw new Error(
          "Your new password must be at least 8 characters."
        );
      }

      if (newPassword !== confirmPassword) {
        throw new Error(
          "Your passwords do not match."
        );
      }

      const { error } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (error) throw error;

      setNewPassword("");
      setConfirmPassword("");

      setMessage(
        "Your password has been updated successfully."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update your password."
      );
    } finally {
      setLoading(false);
    }
  }

  function switchTab(tab: Tab) {
    setActiveTab(tab);
    setMessage("");
    setError("");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <main className="min-h-screen bg-[#031429] px-4 py-6 text-white sm:px-10 sm:py-10">
      <div className="mx-auto max-w-5xl">

       <ChallengeNavigation/>

        {/* PAGE HEADER */}
        <section className="mt-8 sm:mt-10">

          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-50 sm:text-base">
              Manage your member information,
              security, preferences and account.
            </p>
          </div>

          {/* PROFILE CARD */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-gray-50 sm:mt-10 sm:rounded-3xl">

            {/* PROFILE TABS */}
            <div className="grid grid-cols-2 border-b border-zinc-200 sm:flex">

              <button
                type="button"
                onClick={() =>
                  switchTab("profile")
                }
                className={`px-4 py-4 text-sm font-semibold transition sm:flex-1 sm:px-6 ${
                  activeTab === "profile"
                    ? "border-b-2 border-[#000] bg-white text-[#031429]"
                    : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                Profile
              </button>

              <button
                type="button"
                onClick={() =>
                  switchTab("security")
                }
                className={`px-4 py-4 text-sm font-semibold transition sm:flex-1 sm:px-6 ${
                  activeTab === "security"
                    ? "border-b-2 border-[#000] bg-white text-[#031429]"
                    : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                Security
              </button>

              <button
                type="button"
                onClick={() =>
                  switchTab("preferences")
                }
                className={`border-t border-zinc-200 px-4 py-4 text-sm font-semibold transition sm:flex-1 sm:border-t-0 sm:px-6 ${
                  activeTab === "preferences"
                    ? "border-b-2 border-[#000] bg-white text-[#031429]"
                    : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                Preferences
              </button>

              <button
                type="button"
                onClick={() =>
                  switchTab("account")
                }
                className={`border-l border-t border-zinc-200 px-4 py-4 text-sm font-semibold transition sm:flex-1 sm:border-l-0 sm:border-t-0 sm:px-6 ${
                  activeTab === "account"
                    ? "border-b-2 border-[#000] bg-white text-[#031429]"
                    : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                Account
              </button>

            </div>

            {/* TAB CONTENT */}
            <div className="p-5 sm:p-8">

              {message && (
                <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
                  {message}
                </div>
              )}

              {error && (
                <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* PROFILE */}
              {activeTab === "profile" && (
                <div>

                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-[#031429] sm:text-2xl">
                      Personal information
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#031429]">
                      Update the information other club
                      members can associate with you.
                    </p>
                  </div>

                  <div className="mb-8 flex items-center gap-4">

                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="h-14 w-14 shrink-0 rounded-full border border-white/10 object-cover sm:h-16 sm:w-16"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#031429] text-xl font-bold text-white sm:h-16 sm:w-16">
                        {(
                          fullName ||
                          user.email ||
                          "R"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#031429]">
                        {fullName ||
                          "Your name"}
                      </p>

                      <p className="truncate text-sm text-[#031429]">
                        {user.email}
                      </p>
                    </div>

                  </div>

                  <form
                    onSubmit={saveProfile}
                    className="max-w-2xl space-y-5"
                  >

                    <div>
                      <label
                        htmlFor="fullName"
                        className="mb-2 block text-sm font-medium text-[#031429]"
                      >
                        Full name
                      </label>

                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(event) =>
                          setFullName(
                            event.target.value
                          )
                        }
                        maxLength={100}
                        required
                        className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-orange-500"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="avatarUrl"
                        className="mb-2 block text-sm font-medium text-[#031429]"
                      >
                        Profile picture URL
                      </label>

                      <input
                        id="avatarUrl"
                        type="url"
                        value={avatarUrl}
                        onChange={(event) =>
                          setAvatarUrl(
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-orange-500"
                        placeholder="https://example.com/photo.jpg"
                      />

                      <p className="mt-2 text-xs text-[#031429]">
                        Optional. Use a publicly
                        accessible image URL.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-[#031429] px-5 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-60 sm:w-auto"
                    >
                      {loading
                        ? "Saving..."
                        : "Save changes"}
                    </button>

                  </form>
                </div>
              )}

              {/* SECURITY */}
              {activeTab === "security" && (
                <div>

                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-[#031429] sm:text-2xl">
                      Security
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#031429]">
                      Keep your account secure by
                      regularly updating your password.
                    </p>
                  </div>

                  <form
                    onSubmit={changePassword}
                    className="max-w-2xl space-y-5"
                  >

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="mb-2 block text-sm font-medium text-[#031429]"
                      >
                        New password
                      </label>

                      <input
                        id="newPassword"
                        type="password"
                        autoComplete="new-password"
                        minLength={8}
                        required
                        value={newPassword}
                        onChange={(event) =>
                          setNewPassword(
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-orange-500"
                        placeholder="At least 8 characters"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-sm font-medium text-[#031429]"
                      >
                        Confirm new password
                      </label>

                      <input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        minLength={8}
                        required
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-orange-500"
                        placeholder="Repeat your new password"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-[#031429] px-5 py-3 font-semibold text-white hover:bg-zinc-950 disabled:opacity-60 sm:w-auto"
                    >
                      {loading
                        ? "Updating..."
                        : "Update password"}
                    </button>

                  </form>

                  <div className="mt-10 border-t border-white/10 pt-6">

                    <h3 className="font-semibold text-[#031429]">
                      Forgot your password?
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#031429]">
                      If you can't remember your
                      password, you can request a
                      recovery link.
                    </p>

                    <Link
                      href="/forgot-password"
                      className="mt-4 inline-block text-sm font-semibold text-zinc-900 hover:underline"
                    >
                      Reset password →
                    </Link>

                  </div>
                </div>
              )}

              {/* PREFERENCES */}
              {activeTab === "preferences" && (
                <div>

                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-[#031429] sm:text-2xl">
                      Preferences
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#031429]">
                      Choose what kind of club reminders
                      you'd like to receive.
                    </p>
                  </div>

                  <div className="space-y-4">

                    <div className="flex flex-col gap-4 rounded-2xl bg-zinc-950 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                      <div>
                        <h3 className="font-semibold">
                          Challenge reminders
                        </h3>

                        <p className="mt-1 text-sm text-zinc-400">
                          Get reminders about active
                          challenges and your progress.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-5 w-5 shrink-0 self-start accent-gray-50 sm:self-auto"
                      />
                    </div>

                    <div className="flex flex-col gap-4 rounded-2xl bg-zinc-950 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                      <div>
                        <h3 className="font-semibold">
                          Event reminders
                        </h3>

                        <p className="mt-1 text-sm text-zinc-400">
                          Get reminders about upcoming
                          ALX Run Club events.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-5 w-5 shrink-0 self-start accent-gray-50 sm:self-auto"
                      />
                    </div>

                    <div className="flex flex-col gap-4 rounded-2xl bg-zinc-950 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                      <div>
                        <h3 className="font-semibold">
                          Community notifications
                        </h3>

                        <p className="mt-1 text-sm text-zinc-400">
                          Stay updated with important
                          club announcements.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-5 w-5 shrink-0 self-start accent-gray-50 sm:self-auto"
                      />
                    </div>

                  </div>

                  <p className="mt-6 text-xs leading-5 text-[#031429]">
                    Notification preferences will be
                    connected to the club notification
                    system when that feature is added.
                  </p>

                </div>
              )}

              {/* ACCOUNT */}
              {activeTab === "account" && (
                <div>

                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-[#031429] sm:text-2xl">
                      Account
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#031429]">
                      Information about your ALX Run
                      Club membership.
                    </p>
                  </div>

                  <div className="space-y-4">

                    <div className="rounded-2xl bg-zinc-950 p-5">
                      <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Email address
                      </p>

                      <p className="mt-2 break-all font-semibold">
                        {user.email}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-zinc-950 p-5">
                      <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Member since
                      </p>

                      <p className="mt-2 font-semibold">
                        {new Date(
                          profile.created_at
                        ).toLocaleDateString(
                          "en-NG",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>

                  </div>

                  <div className="mt-8 border-t border-white/10 pt-8 text-[#031429]">

                    <h3 className="font-semibold">
                      Account actions
                    </h3>

                    <p className="mt-2 text-sm text-[#031429]">
                      Need to leave your account?
                    </p>

                    <Link
                      href="/dashboard"
                      className="mt-4 inline-block rounded-xl border border-zinc-200 px-5 py-3 text-sm font-semibold hover:bg-zinc-100"
                    >
                      Return to dashboard
                    </Link>

                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
