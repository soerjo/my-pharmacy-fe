"use client";

import { AsyncAutocomplete } from "./async-autocomplete";
import { useRoomSearch } from "@/hooks/use-room-search";
import type { Room } from "@/types";

interface WardAutocompleteProps {
  selectedKey: string | null;
  onSelectionChange: (key: string | null) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  required?: boolean;
}

export function WardAutocomplete({
  selectedKey,
  onSelectionChange,
  label = "Ward",
  placeholder = "Search wards...",
  className,
  error,
  required,
}: WardAutocompleteProps) {
  return (
    <AsyncAutocomplete<Room>
      useSearch={useRoomSearch}
      selectedKey={selectedKey}
      onSelectionChange={onSelectionChange}
      getId={(room) => room.id}
      getTextValue={(room) => room.name}
      renderItem={(room) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{room.name}</span>
          <span className="text-xs text-default-400">{room.code}</span>
        </div>
      )}
      label={label}
      placeholder={placeholder}
      emptyText="No wards found"
      className={className}
      error={error}
      required={required}
    />
  );
}
