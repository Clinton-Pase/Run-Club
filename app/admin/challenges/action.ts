"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
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

  return supabase;
}

export async function publishChallenge(challengeId: string) {
  const supabase = await requireAdmin();

  const { data, error } = await supabase
    .from("challenges")
    .update({
      status: "upcoming",
    })
    .eq("id", challengeId)
    .select("id, status")
    .single();

  if (error) {
    console.error("Publish challenge error:", error);
    throw new Error(
      `Could not publish challenge: ${error.message}`
    );
  }

  console.log("Challenge published:", data);

  revalidatePath("/admin/challenges");
  revalidatePath("/dashboard");
}

export async function unpublishChallenge(
  challengeId: string
) {
  const supabase = await requireAdmin();

  const { data, error } = await supabase
    .from("challenges")
    .update({
      status: "draft",
    })
    .eq("id", challengeId)
    .select("id, status")
    .single();

  if (error) {
    console.error("Unpublish challenge error:", error);
    throw new Error(
      `Could not unpublish challenge: ${error.message}`
    );
  }

  console.log("Challenge unpublished:", data);

  revalidatePath("/admin/challenges");
  revalidatePath("/dashboard");
}

export async function createChallenge(formData: FormData) {
  const supabase = await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const challengeType = String(
    formData.get("challenge_type") ?? ""
  );

  const targetValueRaw = String(
    formData.get("target_value") ?? ""
  );

  const targetUnit = String(
    formData.get("target_unit") ?? ""
  ).trim();

  const scoringMethod = String(
    formData.get("scoring_method") ?? ""
  );

  const startDate = String(
    formData.get("start_date") ?? ""
  );

  const endDate = String(
    formData.get("end_date") ?? ""
  );

  const badgeName = String(
    formData.get("badge_name") ?? ""
  ).trim();

  const badgeDescription = String(
    formData.get("badge_description") ?? ""
  ).trim();

  if (
    !name ||
    !challengeType ||
    !scoringMethod ||
    !startDate ||
    !endDate
  ) {
    throw new Error("Please complete all required fields.");
  }

  if (endDate < startDate) {
    throw new Error(
      "The challenge end date cannot be before the start date."
    );
  }

  const targetValue = targetValueRaw
    ? Number(targetValueRaw)
    : null;

  if (
    targetValue !== null &&
    (!Number.isFinite(targetValue) || targetValue <= 0)
  ) {
    throw new Error("Target must be greater than zero.");
  }

  const { error } = await supabase
    .from("challenges")
    .insert({
      name,
      description: description || null,
      challenge_type: challengeType,
      target_value: targetValue,
      target_unit: targetUnit || null,
      scoring_method: scoringMethod,
      start_date: startDate,
      end_date: endDate,
      status: "draft",
      badge_name: badgeName || null,
      badge_description: badgeDescription || null,
    });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/challenges");
}