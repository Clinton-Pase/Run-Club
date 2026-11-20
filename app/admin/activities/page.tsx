
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminActivitiesPage() {
  const supabase = await createClient();

  const { data, error: authError } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (authError || !claims?.sub) {
    redirect("/login");
  }

  const { data: admin, error: adminError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", claims.sub)
    .maybeSingle();

  if (adminError || !admin?.is_admin) {
    redirect("/dashboard");
  }

  const { data: activities, error } = await supabase
    .from("challenge_activities")
    .select(
      "id, user_id, challenge_id, activity_date, distance_km, note, created_at"
    )
    .order("activity_date", { ascending: false });

  if (error) {
    throw new Error("Unable to load member activities.");
  }

  const userIds = [...new Set(
    (activities ?? []).map((activity) => activity.user_id)
  )];

  const challengeIds = [...new Set(
    (activities ?? []).map((activity) => activity.challenge_id)
  )];

  const { data: profiles } = userIds.length
    ? await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds)
    : { data: [] };

  const { data: challenges } = challengeIds.length
    ? await supabase
        .from("challenges")
        .select("id, name")
        .in("id", challengeIds)
    : { data: [] };

  const profileMap = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile.full_name])
  );

  const challengeMap = new Map(
    (challenges ?? []).map((challenge) => [challenge.id, challenge.name])
  );

  return (
    <main className="min-h-screen bg-[#031429] px-5 py-10 text-white sm:px-10">
      <div className="mx-auto max-w-6xl">
        <header>
          <Link
            href="/admin"
            className="text-sm font-semibold text-orange-400"
          >
            ← Admin dashboard
          </Link>

          <h1 className="mt-5 text-3xl font-bold">
            Activity Oversight
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Review running activities logged by club members.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">Total activities logged</p>
          <h2 className="mt-2 text-4xl font-bold">
            {activities?.length ?? 0}
          </h2>
        </section>

        <section className="mt-8">
          {!activities?.length ? (
            <div className="rounded-2xl border border-white/10 bg-zinc-900 p-8">
              <p className="text-zinc-400">
                No activities have been logged yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-zinc-900 text-xs uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th className="px-6 py-4">Member</th>
                    <th className="px-6 py-4">Challenge</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Distance</th>
                    <th className="px-6 py-4">Note</th>
                  </tr>
                </thead>

                <tbody>
                  {activities.map((activity) => (
                    <tr
                      key={activity.id}
                      className="border-t border-white/10"
                    >
                      <td className="px-6 py-5 font-semibold">
                        {profileMap.get(activity.user_id) || "Unknown member"}
                      </td>

                      <td className="px-6 py-5 text-sm text-orange-400">
                        {challengeMap.get(activity.challenge_id) || "Unknown challenge"}
                      </td>

                      <td className="px-6 py-5 text-sm text-zinc-400">
                        {new Date(
                          `${activity.activity_date}T00:00:00`
                        ).toLocaleDateString("en-NG")}
                      </td>

                      <td className="px-6 py-5 font-semibold">
                        {activity.distance_km} km
                      </td>

                      <td className="px-6 py-5 text-sm text-zinc-400">
                        {activity.note || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <Link
        href="/dashboard"
        className="fixed bottom-6 right-6 z-50 rounded-full bg-orange-500 px-5 py-3 text-sm font-bold text-[#031429] shadow-xl transition hover:-translate-y-1 hover:bg-orange-400"
      >
        Member Dashboard ↗
      </Link>
    </main>
  );
}
