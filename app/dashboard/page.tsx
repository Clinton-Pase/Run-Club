import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, created_at")
    .eq("id", user.id)
    .maybeSingle();

  const fullName =
    profile?.full_name?.trim() ||
    user.user_metadata?.full_name?.trim() ||
    user.user_metadata?.name?.trim() ||
    user.email?.split("@")[0] ||
    "Runner";

  async function signOut() {
    "use server";

    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#031429] px-5 py-10 text-white sm:px-10">
      <header className="mx-auto flex max-w-5xl items-center justify-between">
        <Link
          href="/"
          className="font-bold uppercase tracking-wider text-orange-400"
        >
          ALX Run Club
        </Link>

        <form action={signOut}>
          <button className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/5">
zs            Sign out
          </button>
        </form>
      </header>

      <section className="mx-auto mt-16 max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
          Member dashboard
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Welcome, {fullName}.
        </h1>

        <p className="mt-3 max-w-xl text-zinc-400">
          Your next run starts here. Stay connected with the ALX Run Club
          community and keep showing up.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
            <h2 className="text-xl font-semibold">Upcoming runs</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Your upcoming club events can appear here once we connect the
              dashboard to your events data.
            </p>
            <Link
              href="/#events"
              className="mt-5 inline-block font-semibold text-orange-400"
            >
              Explore club events →
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
            <h2 className="text-xl font-semibold">Your profile</h2>
            <p className="mt-2 text-sm text-zinc-400">
              {user.email ?? "Authenticated member"}
            </p>
            <p className="mt-3 text-sm text-zinc-500">
              Member since{" "}
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString("en-NG")
                : "—"}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}