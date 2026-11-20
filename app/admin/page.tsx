
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (error || !claims?.sub) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, is_admin")
    .eq("id", claims.sub)
    .maybeSingle();

  if (profileError || !profile?.is_admin) {
    redirect("/dashboard");
  }

  const adminName = profile.full_name || "Administrator";

  async function signOut() {
    "use server";

    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#031429] px-5 py-10 text-white sm:px-10">
      <div className="mx-auto max-w-6xl">

        <header className="flex flex-wrap items-center justify-between gap-5 border-b border-white/10 pb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
              ALX Run Club
            </p>
            <h1 className="mt-2 text-2xl font-bold">
              Admin Dashboard
            </h1>
          </div>

          <form action={signOut}>
            <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#031429] hover:bg-red-700 hover:text-white">
              Sign out
            </button>
          </form>
        </header>

        <section className="mt-12">
          <p className="text-sm text-orange-400">
            Administrator
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            Welcome, {adminName}.
          </h2>

          <p className="mt-3 max-w-xl text-gray-300">
            Manage the ALX Run Club community, challenges and member activities.
          </p>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2">

          <Link
            href="/admin/challenges"
            className="rounded-2xl border border-orange-400/30 bg-orange-500/10 p-7 transition hover:-translate-y-1"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-400">
              Challenge management
            </p>

            <h3 className="mt-3 text-2xl font-bold">
              Manage Challenges
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-300">
              Create new challenges, publish drafts and manage existing club challenges.
            </p>

            <span className="mt-6 inline-block font-semibold text-orange-400">
              Open challenge manager →
            </span>
          </Link>

     <Link
  href="/admin/members"
  className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1"
>
  <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">
    Community management
  </p>

  <h3 className="mt-3 text-2xl font-bold">
    Members
  </h3>

  <p className="mt-3 text-sm leading-6 text-gray-300">
    View registered runners, check membership details and manage administrator access.
  </p>

  <span className="mt-6 inline-block text-sm font-semibold text-orange-400">
    View members →
  </span>
</Link>
<Link
  href="/admin/activities"
  className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1"
>
  <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">
    Activity monitoring
  </p>

  <h3 className="mt-3 text-2xl font-bold">
    Member Activities
  </h3>

  <p className="mt-3 text-sm leading-6 text-gray-300">
    Review members logged runs, distances and challenge participation.
  </p>

  <span className="mt-6 inline-block text-sm font-semibold text-orange-400">
    View activities →
  </span>
</Link>


        </section>

        <div className="mt-10">
<Link
  href="/dashboard"
  className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-orange-400/30 bg-red-700 px-5 py-3 text-sm font-bold shadow-xl transition hover:-translate-y-1 hover:bg-orange-50 text-[#031429]"
>
  <span>Member Dashboard</span>
  <span>↗</span>
</Link>
        </div>

      </div>
    </main>
  );
}
