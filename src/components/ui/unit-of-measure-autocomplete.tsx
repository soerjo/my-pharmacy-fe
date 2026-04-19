"use client";

import { AsyncAutocomplete } from "./async-autocomplete";
import { useUnitOfMeasureSearch } from "@/hooks/use-unit-of-measure-search";
import type { UnitOfMeasure } from "@/types";

interface UnitOfMeasureAutocompleteProps {
  selectedKey: string | null;
  onSelectionChange: (key: string | null) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  required?: boolean;
}

export function UnitOfMeasureAutocomplete({
  selectedKey,
  onSelectionChange,
  label = "Base Unit",
  placeholder = "Search units...",
  className,
  error,
  required,
}: UnitOfMeasureAutocompleteProps) {
  return (
    <AsyncAutocomplete<UnitOfMeasure>
      useSearch={useUnitOfMeasureSearch}
      selectedKey={selectedKey}
      onSelectionChange={onSelectionChange}
      getId={(u) => u.id}
      getTextValue={(u) => `${u.name} (${u.abbreviation ?? u.code})`}
      renderItem={(unit) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{unit.name}</span>
          <span className="text-xs text-default-400">{unit.abbreviation ?? unit.code}</span>
        </div>
      )}
      label={label}
      placeholder={placeholder}
      emptyText="No units found"
      className={className}
      error={error}
      required={required}
    />
  );
}
