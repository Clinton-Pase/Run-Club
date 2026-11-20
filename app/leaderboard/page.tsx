
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChallengeNavigation from "../components/ChallengeNavigation";
import RunClubMarquee from "@/app/components/RunClubMarquee";

type LeaderboardRunner = {
    user_id: string;
    full_name: string;
    avatar_url: string | null;
    total_distance: number;
    run_days: number;
    score: number;
    rank_position: number;
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

        return (
            <main className="min-h-screen bg-[#031429] px-4 py-10 text-white">
                <div className="mx-auto max-w-5xl">
                    <ChallengeNavigation />

                    <div className="mt-10 rounded-2xl border border-red-400/20 bg-red-400/10 p-8 text-center">
                        <h1 className="text-xl font-bold">
                            Unable to load challenge
                        </h1>

                        <p className="mt-3 text-zinc-300">
                            Please try again later.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (!challenge) {
        return (
            <main className="min-h-screen bg-[#031429] px-4 py-10 text-white sm:px-10">
                <div className="mx-auto max-w-5xl">
                    <ChallengeNavigation />

                    <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
                        <h1 className="text-2xl font-bold">
                            No active challenge
                        </h1>

                        <p className="mt-3 text-zinc-400">
                            There is currently no active challenge to rank.
                        </p>

                        <Link
                            href="/dashboard"
                            className="mt-5 inline-block text-sm text-green-400 hover:text-green-300"
                        >
                            ← Back to dashboard
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const isDistanceChallenge =
        challenge.scoring_method === "total_distance";

    const isRunDayChallenge =
        challenge.scoring_method === "run_days";

    const isSupportedChallenge =
        isDistanceChallenge || isRunDayChallenge;

    let leaderboard: LeaderboardRunner[] = [];
    let leaderboardError: string | null = null;

    if (isSupportedChallenge) {
        const {
            data: leaderboardData,
            error: leaderboardRpcError,
        } = await supabase.rpc(
            "get_challenge_leaderboard",
            {
                target_challenge_id: challenge.id,
            }
        );

        if (leaderboardRpcError) {
            console.error(
                "Leaderboard RPC error:",
                leaderboardRpcError.message
            );

            leaderboardError = leaderboardRpcError.message;
        } else {
            leaderboard = (
                leaderboardData ?? []
            ) as unknown as LeaderboardRunner[];
        }
    }

    return (
        <main className="relative min-h-screen bg-[#031429] px-4 py-8 pb-32 text-white sm:px-6 lg:px-10">
            <div className="mx-auto max-w-5xl">
                <ChallengeNavigation />

                <h1 className="mt-2 text-4xl font-bold">
                    Leaderboard
                </h1>

                <p className="mt-3 max-w-2xl text-zinc-50">
                    See how everyone is progressing in the current challenge.
                </p>

                <section className="mt-8 rounded-3xl border border-white/10 bg-white p-6 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-[#031429]">
                                {challenge.name}
                            </h2>

                            <p className="mt-2 text-sm text-[#031429]">
                                Target: {challenge.target_value}{" "}
                                {challenge.target_unit}
                            </p>
                        </div>

                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-green-600">
                            {challenge.status}
                        </span>
                    </div>

                    <div className="mt-8 space-y-3">
                        {!isSupportedChallenge ? (
                            <div className="rounded-2xl bg-amber-50 p-8 text-center">
                                <p className="font-semibold text-amber-800">
                                    Leaderboard scoring unavailable
                                </p>

                                <p className="mt-2 text-sm text-amber-700">
                                    This challenge uses a scoring method that
                                    has not been implemented yet.
                                </p>
                            </div>
                        ) : leaderboardError ? (
                            <div className="rounded-2xl bg-red-50 p-8 text-center">
                                <p className="font-semibold text-red-800">
                                    Leaderboard unavailable
                                </p>

                                <p className="mt-2 text-sm text-red-700">
                                    Please try again later. If the problem
                                    persists, contact an administrator.
                                </p>
                            </div>
                        ) : leaderboard.length === 0 ? (
                            <div className="rounded-2xl bg-[#031429] p-8 text-center">
                                <p className="text-zinc-300">
                                    Nobody has joined this challenge yet.
                                </p>
                            </div>
                        ) : (
                            leaderboard.map((runner) => {
                                const isCurrentUser =
                                    runner.user_id === userId;

                                const distance = Number(
                                    runner.total_distance ?? 0
                                );

                                const runDays = Number(
                                    runner.run_days ?? 0
                                );

                                return (
                                    <div
                                        key={runner.user_id}
                                        className={`flex items-center gap-4 rounded-2xl border p-4 ${
                                            isCurrentUser
                                                ? "border-zinc-500/40 bg-zinc-900"
                                                : "border-white/10 bg-[#031429]"
                                        }`}
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white font-bold text-[#031429]">
                                            {runner.rank_position}
                                        </div>

                                        <div className="flex min-w-0 flex-1 items-center gap-3">
                                            {runner.avatar_url ? (
                                                <img
                                                    src={runner.avatar_url}
                                                    alt=""
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 font-bold">
                                                    {runner.full_name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <p className="truncate font-semibold">
                                                    {runner.full_name}

                                                    {isCurrentUser && (
                                                        <span className="ml-2 text-xs text-green-500">
                                                            You
                                                        </span>
                                                    )}
                                                </p>

                                                <p className="text-xs text-green-50">
                                                    {isRunDayChallenge
                                                        ? `${runDays} run days`
                                                        : `${distance.toFixed(1)} km`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-lg font-bold">
                                                {isRunDayChallenge
                                                    ? runDays
                                                    : distance.toFixed(1)}
                                            </p>

                                            <p className="text-xs text-green-500">
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

            <div className="absolute bottom-0 left-0 w-full min-w-0 overflow-hidden">
                <RunClubMarquee />
            </div>
        </main>
    );
}

















