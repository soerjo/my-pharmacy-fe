"use client";

import { AsyncAutocomplete } from "./async-autocomplete";
import { useProductTypeSearch } from "@/hooks/use-product-type-search";
import type { ProductsFilters } from "@/stores";
import type { ProductTypeEntity } from "@/types";

interface IProductTypeFilter {
  filters: ProductsFilters;
  setFilters: (filters: Partial<ProductsFilters>) => void;
}

export function ProductTypeFilter({ filters, setFilters }: IProductTypeFilter) {
  return (
    <AsyncAutocomplete<ProductTypeEntity>
      useSearch={useProductTypeSearch}
      selectedKey={filters.productType || null}
      onSelectionChange={(key) => setFilters({ productType: key ?? "" })}
      getId={(t) => t.value}
      getTextValue={(t) => t.value}
      renderItem={(type) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{type.value}</span>
        </div>
      )}
      label="Product Type"
      placeholder="Search product types..."
      emptyText="No product types found"
    />
  );
}
