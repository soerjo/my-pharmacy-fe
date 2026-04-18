"use client";

import { AsyncAutocomplete } from "./async-autocomplete";
import { useRoomCategorySearch } from "@/hooks/use-room-category-search";
import type { RoomCategory } from "@/types";

interface RoomCategoryAutocompleteProps {
  selectedKey: string | null;
  onSelectionChange: (key: string | null) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  required?: boolean;
}

export function RoomCategoryAutocomplete({
  selectedKey,
  onSelectionChange,
  label = "Type",
  placeholder = "Search room types...",
  className,
  error,
  required,
}: RoomCategoryAutocompleteProps) {
  return (
    <AsyncAutocomplete<RoomCategory>
      useSearch={useRoomCategorySearch}
      selectedKey={selectedKey}
      onSelectionChange={onSelectionChange}
      getId={(c) => c.id}
      getTextValue={(c) => c.name}
      renderItem={(category) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{category.name}</span>
          {category.description && (
            <span className="text-xs text-default-400">
              {category.description}
            </span>
          )}
        </div>
      )}
      label={label}
      placeholder={placeholder}
      emptyText="No room types found"
      className={className}
      error={error}
      required={required}
    />
  );
}
