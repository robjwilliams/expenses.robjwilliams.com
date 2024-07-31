import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return data.user;
}
