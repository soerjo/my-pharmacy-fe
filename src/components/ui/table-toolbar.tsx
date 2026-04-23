"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button, Input } from "@heroui/react";
import { Magnifier, Plus } from "@gravity-ui/icons";

interface TableToolbarProps {
  title: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  addLabel: string;
  onAdd: () => void;
  extra?: ReactNode;
}

export function TableToolbar({
  title,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  addLabel,
  onAdd,
  extra,
}: TableToolbarProps) {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="flex md:flex-row flex-col items-center justify-end gap-3">
        <div className="relative w-full sm:w-64">
          <Magnifier className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-default-400" />
          <Input
          fullWidth
            placeholder={searchPlaceholder}
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
            aria-label={searchPlaceholder}
          />
        </div>
        <div className="flex items-center justify-end gap-2 w-full">
        {extra}
        </div>
        {/* <Button variant="primary"  onPress={onAdd} className="flex md:hidden self-end" isIconOnly>
          <Plus />
        </Button> */}

        <Button variant="primary" onPress={onAdd} className="hidden md:flex">
          {addLabel}
        </Button>
      </div>
    </div>
  );
}
