import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChallengeNavigation from "@/app/components/ChallengeNavigation";

type Achievement = {
  id: string;
  name: string;
  description: string | null;
  badge_name: string | null;
  badge_description: string | null;
  completed_at: string | null;
};

export default async function AchievementsPage() {
  const supabase = await createClient();

  const {
    data: { claims },
    error: authError,
  } = await supabase.auth.getClaims();

  if (authError || !claims?.sub) {
    redirect("/login");
  }

  const userId = claims.sub;

  const { data: achievements, error } = await supabase
    .from("challenge_participants")
    .select(
      `
        id,
        completed_at,
        challenge:challenges(
          id,
          name,
          description,
          badge_name,
          badge_description
        )
      `
    )
    .eq("user_id", userId)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false });

  if (error) {
    console.error("Error loading achievements:", error.message);
  }

  const completedChallenges = (achievements ?? [])
    .filter((item) => item.challenge)
    .map((item) => ({
      id: item.id,
      name: item.challenge.name,
      description: item.challenge.description,
      badge_name: item.challenge.badge_name,
      badge_description: item.challenge.badge_description,
      completed_at: item.completed_at,
    }));

  return (
    <main className="min-h-screen bg-[#031429] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
         <ChallengeNavigation/>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Achievements
          </h1>

          <p className="mt-2 max-w-2xl text-slate-400">
            Celebrate the challenges you have completed and the milestones
            you have earned along the way.
          </p>
        </header>

        <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-zinc/10 bg-white p-6">
            <p className="text-sm text-[#031429]">
              Challenges completed
            </p>

            <p className="mt-3 text-4xl font-bold text-green-400">
              {completedChallenges.length}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc/10 bg-white p-6">
            <p className="text-sm text-[#031429]">
              Badges earned
            </p>

            <p className="mt-3 text-4xl font-bold text-green-400">
              {
                completedChallenges.filter(
                  (challenge) => challenge.badge_name
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-zinc/10 bg-white p-6">
            <p className="text-sm text-[#031429]">
              Next goal
            </p>

            <p className="mt-3 text-lg text-[#031429] font-bold">
              Keep running
            </p>

            <p className="mt-1 text-sm text-[#031429]">
              Complete more challenges to earn recognition.
            </p>
          </div>
        </section>

        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold sm:text-2xl">
              Your Achievements
            </h2>

            <p className="mt-1 text-sm text-white">
              Challenges you have successfully completed.
            </p>
          </div>

          {completedChallenges.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-red/55 bg-white px-6 py-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-3xl">
                🏆
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#031429] sm:text-xl">
                Your first achievement is waiting
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#031429]">
                Complete a challenge to earn your first badge and see it
                appear here.
              </p>

              <Link
                href="/challenges"
                className="mt-6 inline-flex rounded-xl bg-zinc-950 px-5 py-3 font-semibold text-white transition hover:bg-red-800"
              >
                Browse Challenges
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {completedChallenges.map((achievement) => (
                <article
                  key={achievement.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400/10 text-2xl">
                    🏆
                  </div>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    Achievement
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    {achievement.badge_name ||
                      achievement.name}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {achievement.badge_description ||
                      achievement.description ||
                      "Challenge completed."}
                  </p>

                  {achievement.completed_at && (
                    <p className="mt-5 text-xs text-slate-500">
                      Completed{" "}
                      {new Date(
                        achievement.completed_at
                      ).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}

                  <Link
                    href={`/challenges/${achievement.id}`}
                    className="mt-5 inline-flex text-sm font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    View challenge →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}