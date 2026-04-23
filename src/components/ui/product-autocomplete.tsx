"use client";

import { AsyncAutocomplete } from "./async-autocomplete";
import { useProductSearch } from "@/hooks/use-product-search";
import type { Product } from "@/types";

interface ProductAutocompleteProps {
  selectedKey: string | null;
  onSelectionChange: (key: string | null) => void;
  initialItems?: Product[];
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  required?: boolean;
  isDisabled?: boolean;
  onProductSelect?: (product: Product | null) => void;
}

export function ProductAutocomplete({
  selectedKey,
  onSelectionChange,
  initialItems,
  label = "Product / Drug",
  placeholder = "Search products...",
  className,
  error,
  required,
  isDisabled,
  onProductSelect,
}: ProductAutocompleteProps) {
  return (
    <AsyncAutocomplete<Product>
      useSearch={useProductSearch}
      selectedKey={selectedKey}
      onSelectionChange={onSelectionChange}
      getId={(p) => p.id}
      getTextValue={(p) => p.name}
      renderItem={(product) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{product.name}</span>
          <span className="text-xs text-default-400">{product.code || product.id}</span>
        </div>
      )}
      initialItems={initialItems}
      label={label}
      placeholder={placeholder}
      emptyText="No products found"
      className={className}
      error={error}
      required={required}
      isDisabled={isDisabled}
      onItemSelect={onProductSelect}
    />
  );
}
