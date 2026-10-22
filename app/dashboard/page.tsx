
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Alx from "../components/assets/alxlogo.png";
import Image from "next/image";

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
          <Image
            src={Alx}
            alt="ALX Run Club"
            className="h-10 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-orange-400"
          >
            Dashboard
          </Link>

          <Link
            href="/challenges"
            className="text-sm font-semibold text-white hover:text-orange-400"
          >
            Challenges
          </Link>

          <Link
            href="/progress"
            className="text-sm font-semibold text-white hover:text-orange-400"
          >
            My Progress
          </Link>

          <Link
            href="/achievements"
            className="text-sm font-semibold text-white hover:text-orange-400"
          >
            Achievements
          </Link>

          <Link
            href="/events"
            className="text-sm font-semibold text-white hover:text-orange-400"
          >
            Events
          </Link>

          <Link
            href="/profile"
            className="text-sm font-semibold text-white hover:text-orange-400"
          >
            Profile
          </Link>
        </nav>

        <form action={signOut}>
          <button className="rounded-lg border border-white/15 bg-white px-4 py-2 text-sm text-[#031429] hover:bg-red-800 hover:text-white">
            Sign out
          </button>
        </form>
      </header>

      <section className="mx-auto mt-16 max-w-5xl">
        <h1 className="mt-3 text-4xl font-bold">
          Welcome, {fullName}.
        </h1>

        <p className="mt-3 max-w-xl text-gray-50">
          Your next run starts here. Stay connected with the ALX Run Club
          community and keep showing up.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-[#031429]">
              Upcoming runs
            </h2>

            <p className="mt-2 text-sm text-[#031429]">
              Your upcoming club events can appear here once we connect the
              dashboard to your events data.
            </p>

            <Link
              href="/events"
              className="mt-5 inline-block font-semibold text-[#031429] hover:text-zinc-950"
            >
              Explore club events →
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-[#031429]">
              Your profile
            </h2>

            <p className="mt-2 text-sm text-[#031429]">
              {user.email ?? "Authenticated member"}
            </p>

            <p className="mt-3 text-sm text-[#031429]">
              Member since{" "}
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString("en-NG")
                : "—"}
            </p>

            <Link
              href="/profile"
              className="mt-5 inline-block font-semibold text-[#031429] hover:text-zinc-950"
            >
              View profile →
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <Link
            href="/challenges"
            className="rounded-2xl border border-white/10 bg-gray-50 p-6 transition hover:-translate-y-1"
          >
            <h2 className="text-xl font-semibold text-[#031429]">
              Challenges
            </h2>

            <p className="mt-2 text-sm text-[#031429]">
              Join monthly challenges, track your progress and climb the
              scoreboard.
            </p>

            <span className="mt-5 inline-block font-semibold text-[#031429]">
              Explore challenges →
            </span>
          </Link>

          <Link
            href="/progress"
            className="rounded-2xl border border-white/10 bg-gray-50 p-6 transition hover:-translate-y-1"
          >
            <h2 className="text-xl font-semibold text-[#031429]">
              My Progress
            </h2>

            <p className="mt-2 text-sm text-[#031429]">
              See your running activity and challenge progress in one place.
            </p>

            <span className="mt-5 inline-block font-semibold text-[#031429]">
              View progress →
            </span>
          </Link>

          <Link
            href="/achievements"
            className="rounded-2xl border border-white/10 bg-gray-50 p-6 transition hover:-translate-y-1"
          >
            <h2 className="text-xl font-semibold text-[#031429]">
              Achievements
            </h2>

            <p className="mt-2 text-sm text-[#031429]">
              Keep track of badges and milestones you've earned.
            </p>

            <span className="mt-5 inline-block font-semibold text-[#031429]">
              View achievements →
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
