"use client";

import type { UseFormRegister, Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Input, Button, TextArea } from "@heroui/react";
import type { DispenseOrderFormValues } from "@/types";
import { AdmissionAutocomplete, ProductAutocomplete } from "@/components/ui";

interface FormField {
  id: string;
}

interface DispenseOrderFormBodyProps {
  control: Control<DispenseOrderFormValues>;
  register: UseFormRegister<DispenseOrderFormValues>;
  errors: FieldErrors<DispenseOrderFormValues>;
  fields: FormField[];
  append: (value: { drugId: string; quantity: number; instructions: string }) => void;
  remove: (index: number) => void;
}

export function DispenseOrderFormBody({
  control,
  register,
  errors,
  fields,
  append,
  remove,
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
              error={errors.admissionId?.message}
            />
          )}
        />
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
          >
            + Add Item
          </Button>
        </div>

        {errors.items && !Array.isArray(errors.items) && (
          <p className="text-sm text-danger">{errors.items.message}</p>
        )}

        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800 sm:grid-cols-[1fr_100px_1fr_auto]"
            >
              <Controller
                name={`items.${index}.drugId`}
                control={control}
                render={({ field: drugField }) => (
                  <ProductAutocomplete
                    selectedKey={drugField.value || null}
                    onSelectionChange={(key) => drugField.onChange(key)}
                    label={index === 0 ? "Drug" : undefined}
                    placeholder="Search drug..."
                    required
                    error={errors.items?.[index]?.drugId?.message}
                  />
                )}
              />

              <div className="flex flex-col gap-1.5">
                {index === 0 && (
                  <label className="text-sm font-medium">
                    Qty <span className="text-danger">*</span>
                  </label>
                )}
                <Input
                  type="number"
                  min={1}
                  placeholder="Qty"
                  {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                />
                {errors.items?.[index]?.quantity && (
                  <p className="text-sm text-danger">{errors.items[index].quantity?.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                {index === 0 && (
                  <label className="text-sm font-medium">Instructions</label>
                )}
                <Input
                  placeholder="Instructions"
                  {...register(`items.${index}.instructions`)}
                />
              </div>

              {fields.length > 1 && (
                <Button
                  size="sm"
                  variant="danger"
                  type="button"
                  className="self-end"
                  onPress={() => remove(index)}
                >
                  Remove
                </Button>
              )}
            </div>
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
          {...register("notes")}
        />
        {errors.notes && (
          <p className="text-sm text-danger">{errors.notes.message}</p>
        )}
      </div>
    </>
  );
}
