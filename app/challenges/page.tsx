import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ChallengesPage() {
  const supabase = await createClient();

  const { data, error: authError } =
    await supabase.auth.getClaims();

  const claims = data?.claims;

  if (authError || !claims?.sub) {
    redirect("/login");
  }

  const { data: challenges, error } = await supabase
    .from("challenges")
    .select(
      "id, name, description, challenge_type, target_value, target_unit, scoring_method, start_date, end_date, status, badge_name"
    )
    .in("status", ["upcoming", "active"])
    .order("start_date", { ascending: true });

  if (error) {
    throw new Error("Unable to load challenges.");
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-10 text-white sm:px-10">
      <div className="mx-auto max-w-6xl">
        <header>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-orange-400 hover:underline"
          >
            ← Dashboard
          </Link>

          <p className="mt-10 text-sm font-semibold uppercase tracking-widest text-orange-400">
            ALX Run Club
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Challenges
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Push yourself, stay consistent, and run with the
            community. Choose a challenge and start making
            progress.
          </p>
        </header>

        <section className="mt-12">
          {challenges?.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-zinc-900 p-8">
              <h2 className="text-xl font-semibold">
                No active challenges yet
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                New challenges will appear here when the club
                opens them.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {challenges?.map((challenge) => (
                <article
                  key={challenge.id}
                  className="flex flex-col rounded-2xl border border-white/10 bg-zinc-900 p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold capitalize text-orange-400">
                      {challenge.challenge_type.replace(
                        "_",
                        " "
                      )}
                    </span>

                    <span className="text-xs capitalize text-zinc-500">
                      {challenge.status}
                    </span>
                  </div>

                  <h2 className="mt-5 text-2xl font-bold">
                    {challenge.name}
                  </h2>

                  <p className="mt-3 flex-1 text-sm leading-6 text-zinc-400">
                    {challenge.description}
                  </p>

                  {challenge.target_value && (
                    <div className="mt-6 rounded-xl bg-zinc-950 p-4">
                      <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Target
                      </p>

                      <p className="mt-1 text-2xl font-bold">
                        {challenge.target_value}{" "}
                        <span className="text-sm font-medium text-zinc-400">
                          {challenge.target_unit}
                        </span>
                      </p>
                    </div>
                  )}

                  <div className="mt-5 flex justify-between text-sm">
                    <div>
                      <p className="text-xs text-zinc-500">
                        Starts
                      </p>

                      <p className="mt-1">
                        {new Date(
                          challenge.start_date
                        ).toLocaleDateString("en-NG")}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-zinc-500">
                        Ends
                      </p>

                      <p className="mt-1">
                        {new Date(
                          challenge.end_date
                        ).toLocaleDateString("en-NG")}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/challenges/${challenge.id}`}
                    className="mt-6 rounded-lg bg-white px-4 py-3 text-center text-sm font-bold text-zinc-950 hover:bg-zinc-200"
                  >
                    View challenge
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