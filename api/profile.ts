import { supabase } from "@/lib/supabase";
import { Profile } from "@/utils/types";

// Falls back to zeroed defaults when a customer row doesn't exist yet —
// place_order() creates one automatically on first order, so a brand new
// signed-up user simply hasn't placed one yet.
const DEFAULT_PROFILE: Profile = {
  points: 0,
  creditBalance: 0,
  creditLimit: 1000,
};

export async function fetchProfile(): Promise<Profile> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return DEFAULT_PROFILE;

  const { data, error } = await supabase
    .from("customers")
    .select("points, credit_balance, credit_limit")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return DEFAULT_PROFILE;

  return {
    points: data.points ?? 0,
    creditBalance: Number(data.credit_balance ?? 0),
    creditLimit: Number(data.credit_limit ?? DEFAULT_PROFILE.creditLimit),
  };
}
