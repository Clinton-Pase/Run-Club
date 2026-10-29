import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import ChallengeNavigation from "@/app/components/ChallengeNavigation";
import RunClubMarquee from "@/app/components/RunClubMarquee";


type LogActivityPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LogActivityPage({
  params,
}: LogActivityPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.getClaims();

  const userId = authData?.claims?.sub;

  if (authError || !userId) {
    redirect("/login");
  }

  const { data: challenge, error: challengeError } =
    await supabase
      .from("challenges")
      .select(
      "id, name, target_unit, scoring_method, start_date, end_date, status"
      )
      .eq("id", id)
      .maybeSingle();

  if (challengeError || !challenge) {
    notFound();
  }

  const { data: participation, error: participationError } =
    await supabase
      .from("challenge_participants")
      .select("id")
      .eq("challenge_id", challenge.id)
      .eq("user_id", userId)
      .maybeSingle();

  if (participationError) {
    console.error(
      "Activity membership lookup error:",
      participationError
    );

    throw new Error("Unable to verify challenge membership.");
  }

  if (!participation) {
    redirect(`/challenges/${challenge.id}`);
  }
const unit = (challenge.target_unit ?? "").trim().toLowerCase();

const supportsDistance =
  unit === "km" ||
  unit === "kilometer" ||
  unit === "kilometers";

const isRunDaysChallenge =
  challenge.scoring_method === "run_days";

  async function logActivity(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const { data: authData, error: authError } =
      await supabase.auth.getClaims();

    const userId = authData?.claims?.sub;

    if (authError || !userId) {
      redirect("/login");
    }

    const distanceInput = formData.get("distance_km");
    const dateInput = formData.get("activity_date");
    const noteInput = formData.get("note");

    const distanceKm = Number(distanceInput);
    const activityDate =
      typeof dateInput === "string" ? dateInput : "";
    const note =
      typeof noteInput === "string" ? noteInput.trim() : "";

    if (
      typeof distanceInput !== "string" ||
      !Number.isFinite(distanceKm) ||
      distanceKm <= 0 ||
      distanceKm > 300 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(activityDate) ||
      note.length > 500
    ) {
      throw new Error("Please enter valid activity details.");
    }

    const { data: currentChallenge, error: currentChallengeError } =
      await supabase
        .from("challenges")
        .select("id, name, challenge_type, target_unit, scoring_method, start_date, end_date, status")
        .eq("id", id)
        .maybeSingle();

    if (currentChallengeError || !currentChallenge) {
      throw new Error("Challenge not found.");
    }

  const currentUnit = (
  currentChallenge.target_unit ?? ""
).trim().toLowerCase();

const supportsDistance =
  currentUnit === "km" ||
  currentUnit === "kilometer" ||
  currentUnit === "kilometers";

const isRunDaysChallenge =
  currentChallenge.scoring_method === "run_days";

if (!supportsDistance && !isRunDaysChallenge) {
  throw new Error(
    "Activity logging is not supported for this challenge."
  );
}

   if (
  currentChallenge.status !== "active" ||
  activityDate < currentChallenge.start_date ||
  activityDate > currentChallenge.end_date
) {
      throw new Error(
        "The activity date must fall within an active challenge period."
      );
    }

    const { data: membership, error: membershipError } =
      await supabase
        .from("challenge_participants")
        .select("id")
        .eq("challenge_id", id)
        .eq("user_id", userId)
        .maybeSingle();

    if (membershipError || !membership) {
      throw new Error("You must join this challenge before logging activity.");
    }

    const { error: insertError } = await supabase
      .from("challenge_activities")
      .insert({
        challenge_id: id,
        user_id: userId,
        activity_date: activityDate,
        distance_km: distanceKm,
        note: note || null,
      });

    if (insertError) {
      console.error("Activity insert error:", insertError);
      throw new Error("Unable to save your activity.");
    }

    revalidatePath(`/challenges/${id}`);
    revalidatePath(`/challenges/${id}/log`);

    redirect(`/challenges/${id}`);
  }

  return (
    <main className="relative min-h-screen bg-[#031429] px-5 py-10 pb-34 text-white sm:px-10">
      <div className="mx-auto max-w-2xl">
       <ChallengeNavigation />
        <section className="mt-8 rounded-3xl border border-white/10 bg-zinc-50 p-7 sm:p-10">
          <p className="text-lg font-semibold text-[#031429]">
            Log your activity
          </p>

          <h1 className="mt-3 text-3xl text-[#031429] font-bold">
            {challenge.name}
          </h1>

          {supportsDistance || isRunDaysChallenge ? (
            <>
              <p className="mt-2 text-sm text-[#031429]">
                {isRunDaysChallenge
                  ? "Record your run. Each unique running day counts toward your challenge progress."
                  : "Record the distance you covered. Your saved activities will contribute to your challenge progress."}
              </p>

              <form action={logActivity} className="mt-8 space-y-6">
                <div>
                  <label
                    htmlFor="distance_km"
                    className="mb-2 block text-sm font-medium text-[#031429]"
                  >
                    Distance covered (km)
                  </label>

                  <input
                    id="distance_km"
                    name="distance_km"
                    type="number"
                    min="0.01"
                    max="300"
                    step="0.01"
                    required
                    className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-zinc-50 outline-none focus:border-red-800"
                    placeholder="e.g. 5.5"
                  />
                </div>

                <div>
                  <label
                    htmlFor="activity_date"
                    className="mb-2 block text-sm font-medium text-[#031429]"
                  >
                    Activity date
                  </label>

                  <input
                    id="activity_date"
                    name="activity_date"
                    type="date"
                    min={challenge.start_date}
                    max={challenge.end_date}
                    required
                    defaultValue={new Date().toLocaleDateString("en-CA")}
                    className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-zinc-300 outline-none focus:border-red-800"
                  />
                </div>

                <div>
                  <label
                    htmlFor="note"
                    className="mb-2 block text-sm font-medium text-[#031429]"
                  >
                    Note (optional)
                  </label>

                  <textarea
                    id="note"
                    name="note"
                    rows={3}
                    maxLength={500}
                    className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-800"
                    placeholder="How did your run go?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#031429] px-5 py-4 font-bold text-white hover:bg-red-700"
                >
                  Save activity
                </button>
              </form>
            </>
          ) : (
            <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-950 p-5">
              <p className="font-semibold">
                Distance logging isn't available for this challenge yet.
              </p>

              <p className="mt-2 text-sm text-zinc-400">
                This challenge uses a different target unit. We'll add
                the appropriate activity form when we implement that
                challenge type.
              </p>
            </div>
          )}
        </section>
      </div>

      <div className="absolute bottom-0 left-0 w-full min-w-0">
        <RunClubMarquee />
      </div>
    </main>
  );
}