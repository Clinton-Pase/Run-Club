
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileClient from "./ProfileClient";

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
    .select("id, full_name, avatar_url, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Unable to load profile:", profileError.message);
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#031429] px-5 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold">
            Profile unavailable
          </h1>
          <p className="mt-3 text-zinc-400">
            We couldn't find your profile. Please try again or contact support.
          </p>
          <a
            href="/dashboard"
            className="mt-6 inline-block rounded-xl bg-orange-50 px-5 py-3 font-semibold"
          >
            Return to Dashboard
          </a>
        </div>
      </main>
    );
  }

  return (
    <ProfileClient
      user={{
        id: user.id,
        email: user.email ?? "",
      }}
      profile={{
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        created_at: profile.created_at,
      }}
    />
  );
}
