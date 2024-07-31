"use client";
import { Table } from "./components/Table";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/DatePicker";

export type Purchase = {
  id: string;
  date: string;
};

type Props = {
  purchases: Purchase[];
};

export default function PurchasesClient({ purchases }: Props) {
  const [filteredPurchases, setFilteredPurchases] = useState(purchases);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const { from, to } = dateRange;
      const fromDate = new Date(from);
      const toDate = new Date(to);

      const filtered = purchases.filter((purchase) => {
        const purchaseDate = new Date(purchase.date);
        return purchaseDate >= fromDate && purchaseDate <= toDate;
      });

      setFilteredPurchases(filtered);
    } else {
      setFilteredPurchases(purchases);
    }
  }, [dateRange, purchases]);
  return (
    <>
      <div className="my-10 sm:mt-6 lg:mt-10">
        <div className="flex flex-col items-right gap-y-4">
          <DateRangePicker
            enableYearNavigation
            value={dateRange}
            onChange={setDateRange}
            className="w-60"
          />
        </div>
        <div className="my-10 flex w-full flex-col items-center justify-center">
          <Table purchases={filteredPurchases} />
        </div>
      </div>
    </>
  );
}
