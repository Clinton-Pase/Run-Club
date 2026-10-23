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
    <main className="min-h-screen bg-[#031429] px-5 py-10 text-white sm:px-10">
      <div className="mx-auto max-w-6xl">
        <header>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-gray-50 hover:underline"
          >
            ← Dashboard
          </Link>


          <h1 className="mt-5 text-4xl font-bold">
            Challenges
          </h1>

          <p className="mt-3 max-w-2xl text-gray-50">
            Push yourself, stay consistent, and run with the
            community. Choose a challenge and start making
            progress.
          </p>
        </header>

        <section className="mt-12">
          {challenges?.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-gray-50 p-8">
              <h2 className="text-xl font-semibold">
                No active challenges yet
              </h2>

              <p className="mt-2 text-sm text-gray-50">
                New challenges will appear here when the club
                opens them.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {challenges?.map((challenge) => (
                <article
                  key={challenge.id}
                  className="flex flex-col rounded-2xl border border-white/10 bg-gray-50 p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold capitalize text-gray-50">
                      {challenge.challenge_type.replace(
                        "_",
                        " "
                      )}
                    </span>

                    <span className="text-xs capitalize text-[#031429]">
                      {challenge.status}
                    </span>
                  </div>

                  <h2 className="mt-5 text-2xl text-[#031429] font-bold">
                    {challenge.name}
                  </h2>

                  <p className="mt-3 flex-1 text-sm leading-6 text-[#031429]">
                    {challenge.description}
                  </p>

                  {challenge.target_value && (
                    <div className="mt-6 rounded-xl bg-zinc-950 p-4">
                      <p className="text-xs uppercase tracking-wider text-zinc-50">
                        Target
                      </p>

                      <p className="mt-1 text-2xl font-bold">
                        {challenge.target_value}{" "}
                        <span className="text-sm font-medium text-zinc-50">
                          {challenge.target_unit}
                        </span>
                      </p>
                    </div>
                  )}

                  <div className="mt-5 flex justify-between text-sm">
                    <div>
                      <p className="text-xs font-medium text-[#031429]">
                        Starts
                      </p>

                      <p className="mt-1 font-medium text-[#031429]">
                        {new Date(
                          challenge.start_date
                        ).toLocaleDateString("en-NG")}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-medium text-[#031429]">
                        Ends
                      </p>

                      <p className="mt-1 font-medium text-[#031429]">
                        {new Date(
                          challenge.end_date
                        ).toLocaleDateString("en-NG")}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/challenges/${challenge.id}`}
                    className="mt-6 rounded-lg bg-zinc-900 px-4 py-3 text-center text-sm font-bold text-zinc-50 hover:bg-red-800"
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