import { getPurchaseSummary } from "@/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import OverviewClient from "./OverviewClient";

function getCurrentMonthDateRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return {
    from: start.toISOString().split("T")[0],
    to: end.toISOString().split("T")[0],
  };
}

export default async function Overview() {
  const supabase = createClient();
  const { from, to } = getCurrentMonthDateRange();
  const [summary] = await Promise.all([getPurchaseSummary(supabase, from, to)]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <>
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        Overview
      </h1>
      <OverviewClient
        summary={summary}
        initialDateRange={{ from: new Date(from), to: new Date(to) }}
      />
    </>
  );
}
