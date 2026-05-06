"use client";

import { type ReactNode, useState, useMemo } from "react";
import {
  Autocomplete,
  Spinner,
  ListBox,
  Label,
  SearchField,
  EmptyState,
} from "@heroui/react";
import { cn } from "@/utils";

interface UseSearchResult<T> {
  data: T[] | undefined;
  isLoading: boolean;
}

interface AsyncAutocompleteProps<T extends object> {
  useSearch: (search: string) => UseSearchResult<T>;
  selectedKey: string | null;
  onSelectionChange: (key: string | null) => void;
  renderItem: (item: T) => ReactNode;
  getId: (item: T) => string;
  getTextValue: (item: T) => string;
  initialItems?: T[];
  label?: string;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  error?: string;
  required?: boolean;
  isDisabled?: boolean;
  readOnly?: boolean;
  onItemSelect?: (item: T | null) => void;
}

export function AsyncAutocomplete<T extends object>({
  useSearch,
  selectedKey,
  onSelectionChange,
  renderItem,
  getId,
  getTextValue,
  initialItems,
  label = "Search",
  placeholder = "Search...",
  emptyText = "No results found",
  className,
  error,
  required,
  isDisabled,
  readOnly,
  onItemSelect,
}: AsyncAutocompleteProps<T>) {
  const [inputValue, setInputValue] = useState("");
  const { data: items = [], isLoading } = useSearch(inputValue);

  const mergedItems = useMemo(() => {
    if (!initialItems?.length) return items;
    const existingIds = new Set(items.map(getId));
    const filtered = initialItems.filter((item) => !existingIds.has(getId(item)));
    return [...filtered, ...items];
  }, [initialItems, items, getId]);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Autocomplete
        fullWidth
        allowsEmptyCollection
        className={className}
        isDisabled={isDisabled}
        selectionMode="single"
        value={selectedKey}
        onChange={(key) => {
          if (readOnly) return;
          onSelectionChange(key as string | null);
          onItemSelect?.(key ? (mergedItems.find((item) => getId(item) === key) ?? null) : null);
        }}
      >
        <Label>
          {label}
          {required && <span className="text-danger"> *</span>}
        </Label>
        <Autocomplete.Trigger className={cn(readOnly && "pointer-events-none")}>
          <Autocomplete.Value />
          {!readOnly && <Autocomplete.ClearButton />}
          {!readOnly && <Autocomplete.Indicator />}
        </Autocomplete.Trigger>
        <Autocomplete.Popover className={cn(readOnly && "hidden")}>
          <Autocomplete.Filter
            inputValue={inputValue}
            onInputChange={setInputValue}
          >
            <SearchField
              autoFocus
              className="sticky top-0 z-10"
              name="async-search"
              variant="secondary"
            >
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input placeholder={placeholder} />
                <Spinner
                  size="sm"
                  className={cn(
                    "absolute top-1/2 right-2 -translate-y-1/2",
                    {
                      "pointer-events-none opacity-0": !isLoading,
                    },
                  )}
                />
                <SearchField.ClearButton
                  className={cn({
                    "pointer-events-none opacity-0": isLoading,
                  })}
                />
              </SearchField.Group>
            </SearchField>
            <ListBox
              className="max-h-[420px] overflow-y-auto"
              items={mergedItems}
              renderEmptyState={() => <EmptyState>{emptyText}</EmptyState>}
            >
              {(item: T) => (
                <ListBox.Item id={getId(item)} textValue={getTextValue(item)}>
                  {renderItem(item)}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              )}
            </ListBox>
          </Autocomplete.Filter>
        </Autocomplete.Popover>
      </Autocomplete>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
