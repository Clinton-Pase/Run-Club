import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChallengeNavigation from "../components/ChallengeNavigation";

type Participant = {
  user_id: string;
  joined_at: string;
};

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

type Activity = {
  user_id: string;
  challenge_id: string;
  distance_km: number | null;
  activity_date: string | null;
};

export default async function LeaderboardPage() {
  const supabase = await createClient();

  const {
    data: authData,
    error: authError,
  } = await supabase.auth.getClaims();

  const userId = authData?.claims?.sub;

  if (authError || !userId) {
    redirect("/login");
  }

  // Get the active challenge
  const { data: challenge, error: challengeError } =
    await supabase
      .from("challenges")
      .select(
        "id, name, description, challenge_type, target_value, target_unit, scoring_method, start_date, end_date, status"
      )
      .eq("status", "active")
      .order("start_date", { ascending: false })
      .limit(1)
      .maybeSingle();

  if (challengeError) {
    console.error(
      "Leaderboard challenge error:",
      challengeError.message
    );
  }

  if (!challenge) {
    return (
      <main className="min-h-screen bg-[#031429] px-4 py-10 text-white sm:px-10">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 hover:text-white"
          >
            ← Dashboard
          </Link>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
            <h1 className="text-2xl font-bold">
              No active challenge
            </h1>

            <p className="mt-3 text-zinc-400">
              There is currently no active challenge to rank.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Get everyone who joined the challenge
  const { data: participantRows, error: participantsError } =
    await supabase
      .from("challenge_participants")
      .select("user_id, joined_at")
      .eq("challenge_id", challenge.id);

  if (participantsError) {
    console.error(
      "Leaderboard participants error:",
      participantsError.message
    );
  }

  const participants = (participantRows ?? []) as Participant[];

  // Get their profiles
  const participantIds = participants.map(
    (participant) => participant.user_id
  );

  const { data: profileRows, error: profilesError } =
    await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", participantIds);

  if (profilesError) {
    console.error(
      "Leaderboard profiles error:",
      profilesError.message
    );
  }

  const profiles = (profileRows ?? []) as Profile[];

  // Get activities for this challenge
  const { data: activityRows, error: activitiesError } =
    await supabase
      .from("challenge_activities")
      .select(
        "user_id, challenge_id, distance_km, activity_date"
      )
      .eq("challenge_id", challenge.id);

  if (activitiesError) {
    console.error(
      "Leaderboard activities error:",
      activitiesError.message
    );
  }

  const activities = (activityRows ?? []) as Activity[];

  // Calculate each participant's score
  const scores = new Map<
    string,
    {
      distance: number;
      runDays: Set<string>;
    }
  >();

  for (const participant of participants) {
    scores.set(participant.user_id, {
      distance: 0,
      runDays: new Set(),
    });
  }

  for (const activity of activities) {
    const current = scores.get(activity.user_id);

    if (!current) continue;

    current.distance += Number(activity.distance_km ?? 0);

    if (activity.activity_date) {
      current.runDays.add(activity.activity_date);
    }
  }

  const isRunDayChallenge =
    challenge.scoring_method === "run_days" ||
    challenge.target_unit.toLowerCase() === "run days";

  const leaderboard = participants
    .map((participant) => {
      const profile = profiles.find(
        (item) => item.id === participant.user_id
      );

      const score = scores.get(participant.user_id);

      const distance = score?.distance ?? 0;
      const runDays = score?.runDays.size ?? 0;

      return {
        userId: participant.user_id,
        name:
          profile?.full_name ||
          "Runner",
        avatarUrl: profile?.avatar_url ?? null,
        distance,
        runDays,
        score: isRunDayChallenge
          ? runDays
          : distance,
      };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <main className="min-h-screen bg-[#031429] px-4 py-8 text-white sm:px-10">
      <div className="mx-auto max-w-5xl">

       <ChallengeNavigation/>

          <h1 className="mt-2 text-4xl font-bold">
            Leaderboard
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            See how everyone is progressing in the current challenge.
          </p>
        </div>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                {challenge.name}
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                Target: {challenge.target_value}{" "}
                {challenge.target_unit}
              </p>
            </div>

            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              {challenge.status}
            </span>
          </div>

          <div className="mt-8 space-y-3">

            {leaderboard.length === 0 ? (
              <div className="rounded-2xl bg-white/[0.03] p-8 text-center">
                <p className="text-zinc-400">
                  Nobody has joined this challenge yet.
                </p>
              </div>
            ) : (
              leaderboard.map((runner, index) => {
                const position = index + 1;
                const isCurrentUser =
                  runner.userId === userId;

                return (
                  <div
                    key={runner.userId}
                    className={`flex items-center gap-4 rounded-2xl border p-4 ${
                      isCurrentUser
                        ? "border-orange-500/40 bg-orange-500/10"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 font-bold">
                      {position}
                    </div>

                    <div className="flex min-w-0 flex-1 items-center gap-3">

                      {runner.avatarUrl ? (
                        <img
                          src={runner.avatarUrl}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-bold">
                          {runner.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {runner.name}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-orange-400">
                              You
                            </span>
                          )}
                        </p>

                        <p className="text-xs text-zinc-500">
                          {isRunDayChallenge
                            ? `${runner.runDays} run days`
                            : `${runner.distance.toFixed(1)} km`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {isRunDayChallenge
                          ? runner.runDays
                          : runner.distance.toFixed(1)}
                      </p>

                      <p className="text-xs text-zinc-500">
                        {isRunDayChallenge
                          ? "days"
                          : "km"}
                      </p>
                    </div>
                  </div>
                );
              })
            )}

          </div>
        </section>

      </div>
    </main>
  );
}