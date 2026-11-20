
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { setMemberAdmin } from "./action";

export default async function AdminMembersPage() {
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

  const { data: members, error } = await supabase
    .from("profiles")
    .select("id, full_name, created_at, is_admin")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Unable to load members.");
  }

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
            Members Management
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            View and manage registered ALX Run Club members.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">
            Total registered members
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {members?.length ?? 0}
          </h2>
        </section>

        <section className="mt-8">
          {members?.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-zinc-900 p-8">
              <p className="text-zinc-400">
                No members found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full min-w-[600px] text-left">
                <thead className="bg-zinc-900 text-xs uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th className="px-6 py-4">Member</th>
                    <th className="px-6 py-4">Date joined</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {members?.map((member) => (
                    <tr
                      key={member.id}
                      className="border-t border-white/10 bg-[#031429]"
                    >
                      <td className="px-6 py-5 font-semibold">
                        {member.full_name || "Unnamed member"}
                      </td>

                      <td className="px-6 py-5 text-sm text-zinc-400">
                        {new Date(member.created_at).toLocaleDateString(
                          "en-NG"
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            member.is_admin
                              ? "bg-orange-500/15 text-orange-400"
                              : "bg-green-500/15 text-green-400"
                          }`}
                        >
                          {member.is_admin ? "Admin" : "Member"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
  {member.id !== claims.sub && (
    <form
      action={setMemberAdmin.bind(
        null,
        member.id,
        !member.is_admin
      )}
    >
      <button
        type="submit"
        className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
          member.is_admin
            ? "bg-red-500/15 text-red-400 hover:bg-red-500/25"
            : "bg-orange-500/15 text-orange-400 hover:bg-orange-500/25"
        }`}
      >
        {member.is_admin ? "Remove Admin" : "Make Admin"}
      </button>
    </form>
  )}
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
