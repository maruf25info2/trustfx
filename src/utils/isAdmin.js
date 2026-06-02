import { supabase } from "../lib/supabase";

export async function isAdmin() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    return false;
  }

  return true;
}