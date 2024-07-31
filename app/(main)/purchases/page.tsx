import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getPurchases } from "@/supabase/queries";
import PurchasesClient from "./PurchasesClient";

export default async function PurchasesPage() {
  const supabase = createClient();
  const [purchases] = await Promise.all([getPurchases(supabase)]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <>
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        Purchases
      </h1>
      {purchases ? (
        <PurchasesClient purchases={purchases} />
      ) : (
        <p>No purchases</p>
      )}
    </>
  );
}
