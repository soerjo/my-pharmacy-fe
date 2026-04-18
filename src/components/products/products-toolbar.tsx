"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Input } from "@heroui/react";
import { Magnifier } from "@gravity-ui/icons";

interface ProductsToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
}

export function ProductsToolbar({ searchValue, onSearchChange, onAdd }: ProductsToolbarProps) {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-xl font-semibold">Products</h2>
      <div className="flex items-center gap-3">
        <div className="relative w-full sm:w-64">
          <Magnifier className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-default-400" />
          <Input
            placeholder="Search products..."
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
            aria-label="Search products"
          />
        </div>
        <Button variant="primary" onPress={onAdd}>+ Add Product</Button>
      </div>
    </div>
  );
}
