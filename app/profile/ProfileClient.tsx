
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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

  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const [fullName, setFullName] = useState(
    profile.full_name ?? ""
  );
  const [avatarUrl, setAvatarUrl] = useState(
    profile.avatar_url ?? ""
  );

  const [newPassword, setNewPassword] = useState("");
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
        throw new Error("Please enter your full name.");
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

      setMessage("Profile updated successfully.");
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

  return (
    <main className="min-h-screen bg-[#031429] px-5 py-10 text-white sm:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-gray-50 hover:underline"
          >
            ← Back to Dashboard
          </Link>

          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <Link
              href="/dashboard"
              className="text-zinc-300 hover:text-gray-50"
            >
              Dashboard
            </Link>

            <Link
              href="/challenges"
              className="text-zinc-300 hover:text-gray-50"
            >
              Challenges
            </Link>

            <Link
              href="/progress"
              className="text-zinc-300 hover:text-gray-50"
            >
              My Progress
            </Link>

            <Link
              href="/achievements"
              className="text-zinc-300 hover:text-gray-50"
            >
              Achievements
            </Link>

            <Link
              href="/events"
              className="text-zinc-300 hover:text-gray-50"
            >
              Events
            </Link>
          </nav>
        </header>

        <section className="mt-10">
          <div>

            <h1 className="mt-2 text-4xl font-bold">
              My Profile
            </h1>

            <p className="mt-3 max-w-xl text-zinc-400">
              Manage your member information, security,
              preferences and account.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-gray-50">
            <div className="flex overflow-x-auto border-b border-white/10">
              <button
                type="button"
                onClick={() =>
                  switchTab("profile")
                }
                className={`whitespace-nowrap px-6 py-4 text-[1rem] font-semibold ${
                  activeTab === "profile"
                    ? "border-b-2 border-[#000] text-[#031429]"
                    : "text-zinc-900 hover:text-zinc-900"
                }`}
              >
                Profile
              </button>

              <button
                type="button"
                onClick={() =>
                  switchTab("security")
                }
                className={`whitespace-nowrap px-6 py-4 text-sm font-semibold ${
                  activeTab === "security"
                    ? "border-b-2 border-[#000] text-[#031429]"
                    : "text-zinc-900 hover:text-zinc-900"
                }`}
              >
                Security
              </button>

              <button
                type="button"
                onClick={() =>
                  switchTab("preferences")
                }
                className={`whitespace-nowrap px-6 py-4 text-sm font-semibold ${
                  activeTab === "preferences"
                    ? "border-b-2 border-[#000] text-[#031429]"
                    : "text-zinc-900 hover:text-zinc-900"
                }`}
              >
                Preferences
              </button>

              <button
                type="button"
                onClick={() =>
                  switchTab("account")
                }
                className={`whitespace-nowrap px-6 py-4 text-sm font-semibold ${
                  activeTab === "account"
                    ? "border-b-2 border-[#000] text-[#031429]"
                    : "text-zinc-900 hover:text-zinc-900"
                }`}
              >
                Account
              </button>
            </div>

            <div className="p-6 sm:p-8">
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

              {activeTab === "profile" && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl text-[#031429] font-bold">
                      Personal information
                    </h2>

                    <p className="mt-2 text-sm text-[#031429]">
                      Update the information other club
                      members can associate with you.
                    </p>
                  </div>

                  <div className="mb-8 flex items-center gap-4">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="h-16 w-16 rounded-full border border-white/10 object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#031429] text-xl font-bold text-white">
                        {(
                          fullName ||
                          user.email ||
                          "R"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div>
                      <p className="font-semibold text-[#031429]">
                        {fullName ||
                          "Your name"}
                      </p>

                      <p className="text-sm text-[#031429]  ">
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
                        className="mb-2 block text-sm text-[#031429] font-medium"
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
                        className="mb-2 block text-sm text-[#031429] font-medium"
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
                      className="rounded-xl bg-[#031429] px-5 py-3 font-semibold text-white hover:bg-zinc-950 disabled:opacity-60"
                    >
                      {loading
                        ? "Saving..."
                        : "Save changes"}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "security" && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl text-[#031429] font-bold">
                      Security
                    </h2>

                    <p className="mt-2 text-sm text-[#031429]">
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
                        className="mb-2 block text-sm text-[#031429] font-medium"
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
                        className="mb-2 block text-sm text-[#031429] font-medium"
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
                      className="rounded-xl bg-[#031429] px-5 py-3 font-semibold text-white hover:bg-zinc-950 disabled:opacity-60"
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

                    <p className="mt-2 text-sm text-[#031429]">
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

              {activeTab === "preferences" && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl text-[#031429] font-bold">
                      Preferences
                    </h2>

                    <p className="mt-2 text-sm text-[#031429]">
                      Choose what kind of club reminders
                      you'd like to receive.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-6 rounded-2xl bg-zinc-950 p-5">
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
                        className="h-5 w-5 accent-gray-50"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-6 rounded-2xl bg-zinc-950 p-5">
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
                        className="h-5 w-5 accent-gray-50"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-6 rounded-2xl bg-zinc-950 p-5">
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
                        className="h-5 w-5 accent-gray-50"
                      />
                    </div>
                  </div>

                  <p className="mt-6 text-xs text-[#031429]">
                    Notification preferences will be
                    connected to the club notification
                    system when that feature is added.
                  </p>
                </div>
              )}

              {activeTab === "account" && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl text-[#031429] font-bold">
                      Account
                    </h2>

                    <p className="mt-2 text-sm text-[#031429]">
                      Information about your ALX Run
                      Club membership.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl bg-zinc-950 p-5">
                      <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Email address
                      </p>

                      <p className="mt-2 font-semibold">
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

                  <div className="mt-8 border-t text-[#031429] border-white/10 pt-8">
                    <h3 className="font-semibold">
                      Account actions
                    </h3>

                    <p className="mt-2 text-sm text-[#031429]">
                      Need to leave your account?
                    </p>

                    <Link
                      href="/dashboard"
                      className="mt-4 inline-block rounded-xl border border-zinc/10 px-5 py-3 text-sm font-semibold hover:bg-white/5"
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
