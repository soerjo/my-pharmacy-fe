"use client";

import type { UseFormRegister, Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Input, Button, TextArea } from "@heroui/react";
import { AdmissionAutocomplete } from "@/components/ui";
import { OrderItemRow } from "./dispense-order-item-row";
import type { DispenseOrderCreateFormValues } from "@/types/dispense-orders";
import type { Product } from "@/types";

interface DispenseOrderFormBodyProps {
  control: Control<DispenseOrderCreateFormValues>;
  register: UseFormRegister<DispenseOrderCreateFormValues>;
  errors: FieldErrors<DispenseOrderCreateFormValues>;
  fields: { id: string }[];
  append: (value: { drugId: string; quantity: number; instructions: string }) => void;
  remove: (index: number) => void;
  isDisabled?: boolean;
  watchedItems: DispenseOrderCreateFormValues["items"] | undefined;
  productMap: Map<string, Product>;
  onProductSelect: (product: Product | null) => void;
}

export function DispenseOrderFormBody({
  control,
  register,
  errors,
  fields,
  append,
  remove,
  isDisabled = false,
  watchedItems,
  productMap,
  onProductSelect,
}: DispenseOrderFormBodyProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="admissionId"
          control={control}
          render={({ field }) => (
            <AdmissionAutocomplete
              selectedKey={field.value || null}
              onSelectionChange={(key) => field.onChange(key)}
              label="Admission"
              placeholder="Search admissions..."
              required
              isDisabled={isDisabled}
              error={errors.admissionId?.message}
            />
          )}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="admissionDate" className="text-sm font-medium">
            Admission Date <span className="text-danger">*</span>
          </label>
          <Input
            id="admissionDate"
            type="date"
            className="h-full"
            disabled={isDisabled}
            {...register("admissionDate")}
          />
          {errors.admissionDate && <p className="text-sm text-danger">{errors.admissionDate.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            Items <span className="text-danger">*</span>
          </label>
          <Button
            size="sm"
            variant="secondary"
            type="button"
            onPress={() => append({ drugId: "", quantity: 1, instructions: "" })}
            isDisabled={isDisabled}
          >
            + Add Item
          </Button>
        </div>

        {errors.items && !Array.isArray(errors.items) && (
          <p className="text-sm text-danger">{errors.items.message}</p>
        )}

        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <OrderItemRow<DispenseOrderCreateFormValues>
              key={field.id}
              index={index}
              control={control}
              register={register}
              errors={errors}
              onRemove={remove}
              canRemove={fields.length > 1}
              isDisabled={isDisabled}
              watchedItem={watchedItems?.[index]}
              productMap={productMap}
              onProductSelect={onProductSelect}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes
        </label>
        <TextArea
          id="notes"
          placeholder="Additional notes (optional)"
          disabled={isDisabled}
          {...register("notes")}
        />
        {errors.notes && <p className="text-sm text-danger">{errors.notes.message}</p>}
      </div>
    </>
  );
}
