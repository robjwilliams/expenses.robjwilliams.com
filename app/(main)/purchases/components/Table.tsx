"use client";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { RiEyeLine } from "@remixicon/react";
import {
  Table as TremorTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import Link from "next/link";
import { useState } from "react";
import { Purchase } from "../PurchasesClient";

type Props = {
  purchases: Purchase[];
};

export const Table = ({ purchases }: Props) => {
  const [checkAll, setCheckAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState(
    new Array(purchases.length).fill(false)
  );

  const handleCheckAll = () => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);
    setCheckedItems(new Array(purchases.length).fill(newCheckAll));
  };

  const handleCheckItem = (index: number) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);

    if (newCheckedItems.every((item) => item)) {
      setCheckAll(true);
    } else {
      setCheckAll(false);
    }
  };

  const formatDate = (date: string) => {
    const dateObject = new Date(date);

    const day = String(dateObject.getDate()).padStart(2, "0");
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const year = String(dateObject.getFullYear()).slice(-2);

    return `${day}-${month}-${year}`;
  };

  return (
    <div className="mx-auto w-full">
      <TremorTable>
        <TableHead>
          <TableRow>
            <TableHeaderCell>
              <Checkbox
                checked={checkAll ? "indeterminate" : false}
                onCheckedChange={handleCheckAll}
              />
            </TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {purchases.map((purchase, rowIndex) => {
            return (
              <TableRow key={purchase.id}>
                <TableCell>
                  <Checkbox
                    checked={checkedItems[rowIndex]}
                    onCheckedChange={() => handleCheckItem(rowIndex)}
                  />
                </TableCell>
                <TableCell>{formatDate(purchase.date)}</TableCell>
                <TableCell>
                  <Badge variant="warning">Review</Badge>
                </TableCell>
                <TableCell>
                  <Link href={`/purchases/${purchase.id}`}>
                    <Button size="small" variant="light">
                      <RiEyeLine />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </TremorTable>
    </div>
  );
};
