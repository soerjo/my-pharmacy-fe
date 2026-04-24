"use client";

import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import {
  Select,
  SelectPopover,
  ListBox,
  ListBoxItem,
  Spinner,
  Accordion,
} from "@heroui/react";
import { ChevronDown, Bookmark } from "@gravity-ui/icons";
import { InfoField } from "@/components/ui";
import { formatDate, cn } from "@/utils";
import {
  type DispenseOrderDetail,
  type DispenseOrderFormValues,
  type DispenseOrderStatus,
  DISPENSE_ORDER_STATUS_STYLES,
} from "@/types";

interface DispenseOrderSectionDetailsProps {
  orderDetail: DispenseOrderDetail;
  control: Control<DispenseOrderFormValues>;
  onStatusChange: (status: string) => void;
  isStatusChanging: boolean;
  canChangeStatus: boolean;
  filteredStatusOptions: { id: DispenseOrderStatus; label: string }[];
}

export function DispenseOrderSectionDetails({
  orderDetail,
  control,
  onStatusChange,
  isStatusChanging,
  canChangeStatus,
  filteredStatusOptions,
}: DispenseOrderSectionDetailsProps) {
  return (
    <Accordion.Item id="dispense-details">
      <Accordion.Heading>
        <Accordion.Trigger>
          <span className="mr-3 size-4 shrink-0 text-muted">
            <Bookmark />
          </span>
          {"Dispense Details"}
          <Accordion.Indicator>
            <ChevronDown />
          </Accordion.Indicator>
        </Accordion.Trigger>
      </Accordion.Heading>
      <Accordion.Panel>
        <Accordion.Body>
          <div className="grid grid-cols-2 gap-4">
            <InfoField label="Order Number">
              <div className="flex flex-col gap-0 text-sm">
                <span className="text-black">{orderDetail.orderNumber}</span>
                <span className="text-xs">
                  {orderDetail.orderDate ? formatDate(orderDetail.orderDate) : "-"}
                </span>
              </div>
            </InfoField>
            <InfoField label="Status">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Select
                      selectedKey={field.value}
                      onSelectionChange={(key) => onStatusChange(String(key))}
                      isDisabled={isStatusChanging || !canChangeStatus}
                      className="w-fit shadow-none"
                    >
                      <Select.Trigger className="w-auto py-0">
                        <Select.Value className="p-0 flex justify-center items-center" />
                        <Select.Indicator />
                      </Select.Trigger>
                      <SelectPopover className="w-auto">
                        <ListBox items={filteredStatusOptions}>
                          {(item) => (
                            <ListBoxItem key={item.id} textValue={item.label}>
                              <span
                                className={cn(
                                  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                                  DISPENSE_ORDER_STATUS_STYLES[item.id],
                                )}
                              >
                                {item.label}
                              </span>
                            </ListBoxItem>
                          )}
                        </ListBox>
                      </SelectPopover>
                    </Select>
                    {isStatusChanging && <Spinner size="sm" />}
                  </div>
                )}
              />
            </InfoField>
          </div>
        </Accordion.Body>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
