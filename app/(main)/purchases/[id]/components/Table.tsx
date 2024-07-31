"use client";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import {
  RiArrowDropDownFill,
  RiArrowDropUpFill,
  RiEdit2Line,
  RiEyeLine,
  RiSaveLine,
} from "@remixicon/react";
import {
  Table as TremorTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { useState } from "react";

type Props = {
  items: Array<{
    id: string;
    code: string;
    category: string;
    description: string;
    price: number;
    amount: number;
    date: string;
  }>;
  requestSort: (key: keyof Props["items"][0]) => void;
  sortConfig: SortConfig | null;
};

type SortConfig = {
  key: keyof Props["items"][0];
  direction: "ascending" | "descending";
};

export const Table = ({ items, requestSort, sortConfig }: Props) => {
  const [checkAll, setCheckAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState(
    new Array(items.length).fill(false)
  );
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);

  const handleCheckAll = () => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);
    setCheckedItems(new Array(items.length).fill(newCheckAll));
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

  const handleEditClick = (index: number) => {
    setEditingRowIndex(index);
  };

  const handleSaveClick = (index: number) => {
    // Handle save logic here, e.g., send updated data to the server
    setEditingRowIndex(null);
  };

  const getArrow = (key: keyof Props["items"][0]) => {
    if (!sortConfig || sortConfig.key !== key) {
      return (
        <span className="flex items-center ml-1">
          <RiArrowDropUpFill className="text-gray-400" />
          <RiArrowDropDownFill className="text-gray-400" />
        </span>
      );
    }
    return sortConfig.direction === "ascending" ? (
      <span className="flex items-center ml-1">
        <RiArrowDropUpFill />
        <RiArrowDropDownFill className="text-gray-400" />
      </span>
    ) : (
      <span className="flex items-center ml-1">
        <RiArrowDropUpFill className="text-gray-400" />
        <RiArrowDropDownFill />
      </span>
    );
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
            <TableHeaderCell onClick={() => requestSort("code")}>
              <div className="flex items-center">Code {getArrow("code")}</div>
            </TableHeaderCell>
            <TableHeaderCell onClick={() => requestSort("category")}>
              <div className="flex items-center">
                Category {getArrow("category")}
              </div>
            </TableHeaderCell>
            <TableHeaderCell onClick={() => requestSort("description")}>
              <div className="flex items-center">
                Description {getArrow("description")}
              </div>
            </TableHeaderCell>
            <TableHeaderCell onClick={() => requestSort("price")}>
              <div className="flex items-center">Price {getArrow("price")}</div>
            </TableHeaderCell>
            <TableHeaderCell onClick={() => requestSort("amount")}>
              <div className="flex items-center">
                Amount {getArrow("amount")}
              </div>
            </TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((item, rowIndex) => (
            <TableRow key={item.id}>
              <TableCell>
                <Checkbox
                  checked={checkedItems[rowIndex]}
                  onCheckedChange={() => handleCheckItem(rowIndex)}
                />
              </TableCell>
              <TableCell>
                <Badge variant="warning">Review</Badge>
              </TableCell>
              <TableCell>
                {editingRowIndex === rowIndex ? (
                  <input
                    type="text"
                    defaultValue={item.category}
                    onChange={(e) => {
                      // Handle input change
                    }}
                  />
                ) : (
                  item.category
                )}
              </TableCell>
              <TableCell>
                {editingRowIndex === rowIndex ? (
                  <input
                    type="text"
                    defaultValue={item.description}
                    onChange={(e) => {
                      // Handle input change
                    }}
                  />
                ) : (
                  item.description
                )}
              </TableCell>
              <TableCell>
                {editingRowIndex === rowIndex ? (
                  <input
                    type="number"
                    defaultValue={item.price}
                    onChange={(e) => {
                      // Handle input change
                    }}
                  />
                ) : (
                  item.price
                )}
              </TableCell>
              <TableCell>
                {editingRowIndex === rowIndex ? (
                  <input
                    type="number"
                    defaultValue={item.amount}
                    onChange={(e) => {
                      // Handle input change
                    }}
                  />
                ) : (
                  item.amount
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="small" variant="light">
                    <RiEyeLine />
                  </Button>
                  {editingRowIndex === rowIndex ? (
                    <Button
                      size="small"
                      variant="light"
                      onClick={() => handleSaveClick(rowIndex)}
                    >
                      <RiSaveLine />
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="light"
                      onClick={() => handleEditClick(rowIndex)}
                    >
                      <RiEdit2Line />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TremorTable>
    </div>
  );
};
