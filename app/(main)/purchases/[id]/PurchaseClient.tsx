"use client";
import { Card } from "@/components/Card";
import { Table } from "./components/Table";
import { useState, useMemo } from "react";
import { DonutChart } from "@/components/ui/DonutChar";
import { CategoryDonutChart } from "../CategoryDonutChart";

type Item = {
  id: string;
  code: string;
  category: string;
  description: string;
  price: number;
  amount: number;
  date: string;
};
type Props = {
  items: Item[];
};

type SortConfig = {
  key: keyof Props["items"][0];
  direction: "ascending" | "descending";
};

export default function PurchaseClient({ items }: Props) {
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [value, setValue] = useState("");

  const onValueChange = (value: string) => {
    setValue(value);
  };

  const requestSort = (key: keyof Props["items"][0]) => {
    let direction: SortConfig["direction"] = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = useMemo(() => {
    let sortableItems = [...filteredItems];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredItems, sortConfig]);

  const pricePerCategory = filteredItems.reduce((acc, item) => {
    const categoryIndex = acc.findIndex(
      (entry) => entry.name === item.category
    );
    if (categoryIndex > -1) {
      acc[categoryIndex].amount += item.price * item.amount;
    } else {
      acc.push({ name: item.category, amount: item.price * item.amount });
    }
    return acc;
  }, [] as { name: string; amount: number }[]);

  const itemsPerCategory = filteredItems
    .filter((item) => item.category === value)
    .map((item) => ({
      name: item.description,
      amount: item.price * item.amount,
    }));

  return (
    <>
      <div className="my-10 sm:mt-6 lg:mt-10">
        <div className="flex flex-col items-right gap-y-4"></div>
        <div className="my-10 flex w-full flex-col">
          <div className="w-full flex flex-row gap-5 items-center mb-10">
            <Card className="max-w-xl">
              <h3>Categories</h3>
              <CategoryDonutChart
                items={pricePerCategory.sort((a, b) => b.amount - a.amount)}
                value={value}
                onValueChange={onValueChange}
              />
            </Card>
            <Card className="max-w-xl">
              <h3>Items per category</h3>
              <CategoryDonutChart items={itemsPerCategory} />
            </Card>
          </div>
          <Table
            items={sortedItems}
            requestSort={requestSort}
            sortConfig={sortConfig}
          />
        </div>
      </div>
    </>
  );
}
