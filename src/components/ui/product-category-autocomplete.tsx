"use client";

import { AsyncAutocomplete } from "./async-autocomplete";
import { useProductCategorySearch } from "@/hooks/use-product-category-search";
import type { ProductCategory } from "@/types";

interface ProductCategoryAutocompleteProps {
  selectedKey: string | null;
  onSelectionChange: (key: string | null) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  required?: boolean;
}

export function ProductCategoryAutocomplete({
  selectedKey,
  onSelectionChange,
  label = "Category",
  placeholder = "Search categories...",
  className,
  error,
  required,
}: ProductCategoryAutocompleteProps) {
  return (
    <AsyncAutocomplete<ProductCategory>
      useSearch={useProductCategorySearch}
      selectedKey={selectedKey}
      onSelectionChange={onSelectionChange}
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
      label={label}
      placeholder={placeholder}
      emptyText="No categories found"
      className={className}
      error={error}
      required={required}
    />
  );
}
