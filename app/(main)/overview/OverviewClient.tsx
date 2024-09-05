"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Overview } from "./components/overview";
import { RecentSales } from "./components/recent-sales";
import { DateRange } from "react-day-picker";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  getCategoryBreakdown,
  getPurchaseSummary,
  getSpendingByDay,
  getTotalAmountSpent,
} from "@/supabase/queries";

type Props = {
  initialDate: DateRange;
  initialSummary: [];
  initialTotal: number;
  initialCategoryBreakdown: CategoryBreakdown[];
  initialSpendingByDay: SpendingByDay[];
};

type CategoryBreakdown = {
  category: string;
  total_amount: number;
};

type SpendingByDay = {
  day_of_week: string;
  total_spent: number;
};

export default function OverviewClient({
  initialDate,
  initialSummary,
  initialTotal,
  initialCategoryBreakdown,
  initialSpendingByDay,
}: Props) {
  const [date, setDate] = useState<DateRange | undefined>(initialDate);
  const supabase = createClient();
  const [filteredSummary, setFilteredSummary] = useState(initialSummary);
  const [total, setTotal] = useState(initialTotal);
  const [fileteredCategoryBreakdown, setFileteredCategoryBreakdown] = useState<
    CategoryBreakdown[]
  >(initialCategoryBreakdown);
  const [filteredSpendingByDay, setFilteredSpendingByDay] =
    useState<SpendingByDay[]>(initialSpendingByDay);

  useEffect(() => {
    const updatePurchaseSummary = async (from: Date, to: Date) => {
      const { from: f, to: t } = {
        from: from.toISOString().split("T")[0],
        to: to.toISOString().split("T")[0],
      };
      const [summary, totalSpent, categoryBreakdown, spendingByDay] =
        await Promise.all([
          getPurchaseSummary(supabase, f, t),
          getTotalAmountSpent(supabase, f, t),
          getCategoryBreakdown(supabase, f, t),
          getSpendingByDay(supabase, f, t),
        ]);
      setFilteredSummary(summary);
      setTotal(totalSpent);
      setFileteredCategoryBreakdown(categoryBreakdown);
      setFilteredSpendingByDay(spendingByDay);
    };

    if (date && date.from && date.to) {
      const fromDate = date.from;
      const toDate = date.to;
      updatePurchaseSummary(fromDate, toDate);
    }
  }, [date, supabase]);

  console.log(filteredSpendingByDay);

  return (
    <>
      <div className="flex md:flex-col flex-row">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker date={date} onChange={setDate} />
              <Button disabled>Download</Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Spent
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${total}</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month (TODO)
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Top expense (
                      {fileteredCategoryBreakdown.length
                        ? fileteredCategoryBreakdown[0].category
                        : "NA"}
                      )
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      $
                      {fileteredCategoryBreakdown.length
                        ? fileteredCategoryBreakdown[0].total_amount
                        : 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +180.1% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview
                      data={filteredSpendingByDay.map((i) => ({
                        name: i.day_of_week,
                        total: i.total_spent,
                      }))}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview
                      data={fileteredCategoryBreakdown.map((i) => ({
                        name: i.category,
                        total: i.total_amount,
                      }))}
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Purchase items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RecentSales data={filteredSummary} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
