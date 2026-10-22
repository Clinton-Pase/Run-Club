
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, created_at, updated_at")
    .eq("id", user.id)
    .single();

  async function updateProfile(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      redirect("/login");
    }

    const fullName = String(formData.get("full_name") ?? "").trim();
    const avatarUrl = String(formData.get("avatar_url") ?? "").trim();

    if (!fullName) {
      redirect("/profile?error=name");
    }

    if (
      avatarUrl &&
      !/^https?:\/\/\S+$/i.test(avatarUrl)
    ) {
      redirect("/profile?error=avatar");
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Profile update failed:", error.message);
      redirect("/profile?error=save");
    }

    redirect("/profile?success=updated");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            ← Back to Dashboard
          </Link>

          <span className="text-sm font-semibold text-gray-500">
            ALX Run Club
          </span>
        </header>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-medium text-gray-500">
              Your account
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              My Profile
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Keep your member details up to date.
            </p>
          </div>

          {profileError || !profile ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              We couldn't load your profile. Please check your profile
              record and Supabase access policies.
            </div>
          ) : (
            <>
              <div className="mb-8 flex items-center gap-4">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="h-16 w-16 rounded-full border border-gray-200 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-600">
                    {(profile.full_name || user.email || "A")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold">
                    {profile.full_name || "Add your name"}
                  </h2>
                  <p className="break-all text-sm text-gray-500">
                    {user.email}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Member since{" "}
                    {new Date(profile.created_at).toLocaleDateString(
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

              <div className="mb-6 border-t border-gray-100 pt-6">
                <h2 className="text-lg font-semibold">
                  Edit your details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your email address is managed by your account.
                </p>
              </div>

              <form action={updateProfile} className="space-y-5">
                <div>
                  <label
                    htmlFor="full_name"
                    className="mb-2 block text-sm font-medium"
                  >
                    Full name
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    defaultValue={profile.full_name ?? ""}
                    required
                    maxLength={100}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="avatar_url"
                    className="mb-2 block text-sm font-medium"
                  >
                    Profile picture URL
                  </label>
                  <input
                    id="avatar_url"
                    name="avatar_url"
                    type="url"
                    defaultValue={profile.avatar_url ?? ""}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
                    placeholder="https://example.com/your-photo.jpg"
                  />
                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    Optional. Paste a publicly accessible image URL.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 sm:w-auto"
                >
                  Save Changes
                </button>
              </form>
            </>
          )}
        </section>

        <p className="mt-5 text-center text-xs text-gray-500">
          Your profile details help other members recognise you in the club.
        </p>
      </div>
    </main>
  );
}
