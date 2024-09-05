import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function LogOut() {
  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return (
    <form action={signOut}>
      <button>Logout</button>
    </form>
  );
}
