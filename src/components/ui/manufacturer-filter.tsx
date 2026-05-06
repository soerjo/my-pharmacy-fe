"use client";

import { AsyncAutocomplete } from "./async-autocomplete";
import { useManufacturerSearch } from "@/hooks/use-manufacturer-search";
import type { ProductsFilters } from "@/stores";
import type { Manufacturer } from "@/types";

interface IManufacturerFilter {
  filters: ProductsFilters;
  setFilters: (filters: Partial<ProductsFilters>) => void;
}

export function ManufacturerFilter({ filters, setFilters }: IManufacturerFilter) {
  return (
    <AsyncAutocomplete<Manufacturer>
      useSearch={useManufacturerSearch}
      selectedKey={filters.manufacturerId || null}
      onSelectionChange={(key) => setFilters({ manufacturerId: key ?? "" })}
      getId={(m) => m.id}
      getTextValue={(m) => `${m.name} (${m.code})`}
      renderItem={(manufacturer) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{manufacturer.name}</span>
          <span className="text-xs text-default-400">{manufacturer.code}</span>
        </div>
      )}
      label="Manufacturer"
      placeholder="Search manufacturers..."
      emptyText="No manufacturers found"
    />
  );
}
