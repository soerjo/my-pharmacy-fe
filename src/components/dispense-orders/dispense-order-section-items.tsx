"use client";

import type { UseFormRegister, Control, FieldErrors } from "react-hook-form";
import { Button, ScrollShadow, Accordion } from "@heroui/react";
import { ChevronDown, Pill } from "@gravity-ui/icons";
import { OrderItemRow } from "./dispense-order-item-row";
import type {
  DispenseOrderFormValues,
  Product,
  DispenseOrderDetailItem,
} from "@/types";

interface DispenseOrderSectionItemsProps {
  fields: { id: string }[];
  append: (value: { drugId: string; quantity: number; instructions: string }) => void;
  control: Control<DispenseOrderFormValues>;
  register: UseFormRegister<DispenseOrderFormValues>;
  watchedItems: DispenseOrderFormValues["items"] | undefined;
  errors: FieldErrors<DispenseOrderFormValues>;
  isReadOnly: boolean;
  productMap: Map<string, Product>;
  onProductSelect: (product: Product | null) => void;
  initialItems: DispenseOrderDetailItem[];
  onRemoveRequest: (index: number) => void;
}

export function DispenseOrderSectionItems({
  fields,
  append,
  control,
  register,
  watchedItems,
  errors,
  isReadOnly,
  productMap,
  onProductSelect,
  initialItems,
  onRemoveRequest,
}: DispenseOrderSectionItemsProps) {
  return (
    <Accordion.Item id="order-items">
      <Accordion.Heading>
        <Accordion.Trigger>
          <span className="mr-3 size-4 shrink-0 text-muted">
            <Pill />
          </span>
          {"Order Items"}
          <Accordion.Indicator>
            <ChevronDown />
          </Accordion.Indicator>
        </Accordion.Trigger>
      </Accordion.Heading>
      <Accordion.Panel>
        <Accordion.Body>
          <div className="flex flex-col gap-2 pt-0.5">
            <div className="flex items-center justify-between">
              {!isReadOnly && (
                <Button
                  size="sm"
                  variant="primary"
                  type="button"
                  className="ml-auto"
                  onPress={() => append({ drugId: "", quantity: 1, instructions: "" })}
                >
                  + Add Item
                </Button>
              )}
            </div>

            {errors.items && !Array.isArray(errors.items) && (
              <p className="text-sm text-danger">{errors.items.message}</p>
            )}

            <ScrollShadow hideScrollBar className="max-h-[40vh]">
              <div className="flex flex-col gap-3">
                {fields.map((field, index) => (
                  <OrderItemRow<DispenseOrderFormValues>
                    key={field.id}
                    index={index}
                    control={control}
                    register={register}
                    watchedItem={watchedItems?.[index]}
                    errors={errors}
                    isDisabled={isReadOnly}
                    productMap={productMap}
                    onProductSelect={onProductSelect}
                    initialItem={index < initialItems.length ? initialItems[index] : undefined}
                    onRemove={onRemoveRequest}
                  />
                ))}
              </div>
            </ScrollShadow>
          </div>
        </Accordion.Body>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
