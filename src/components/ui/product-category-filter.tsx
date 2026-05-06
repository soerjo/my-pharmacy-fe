"use client";

import { AsyncAutocomplete } from "./async-autocomplete";
import { useProductCategorySearch } from "@/hooks/use-product-category-search";
import type { ProductsFilters } from "@/stores";
import type { ProductCategory } from "@/types";

interface IProductCategoryFilter {
  filters: ProductsFilters;
  setFilters: (filters: Partial<ProductsFilters>) => void;
}

export function ProductCategoryFilter({ filters, setFilters }: IProductCategoryFilter) {
  return (
    <AsyncAutocomplete<ProductCategory>
      useSearch={useProductCategorySearch}
      selectedKey={filters.categoryId || null}
      onSelectionChange={(key) => setFilters({ categoryId: key ?? "" })}
      getId={(c) => c.id}
      getTextValue={(c) => c.name}
      renderItem={(category) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{category.name}</span>
          {category.description && (
            <span className="text-xs text-default-400">{category.description}</span>
          )}
        </div>
      )}
      label="Category"
      placeholder="Search categories..."
      emptyText="No categories found"
    />
  );
}
