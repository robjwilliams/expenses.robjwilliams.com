"use client";
import { Card } from "@/components/Card";
import { DateRangePicker } from "@/components/DatePicker";
import { getPurchaseSummary } from "@/supabase/queries";
import { createClient } from "@/utils/supabase/client";
import { BarList } from "@tremor/react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

type Item = {
  code: number;
  description: string;
  total_amount: number;
};

type Props = {
  summary: Item[];
  initialDateRange: DateRange;
};

export default function OverviewClient({ summary, initialDateRange }: Props) {
  const supabase = createClient();
  const [filteredSummary, setFilteredSummary] = useState(summary);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialDateRange
  );
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const updatePurchaseSummary = async (from: Date, to: Date) => {
      const summary = await getPurchaseSummary(
        supabase,
        from.toISOString().split("T")[0],
        to.toISOString().split("T")[0]
      );
      setFilteredSummary(summary);
    };

    if (dateRange && dateRange.from && dateRange.to) {
      const fromDate = dateRange.from;
      const toDate = dateRange.to;
      updatePurchaseSummary(fromDate, toDate);
    }
  }, [dateRange, supabase]);

  const filteredData = filteredSummary.filter((item) =>
    item.description.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <>
      <div className="my-10 sm:mt-6 lg:mt-10">
        <div className="flex flex-col items-right gap-y-4">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            className="w-60"
          />
          <input
            type="text"
            placeholder="Filter by text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-60 p-2 border border-gray-300 rounded"
          />
        </div>
        <Card className="mx-auto w-full mt-10">
          <BarList
            data={filteredData
              .filter((item) => item.total_amount < 200)
              .map((item) => ({
                name: item.description,
                value: item.total_amount,
              }))}
            color="blue"
          />
        </Card>
      </div>
    </>
  );
}
