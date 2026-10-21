import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type ChallengePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ChallengePage({
  params,
}: ChallengePageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data, error: authError } =
    await supabase.auth.getClaims();

  const claims = data?.claims;

  if (authError || !claims?.sub) {
    redirect("/login");
  }

  const { data: challenge, error } = await supabase
    .from("challenges")
    .select(
      "id, name, description, challenge_type, target_value, target_unit, scoring_method, start_date, end_date, status, badge_name, badge_description"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !challenge) {
    notFound();
  }
const { data: participation, error: participationError } =
  await supabase
    .from("challenge_participants")
    .select("*")
    .eq("challenge_id", challenge.id)
    .eq("user_id", claims.sub)
    .maybeSingle();

if (participationError) {
  console.error(
    "Participation lookup error:",
    participationError
  );
}
  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-10 text-white sm:px-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/challenges"
          className="text-sm font-semibold text-orange-400 hover:underline"
        >
          ← Back to challenges
        </Link>

        <section className="mt-10 rounded-3xl border border-white/10 bg-zinc-900 p-7 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold capitalize text-orange-400">
              {challenge.challenge_type.replace(
                "_",
                " "
              )}
            </span>

            <span className="text-sm capitalize text-zinc-500">
              {challenge.status}
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-bold">
            {challenge.name}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            {challenge.description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-zinc-950 p-5">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Target
              </p>

              <p className="mt-2 text-2xl font-bold">
                {challenge.target_value ?? "—"}{" "}
                <span className="text-sm font-medium text-zinc-400">
                  {challenge.target_unit ?? ""}
                </span>
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-950 p-5">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Starts
              </p>

              <p className="mt-2 font-semibold">
                {new Date(
                  challenge.start_date
                ).toLocaleDateString("en-NG")}
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-950 p-5">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Ends
              </p>

              <p className="mt-2 font-semibold">
                {new Date(
                  challenge.end_date
                ).toLocaleDateString("en-NG")}
              </p>
            </div>
          </div>

{participation ? (
  <div className="mt-8 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6">
    <p className="text-sm font-semibold text-orange-400">
      You're in this challenge
    </p>

    <p className="mt-2 text-sm text-zinc-400">
      You joined this challenge on{" "}
      {new Date(participation.joined_at).toLocaleDateString(
        "en-NG"
      )}
      .
    </p>

    {participation.completed_at && (
      <p className="mt-4 text-sm font-semibold text-green-400">
        Challenge completed 🎉
      </p>
    )}
  </div>
          ) : (
           
<form
  action={async () => {
    "use server";

    const supabase = await createClient();

    const {
      data: authData,
      error: authError,
    } = await supabase.auth.getClaims();

    const userId = authData?.claims?.sub;

    if (authError || !userId) {
      redirect("/login");
    }

    const { data: existingParticipation, error: lookupError } =
      await supabase
        .from("challenge_participants")
        .select("id")
        .eq("challenge_id", challenge.id)
        .eq("user_id", userId)
        .maybeSingle();

    if (lookupError) {
      console.error("Membership lookup error:", lookupError);
      throw new Error("Unable to check your challenge membership.");
    }

    if (!existingParticipation) {
      const { error: insertError } = await supabase
        .from("challenge_participants")
        .insert({
          challenge_id: challenge.id,
          user_id: userId,
        });

      if (insertError) {
        console.error("Join challenge error:", insertError);
        throw new Error(
          `Unable to join this challenge: ${insertError.message}`
        );
      }
    }

    redirect(`/challenges/${challenge.id}`);
  }}
  className="mt-8"
>
  <button
    type="submit"
    disabled={challenge.status === "completed"}
    className="w-full rounded-xl bg-orange-500 px-5 py-4 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {challenge.status === "completed"
      ? "Challenge completed"
      : "Join challenge"}
  </button>
</form>

          )}

          <div className="mt-8 border-t border-white/10 pt-8">
            <h2 className="text-xl font-bold">
              Challenge rules
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Your ranking is calculated using{" "}
              <span className="text-white">
                {challenge.scoring_method.replace(
                  "_",
                  " "
                )}
              </span>
              .
            </p>

            {challenge.badge_name && (
              <div className="mt-6 rounded-2xl bg-zinc-950 p-5">
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Achievement
                </p>

                <h3 className="mt-2 font-bold">
                  {challenge.badge_name}
                </h3>

                {challenge.badge_description && (
                  <p className="mt-2 text-sm text-zinc-400">
                    {challenge.badge_description}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}