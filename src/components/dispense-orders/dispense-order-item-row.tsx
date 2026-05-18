"use client";

import { Controller } from "react-hook-form";
import type { FieldValues, UseFormRegister, Control, FieldErrors, Path } from "react-hook-form";
import { Input, Button, InputGroup } from "@heroui/react";
import { TrashBin } from "@gravity-ui/icons";
import { cn } from "@/utils";
import { ProductAutocomplete } from "@/components/ui";
import type { Product, DispenseOrderDetailItem } from "@/types";

interface DispenseOrderItemShape {
  drugId: string;
  quantity: number;
  instructions: string;
}

export interface OrderItemRowProps<T extends FieldValues = FieldValues> {
  index: number;
  control: Control<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  onRemove: (index: number) => void;
  canRemove?: boolean;
  isDisabled?: boolean;
  productMap?: Map<string, Product>;
  onProductSelect?: (product: Product | null) => void;
  initialItem?: DispenseOrderDetailItem;
  watchedItem?: DispenseOrderItemShape;
  // append: (value: { drugId: string; quantity: number; instructions: string }) => void;
  isLastIndex?: boolean
}

export function OrderItemRow<T extends FieldValues>({
  index,
  control,
  register,
  errors,
  onRemove,
  canRemove: _canRemove = true,
  isDisabled = false,
  productMap,
  onProductSelect,
  initialItem,
  watchedItem,
  // append,
}: OrderItemRowProps<T>) {
  const selectedProduct = watchedItem?.drugId && productMap ? productMap.get(watchedItem.drugId) : undefined;
  const itemErrors = (errors as FieldErrors<{ items: DispenseOrderItemShape[] }>).items?.[index];
  const initialProduct: Product | undefined = initialItem
    ? { id: initialItem.drugId, name: initialItem.drugName, baseUnitAbbreviation: initialItem.baseUnitAbbreviation } as Product
    : undefined;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800 sm:grid-cols-[1fr_130px_1fr_auto]">
      <Controller
        name={`items.${index}.drugId` as Path<T>}
        control={control}
        render={({ field: drugField }) => (
          <ProductAutocomplete
            label={`Item ${index + 1}`}
            selectedKey={drugField.value || null}
            onSelectionChange={(key) => drugField.onChange(key)}
            onProductSelect={onProductSelect}
            placeholder="Search drug..."
            required
            isDisabled={isDisabled}
            readOnly={isDisabled}
            error={itemErrors?.drugId?.message}
            initialItems={initialProduct ? [initialProduct] : undefined}
          />
        )}
      />

      <div className="flex flex-col gap-1.5">
        <Controller
          name={`items.${index}.quantity` as Path<T>}
          control={control}
          render={({ field }) => (
            <InputGroup>
              <InputGroup.Input
                type="number"
                min={0}
                placeholder="Qty"
                defaultValue={field.value}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === "" ? undefined : Number(val));
                }}
                className={cn(itemErrors?.quantity && "border-danger", "max-w-full")}
                onBlur={field.onBlur}
                ref={field.ref}
                readOnly={isDisabled}

              />
              {selectedProduct?.baseUnitAbbreviation && (
                <InputGroup.Suffix className="bg-transparent border-0 mr-5">
                  <span className="whitespace-nowrap">
                    {selectedProduct.baseUnitAbbreviation}
                  </span>
                </InputGroup.Suffix>
              )}
            </InputGroup>
          )}
        />
        {itemErrors?.quantity && (
          <p className="text-sm text-danger">{itemErrors.quantity?.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Input
          placeholder="Instructions"
          readOnly={isDisabled}
          {...register(`items.${index}.instructions` as Path<T>)}
          autoFocus={false}
        />
      </div>

      <div className="flex flex-row gap-2 self-end">
        <Button
          size="sm"
          variant="danger"
          type="button"
          onPress={() => onRemove(index)}
          isDisabled={isDisabled}
          isIconOnly
        >
          <TrashBin />
        </Button>
        
      </div>
    </div>
  );
}
