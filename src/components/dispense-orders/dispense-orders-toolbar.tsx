"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Input, Select, SelectTrigger, SelectValue, SelectPopover, ListBox, ListBoxItem } from "@heroui/react";
import { Magnifier } from "@gravity-ui/icons";

const STATUS_OPTIONS: { id: string; label: string }[] = [
  { id: "", label: "All statuses" },
  { id: "PENDING", label: "Pending" },
  { id: "PREPARING", label: "Preparing" },
  { id: "DISPENSED", label: "Dispensed" },
  { id: "CANCELLED", label: "Cancelled" },
];

interface DispenseOrdersToolbarProps {
  searchValue: string;
  statusValue: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onAdd: () => void;
}

export function DispenseOrdersToolbar({
  searchValue,
  statusValue,
  onSearchChange,
  onStatusChange,
  onAdd,
}: DispenseOrdersToolbarProps) {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-xl font-semibold">Dispense Orders</h2>
      <div className="flex items-center gap-3">
        <div className="relative w-full sm:w-64">
          <Magnifier className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-default-400" />
          <Input
            placeholder="Search orders..."
            value={localSearch}
            onChange={(e) => {
              const value = e.target.value;
              setLocalSearch(value);
              if (debounceRef.current) clearTimeout(debounceRef.current);
              debounceRef.current = setTimeout(() => {
                onSearchChange(value);
              }, 300);
            }}
            className="pl-8"
            aria-label="Search dispense orders"
          />
        </div>
        <Select
          selectedKey={statusValue || undefined}
          onSelectionChange={(key) => {
            onStatusChange(key ? String(key) : "");
          }}
          className="w-36"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectPopover>
            <ListBox items={STATUS_OPTIONS}>
              {(item) => (
                <ListBoxItem key={item.id} textValue={item.label}>
                  {item.label}
                </ListBoxItem>
              )}
            </ListBox>
          </SelectPopover>
        </Select>
        <Button variant="primary" onPress={onAdd}>
          + New Order
        </Button>
      </div>
    </div>
  );
}
