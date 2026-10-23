
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

type Challenge = {
  id: string;
  name: string;
  description: string | null;
  challenge_type: string;
  target_value: number;
  target_unit: string;
  start_date: string;
  end_date: string;
  status: string;
  badge_name: string | null;
};

type Participant = {
  id: string;
  joined_at: string;
  completed_at: string | null;
  challenge: Challenge | null;
};

type Activity = {
  challenge_id: string;
  distance_km: number | null;
};

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isDistanceChallenge(challenge: Challenge) {
  return ["km", "kilometer", "kilometers"].includes(
    challenge.target_unit.toLowerCase()
  );
}

function getStatusLabel(status: string) {
  switch (status) {
    case "active":
      return "Active";
    case "upcoming":
      return "Upcoming";
    case "completed":
      return "Completed";
    default:
      return status;
  }
}

export default async function ProgressPage() {
  const supabase = await createClient();

  const {
    data: { claims },
    error: authError,
  } = await supabase.auth.getClaims();

  if (authError || !claims?.sub) {
    redirect("/login");
  }

  const userId = claims.sub;

  const { data: participantRows, error: participantsError } = await supabase
    .from("challenge_participants")
    .select("id, joined_at, completed_at, challenge:challenges(id, name, description, challenge_type, target_value, target_unit, start_date, end_date, status, badge_name)")
    .eq("user_id", userId)
    .order("joined_at", { ascending: false });

  if (participantsError) {
    console.error("Error loading joined challenges:", participantsError.message);
  }

  const participants = (participantRows ?? []) as unknown as Participant[];

  const { data: activityRows, error: activitiesError } = await supabase
    .from("challenge_activities")
    .select("challenge_id, distance_km")
    .eq("user_id", userId);

  if (activitiesError) {
    console.error("Error loading activities:", activitiesError.message);
  }

  const activities = (activityRows ?? []) as Activity[];

  const distanceByChallenge = new Map<string, number>();

  for (const activity of activities) {
    if (activity.distance_km !== null) {
      const previous = distanceByChallenge.get(activity.challenge_id) ?? 0;
      distanceByChallenge.set(
        activity.challenge_id,
        previous + Number(activity.distance_km)
      );
    }
  }

  const totalDistance = activities.reduce(
    (total, activity) => total + Number(activity.distance_km ?? 0),
    0
  );

  const joinedChallenges = participants
    .map((participant) => ({
      ...participant,
      challenge: participant.challenge,
    }))
    .filter(
      (participant): participant is Participant & { challenge: Challenge } =>
        participant.challenge !== null
    );

  const activeChallenges = joinedChallenges.filter(
    (participant) => participant.challenge.status === "active"
  ).length;

  return (
    <main className="min-h-screen bg-[#031429] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="mb-4 inline-flex text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            ALX Run Club
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            My Progress
          </h1>

          <p className="mt-2 max-w-2xl text-slate-400">
            Track your running, follow your challenges, and keep building
            consistency one run at a time.
          </p>
        </div>

        <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">Total distance logged</p>
            <p className="mt-3 text-4xl font-bold text-cyan-400">
              {totalDistance.toFixed(1)}
              <span className="ml-2 text-base font-medium text-slate-400">
                km
              </span>
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Across your recorded challenge activities
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">Challenges joined</p>
            <p className="mt-3 text-4xl font-bold">
              {joinedChallenges.length}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Your running commitments
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">Active challenges</p>
            <p className="mt-3 text-4xl font-bold text-emerald-400">
              {activeChallenges}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Challenges currently in progress
            </p>
          </div>
        </section>

        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                Your Challenges
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Your progress for each challenge you have joined.
              </p>
            </div>

            <Link
              href="/challenges"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
            >
              Browse Challenges
            </Link>
          </div>

          {joinedChallenges.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-12 text-center">
              <h3 className="text-lg font-semibold">
                Your running journey starts here
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                You haven&apos;t joined a challenge yet. Find one that fits
                your goals and start tracking your progress.
              </p>
              <Link
                href="/challenges"
                className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-[#031429] transition hover:bg-cyan-300"
              >
                Explore Challenges
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {joinedChallenges.map(({ id, joined_at, challenge }) => {
                const distanceChallenge = isDistanceChallenge(challenge);
                const loggedDistance =
                  distanceByChallenge.get(challenge.id) ?? 0;

                const progress = distanceChallenge
                  ? challenge.target_value > 0
                    ? Math.min(
                        100,
                        (loggedDistance / challenge.target_value) * 100
                      )
                    : 0
                  : 0;

                return (
                  <article
                    key={id}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold">
                          {challenge.name}
                        </h3>
                        {challenge.badge_name && (
                          <p className="mt-1 text-sm text-cyan-400">
                            {challenge.badge_name}
                          </p>
                        )}
                      </div>

                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold capitalize text-slate-300">
                        {getStatusLabel(challenge.status)}
                      </span>
                    </div>

                    {challenge.description && (
                      <p className="mt-4 text-sm leading-6 text-slate-400">
                        {challenge.description}
                      </p>
                    )}

                    <div className="mt-5 space-y-2 text-sm text-slate-400">
                      <p>
                        <span className="text-slate-500">Target:</span>{" "}
                        {challenge.target_value} {challenge.target_unit}
                      </p>
                      <p>
                        <span className="text-slate-500">Start:</span>{" "}
                        {formatDate(challenge.start_date)}
                      </p>
                      <p>
                        <span className="text-slate-500">End:</span>{" "}
                        {formatDate(challenge.end_date)}
                      </p>
                      <p>
                        <span className="text-slate-500">Joined:</span>{" "}
                        {formatDate(joined_at)}
                      </p>
                    </div>

                    {distanceChallenge ? (
                      <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                          <span className="text-slate-400">
                            Distance logged
                          </span>
                          <span className="font-semibold text-white">
                            {loggedDistance.toFixed(1)} /{" "}
                            {challenge.target_value} km
                          </span>
                        </div>

                        <div
                          className="h-2.5 overflow-hidden rounded-full bg-white/10"
                          role="progressbar"
                          aria-valuenow={Math.round(progress)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${challenge.name} progress`}
                        >
                          <div
                            className="h-full rounded-full bg-cyan-400 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        <p className="mt-2 text-xs text-slate-500">
                          {Math.round(progress)}% of your distance target
                        </p>
                      </div>
                    ) : (
                      <p className="mt-5 rounded-xl bg-white/[0.03] p-3 text-sm text-slate-400">
                        Progress tracking for this challenge type is not
                        available yet.
                      </p>
                    )}

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href={`/challenges/${challenge.id}`}
                        className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10"
                      >
                        View Challenge
                      </Link>

                      {distanceChallenge && challenge.status === "active" && (
                        <Link
                          href={`/challenges/${challenge.id}/log`}
                          className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-[#031429] transition hover:bg-cyan-300"
                        >
                          Log Activity
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
