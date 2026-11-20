"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function setMemberAdmin(
  userId: string,
  makeAdmin: boolean
) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (error || !claims?.sub) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", claims.sub)
    .maybeSingle();

  if (profileError || !profile?.is_admin) {
    redirect("/dashboard");
  }

  const { error: updateError } = await supabase.rpc(
    "set_member_admin",
    {
      target_user_id: userId,
      make_admin: makeAdmin,
    }
  );

  if (updateError) {
    throw new Error(updateError.message);
  }

  revalidatePath("/admin/members");
}