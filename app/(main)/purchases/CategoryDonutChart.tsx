"use client";

import React from "react";
import {
  DonutChart,
  DonutChartEventProps,
} from "../../../components/ui/DonutChar";
import { Legend } from "@tremor/react";
import { chartColors } from "@/lib/chartUtils";

type Props = {
  items: { name: string; amount: number }[];
  value?: string;
  onValueChange?: (value: string) => void;
  legend?: boolean;
};

export const CategoryDonutChart = ({
  items,
  value,
  onValueChange = () => {},
  legend = false,
}: Props) => {
  const chartColors: (
    | "blue"
    | "emerald"
    | "violet"
    | "amber"
    | "gray"
    | "cyan"
    | "pink"
  )[] = ["blue", "emerald", "violet", "amber", "gray", "cyan", "pink"];

  return (
    <>
      <div className="min-w-xl grid grid-cols-2">
        <DonutChart
          className="mx-auto"
          colors={chartColors}
          data={items}
          category="name"
          value="amount"
          showLabel={true}
          valueFormatter={(number: number) =>
            `$${Intl.NumberFormat("us").format(number).toString()}`
          }
          onValueChange={(v) => onValueChange(v?.name.toString() ?? "")}
        />

        {legend && (
          <div className="text-left text-xs">
            <Legend
              categories={items.map((item) => item.name)}
              colors={chartColors}
              className="h-auto w-auto"
            />
          </div>
        )}
      </div>
    </>
  );
};
