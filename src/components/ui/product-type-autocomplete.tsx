"use client";

import { AsyncAutocomplete } from "./async-autocomplete";
import { useProductTypeSearch } from "@/hooks/use-product-type-search";
import type { ProductTypeEntity } from "@/types";

interface ProductTypeAutocompleteProps {
  selectedKey: string | null;
  onSelectionChange: (key: string | null) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  required?: boolean;
}

export function ProductTypeAutocomplete({
  selectedKey,
  onSelectionChange,
  label = "Product Type",
  placeholder = "Search product types...",
  className,
  error,
  required,
}: ProductTypeAutocompleteProps) {
  return (
    <AsyncAutocomplete<ProductTypeEntity>
      useSearch={useProductTypeSearch}
      selectedKey={selectedKey}
      onSelectionChange={onSelectionChange}
      getId={(t) => t.id}
      getTextValue={(t) => t.value}
      renderItem={(type) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{type.value}</span>
        </div>
      )}
      label={label}
      placeholder={placeholder}
      emptyText="No product types found"
      className={className}
      error={error}
      required={required}
    />
  );
}
