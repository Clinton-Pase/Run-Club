import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CreateChallengeForm from "./CreateChallengeForm";
import {
  publishChallenge,
  unpublishChallenge,
} from "./action";

export default async function AdminChallengesPage() {
  const supabase = await createClient();

  const { data, error: authError } =
    await supabase.auth.getClaims();

  const claims = data?.claims;

  if (authError || !claims?.sub) {
    redirect("/login");
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", claims.sub)
      .maybeSingle();

  if (profileError || !profile?.is_admin) {
    redirect("/dashboard");
  }

  const { data: challenges, error } = await supabase
    .from("challenges")
    .select(
      "id, name, description, challenge_type, target_value, target_unit, scoring_method, start_date, end_date, status, badge_name"
    )
    .order("start_date", { ascending: false });

  if (error) {
    throw new Error("Unable to load challenges.");
  }

  return (
    <main className="min-h-screen bg-[#031429] px-5 py-10 text-white sm:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between">
          <div>
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-orange-400"
            >
              ← Member dashboard
            </Link>

            <h1 className="mt-4 text-3xl font-bold">
              Challenge Manager
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Create and manage ALX Run Club challenges.
            </p>
          </div>
        </header>

        <div className="mt-8">
  <CreateChallengeForm />
</div>

        <section className="mt-10">
          {challenges?.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-zinc-900 p-8">
              <p className="text-zinc-400">
                No challenges have been created yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {challenges?.map((challenge) => (
                <article
                  key={challenge.id}
                  className="rounded-2xl border border-white/10 bg-zinc-900 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">
                        {challenge.challenge_type.replace(
                          "_",
                          " "
                        )}
                      </p>

                      <h2 className="mt-2 text-xl font-bold">
                        {challenge.name}
                      </h2>
                    </div>

                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs capitalize">
                      {challenge.status}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-zinc-400">
                    {challenge.description}
                  </p>

                  {challenge.target_value && (
                    <div className="mt-5">
                      <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Target
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        {challenge.target_value}{" "}
                        {challenge.target_unit}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-zinc-500">Starts</p>
                      <p className="mt-1">
                        {new Date(
                          challenge.start_date
                        ).toLocaleDateString("en-NG")}
                      </p>
                    </div>

                    <div>
                      <p className="text-zinc-500">Ends</p>
                      <p className="mt-1">
                        {new Date(
                          challenge.end_date
                        ).toLocaleDateString("en-NG")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-5">
                    <p className="text-xs text-zinc-500">
                      Scoring
                    </p>

                    <p className="mt-1 text-sm capitalize">
                      {challenge.scoring_method.replace(
                        "_",
                        " "
                      )}
                    </p>
                  </div>
                  <div className="mt-6 flex gap-3">
  {challenge.status === "draft" && (
    <form action={publishChallenge.bind(null, challenge.id)}>
      <button
        type="submit"
        className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold hover:bg-orange-600"
      >
        Publish
      </button>
    </form>
  )}

  {challenge.status === "upcoming" && (
    <form action={unpublishChallenge.bind(null, challenge.id)}>
      <button
        type="submit"
        className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/5"
      >
        Unpublish
      </button>
    </form>
  )}
</div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}