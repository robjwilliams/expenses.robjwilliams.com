import { Metadata } from "next";
import OverviewClient from "./OverviewClient";
import {
  getCategoryBreakdown,
  getPurchaseSummary,
  getSpendingByDay,
  getTotalAmountSpent,
} from "@/supabase/queries";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

function getCurrentMonthDateRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 2);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return {
    from: start.toISOString().split("T")[0],
    to: end.toISOString().split("T")[0],
  };
}

export default async function DashboardPage() {
  const supabase = createClient();
  const initialDate = getCurrentMonthDateRange();
  const { from, to } = initialDate;
  const date = {
    from: new Date(from),
    to: new Date(to),
  };
  const [summary, total, categoryBreakdown, spendingByDay] = await Promise.all([
    getPurchaseSummary(supabase, initialDate.from, initialDate.to),
    getTotalAmountSpent(supabase, initialDate.from, initialDate.to),
    getCategoryBreakdown(supabase, initialDate.from, initialDate.to),
    getSpendingByDay(supabase, initialDate.from, initialDate.to),
  ]);

  return (
    <>
      <OverviewClient
        initialDate={date}
        initialSummary={summary}
        initialTotal={total}
        initialCategoryBreakdown={categoryBreakdown}
        initialSpendingByDay={spendingByDay}
      />
    </>
  );
}
