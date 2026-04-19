"use client";

import { AsyncAutocomplete } from "./async-autocomplete";
import { useManufacturerSearch } from "@/hooks/use-manufacturer-search";
import type { Manufacturer } from "@/types";

interface ManufacturerAutocompleteProps {
  selectedKey: string | null;
  onSelectionChange: (key: string | null) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  required?: boolean;
}

export function ManufacturerAutocomplete({
  selectedKey,
  onSelectionChange,
  label = "Manufacturer",
  placeholder = "Search manufacturers...",
  className,
  error,
  required,
}: ManufacturerAutocompleteProps) {
  return (
    <AsyncAutocomplete<Manufacturer>
      useSearch={useManufacturerSearch}
      selectedKey={selectedKey}
      onSelectionChange={onSelectionChange}
      getId={(m) => m.id}
      getTextValue={(m) => `${m.name} (${m.code})`}
      renderItem={(manufacturer) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{manufacturer.name}</span>
          <span className="text-xs text-default-400">{manufacturer.code}</span>
          {manufacturer.address && (
            <span className="text-xs text-default-400">{manufacturer.address}</span>
          )}
        </div>
      )}
      label={label}
      placeholder={placeholder}
      emptyText="No manufacturers found"
      className={className}
      error={error}
      required={required}
    />
  );
}
