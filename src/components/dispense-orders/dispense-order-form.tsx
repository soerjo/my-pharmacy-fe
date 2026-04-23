"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Spinner, TextArea } from "@heroui/react";
import { dispenseOrderSchema, type DispenseOrderFormValues, type DispenseOrder } from "@/types";
import { useDispenseOrders } from "@/hooks/use-dispense-orders";
import { AdmissionAutocomplete, ProductAutocomplete } from "@/components/ui";

interface DispenseOrderFormProps {
  order?: DispenseOrder;
  onClose: () => void;
}

export function DispenseOrderForm({ order, onClose }: DispenseOrderFormProps) {
  const { createOrder, updateOrder, isCreating, isUpdating } = useDispenseOrders();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditing = !!order;
  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DispenseOrderFormValues>({
    resolver: zodResolver(dispenseOrderSchema),
    defaultValues: order
      ? {
          // patientId: order.patientId,
          admissionId: order.admissionId,
          notes: order.notes ?? "",
          items: order.items?.map((item) => ({
            drugId: item.drugId,
            quantity: item.quantity,
            instructions: item.instructions ?? "",
          })) ?? [{ drugId: "", quantity: 1, instructions: "" }],
        }
      : {
          // patientId: "",
          admissionId: "",
          notes: "",
          items: [{ drugId: "", quantity: 1, instructions: "" }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  async function onSubmit(data: DispenseOrderFormValues) {
    setSubmitError(null);
    try {
      if (isEditing && order) {
        await updateOrder(order.id ?? order.orderNumber, data);
      } else {
        await createOrder(data);
      }
      onClose();
    } catch {
      setSubmitError(
        isEditing
          ? "Failed to update order. Please try again."
          : "Failed to create order. Please try again.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* <Controller
          name="patientId"
          control={control}
          render={({ field }) => (
            <PatientAutocomplete
              selectedKey={field.value || null}
              onSelectionChange={(key) => field.onChange(key)}
              label="Patient"
              placeholder="Search patients..."
              required
              error={errors.patientId?.message}
            />
          )}
        /> */}

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

      {submitError && <p className="text-sm text-danger">{submitError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onPress={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isDisabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" />
              {isEditing ? "Updating..." : "Creating..."}
            </span>
          ) : (
            isEditing ? "Update Order" : "Create Order"
          )}
        </Button>
      </div>
    </form>
  );
}
