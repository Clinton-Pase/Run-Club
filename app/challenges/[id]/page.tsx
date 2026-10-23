

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChallengeNavigation from "@/app/components/ChallengeNavigation";

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
            .select("id, joined_at, completed_at")
            .eq("challenge_id", challenge.id)
            .eq("user_id", claims.sub)
            .maybeSingle();

    if (participationError) {
        console.error("Participation lookup error:", participationError);
    }

    const unit = (challenge.target_unit ?? "").trim().toLowerCase();

    const supportsDistance =
        unit === "km" ||
        unit === "kilometer" ||
        unit === "kilometers";

    let totalDistance = 0;

    if (participation && supportsDistance) {
        const { data: activities, error: activitiesError } =
            await supabase
                .from("challenge_activities")
                .select("distance_km")
                .eq("challenge_id", challenge.id)
                .eq("user_id", claims.sub);

        if (activitiesError) {
            console.error("Activity lookup error:", activitiesError);
        } else {
            totalDistance = (activities ?? []).reduce(
                (total, activity) => total + Number(activity.distance_km),
                0
            );
        }
    }

    const target = Number(challenge.target_value ?? 0);

    const progressPercentage =
        target > 0
            ? Math.min((totalDistance / target) * 100, 100)
            : 0;

    return (
        <main className="min-h-screen bg-[#031429] px-5 py-10 text-white sm:px-10">
            <div className="mx-auto max-w-4xl">

    <ChallengeNavigation />

                <section className="mt-10 rounded-3xl border border-white/10 bg-zinc-50 p-7 sm:p-10">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <span className="rounded-full bg-zinc-900 px-3 py-2 text-xs font-semibold capitalize text-orange-50">
                            {challenge.challenge_type.replace(
                                "_",
                                " "
                            )}
                        </span>

                        <span className="text-sm capitalize text-[#031429]">
                            {challenge.status}
                        </span>
                    </div>

                    <h1 className="mt-6 text-4xl text-[#031429] font-bold">
                        {challenge.name}
                    </h1>

                    <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-900">
                        {challenge.description}
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl bg-zinc-950 p-5">
                            <p className="text-xs uppercase tracking-wider text-red-700">
                                Target
                            </p>

                            <p className="mt-2 text-2xl font-bold">
                                {challenge.target_value ?? "—"}{" "}
                                <span className="text-sm font-medium text-zinc-50">
                                    {challenge.target_unit ?? ""}
                                </span>
                            </p>
                        </div>

                        <div className="rounded-2xl bg-zinc-950 p-5">
                            <p className="text-xs uppercase tracking-wider text-red-700">
                                Starts
                            </p>

                            <p className="mt-2 font-semibold">
                                {new Date(
                                    challenge.start_date
                                ).toLocaleDateString("en-NG")}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-zinc-950 p-5">
                            <p className="text-xs uppercase tracking-wider text-red-700">
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
                        <div className="mt-8 rounded-2xl border border-zinc-500/60 bg-red-700 p-6">
                            <p className="text-sm font-semibold text-orange-50">
                                You are in this challenge
                            </p>

                            <p className="mt-2 text-sm text-zinc-50">
                                You joined on{" "}
                                {new Date(participation.joined_at).toLocaleDateString("en-NG")}.
                            </p>

                            {supportsDistance ? (
                                <div className="mt-6">
                                    <div className="flex items-center justify-between gap-4 text-sm">
                                        <span className="text-zinc-50">Your progress</span>
                                        <span className="font-semibold text-zinc-50">
                                            {totalDistance.toFixed(2)} km / {target} km
                                        </span>
                                    </div>

                                    <div
                                        className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-800"
                                        role="progressbar"
                                        aria-label="Challenge progress"
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-valuenow={Math.round(progressPercentage)}
                                    >
                                        <div
                                            className="h-full rounded-full bg-orange-500 transition-all"
                                            style={{ width: `${progressPercentage}%` }}
                                        />
                                    </div>

                                    <p className="mt-2 text-sm text-zinc-400">
                                        {progressPercentage.toFixed(0)}% of your target
                                    </p>

                                    {challenge.status === "active" && (
                                        <Link href={`/challenges/${challenge.id}/log`}
                                            className="mt-6 block w-full rounded-xl bg-orange-500 px-5 py-4 text-center font-bold text-white hover:bg-orange-600"
                                        >
                                            Log Activity
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <p className="mt-4 text-sm text-zinc-50">
                                    Activity tracking for this challenge type is coming next.
                                </p>
                            )}

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
                                } =
                                    await supabase.auth.getClaims();

                                const userId = authData?.claims?.sub;

                                if (authError || !userId) {
                                    redirect("/login");
                                }

                                const { error } = await supabase
                                    .from("challenge_participants")
                                    .insert({
                                        challenge_id: challenge.id,
                                        user_id: userId,
                                    });

                                if (error) {
                                    throw new Error(
                                        "Unable to join this challenge."
                                    );
                                }

                                redirect(
                                    `/challenges/${challenge.id}`
                                );
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
                        <h2 className="text-xl text-[#031429] font-bold">
                            Challenge rules
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-[#031429] font-semibold">
                            Your ranking is calculated using{" "}
                            <span className="text-[#031429] font-semibold">
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