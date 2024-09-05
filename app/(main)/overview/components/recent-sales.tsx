"use client";

import { useState, useMemo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

type SaleItem = {
  item_code: string;
  item_description: string;
  total_items: number;
  total_spent: number;
  category: string;
};

type SortField = keyof SaleItem;

type Props = {
  data: SaleItem[];
};

export function RecentSales({ data }: Props) {
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("item_code");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredAndSortedSales = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data
      .filter(
        (item) =>
          item.item_description.toLowerCase().includes(filter.toLowerCase()) ||
          item.item_code.includes(filter)
      )
      .sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [data, filter, sortField, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (!data || data.length === 0) {
    return <div>No data available.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Filter by description or item code"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={sortField}
          onValueChange={(value) => setSortField(value as SortField)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item_code">Item Code</SelectItem>
            <SelectItem value="item_description">Description</SelectItem>
            <SelectItem value="total_items">Total Items</SelectItem>
            <SelectItem value="total_spent">Total Spent</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={toggleSortOrder} variant="outline">
          {sortOrder === "asc" ? "Ascending" : "Descending"}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-8">
        {filteredAndSortedSales.map((item) => (
          <div key={item.item_code} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{item.category[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1 flex-grow">
              <p className="text-sm font-medium leading-none">
                {item.item_description}
              </p>
              <p className="text-sm text-muted-foreground">
                Code: {item.item_code}
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                {item.category}
              </p>
            </div>
            <div className="ml-4 space-y-1 flex-grow"></div>
            <div className="text-sm text-muted-foreground mr-4">
              Qty: {item.total_items}
            </div>
            <div className="font-medium">${item.total_spent.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
