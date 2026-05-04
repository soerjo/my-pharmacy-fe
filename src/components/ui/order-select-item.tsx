import { Select, SelectTrigger, SelectValue, SelectPopover, ListBox, Label, ListBoxItem } from "@heroui/react";
import { DISPENSE_ORDER_STATUS_OPTIONS } from "@/types";
import { DispenseOrdersFilters } from "@/stores";

const STATUS_FILTER_OPTIONS = [
  { id: "", label: "All statuses" },
  ...DISPENSE_ORDER_STATUS_OPTIONS,
];

export interface IOrderSelectItem {
    filters: DispenseOrdersFilters;
    setFilters: (filters: Partial<DispenseOrdersFilters>) => void
}

export function OrderSelectItem ({filters, setFilters}: IOrderSelectItem) {
    return (
        <Select
        selectedKey={filters.status || undefined}
        onSelectionChange={(key) => setFilters({ status: key ? String(key) : "" })}
        fullWidth
        >
            <Label>Order Status</Label>
            <SelectTrigger>
                <SelectValue />
                <Select.Indicator />
            </SelectTrigger>
            <SelectPopover>
                <ListBox items={STATUS_FILTER_OPTIONS}>
                {(item) => (
                    <ListBoxItem key={item.id} textValue={item.label}>
                    {item.label}
                    </ListBoxItem>
                )}
                </ListBox>
            </SelectPopover>
        </Select>
    );
}