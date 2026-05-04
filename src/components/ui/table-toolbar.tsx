"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Label, SearchField} from "@heroui/react";
import { Button, Input } from "@heroui/react";
import { Ellipsis, Magnifier, Plus } from "@gravity-ui/icons";

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
  const [isShowFilter, setIsShowFilter] = useState<boolean>(false);


  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="flex flex-row items-center gap-3">
        <div className="relative w-full">
          <SearchField 
          className="w-full"
          name="search" value={localSearch} onChange={(e) => {
              const value = e;
              setLocalSearch(value);
              if (debounceRef.current) clearTimeout(debounceRef.current);
              debounceRef.current = setTimeout(() => {
                onSearchChange(value);
              }, 300);
            }}>
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>

        </div>

        <Button isIconOnly variant="tertiary" 
        className="md:hidden aspect-square"
        onClick={() => setIsShowFilter(!isShowFilter)}
        >
          <Ellipsis/>
        </Button>

        <Button variant="primary" onPress={onAdd} className="hidden md:flex">
          {addLabel}
        </Button>
      </div>
        <div className="flex items-center justify-end gap-2 w-full md:hidden">
          {isShowFilter && extra}
        </div>
        <div className="md:flex items-center justify-end gap-2 w-full hidden">
          {extra}
        </div>
    </div>
  );
}
