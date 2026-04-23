"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, TextArea, Spinner, ScrollShadow, InputGroup } from "@heroui/react";
import { dispenseOrderSchema, type DispenseOrderFormValues, type DispenseOrderStatus, type Product } from "@/types";
import { useDispenseOrders, useDispenseOrder } from "@/hooks/use-dispense-orders";
import { ProductAutocomplete } from "@/components/ui";
import { formatDate, cn } from "@/utils";
import { TrashBin } from "@gravity-ui/icons";
import { QueantityInput } from "../ui/quantity-input";

const statusStyles: Record<DispenseOrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  PREPARING: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  DISPENSED: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

interface DispenseOrderUpdateFormProps {
  id: string;
  onClose: () => void;
  formId: string;
}

export function DispenseOrderUpdateForm({ id, onClose, formId }: DispenseOrderUpdateFormProps) {
  const { updateOrder } = useDispenseOrders();
  const { dispenseOrder: orderDetail, isLoading: isLoadingDetail } = useDispenseOrder(id);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const originalItemCount = orderDetail?.items.length ?? 0;

  const initialProducts = useMemo(() => {
    if (!orderDetail) return [];
    return orderDetail.items.map(
      (item) =>
        ({
          id: item.drugId,
          name: item.drugName,
        }) as Product,
    );
  }, [orderDetail]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<DispenseOrderFormValues>({
    resolver: zodResolver(dispenseOrderSchema),
    defaultValues: {
      admissionId: "",
      notes: "",
      items: [{ drugId: "", quantity: 1, instructions: "" }],
    },
  });

  useEffect(() => {
    if (orderDetail) {
      const items = orderDetail.items.map((item) => ({
        drugId: item.drugId,
        quantity: item.quantity,
        instructions: item.instructions ?? "",
      }));
      reset({
        admissionId: orderDetail.admissionId,
        notes: orderDetail.notes ?? "",
        items,
      });
    }
  }, [orderDetail, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  async function onSubmit(data: DispenseOrderFormValues) {
    setSubmitError(null);
    try {
      await updateOrder(id, data);
      onClose();
    } catch {
      setSubmitError("Failed to update order. Please try again.");
    }
  }

  if (isLoadingDetail) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8">
        <Spinner size="lg" />
        <p className="text-sm text-zinc-500">Loading order detail...</p>
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="py-8 text-center text-sm text-zinc-500">Order not found.</div>
    );
  }

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <InfoField label="Order Number" value={orderDetail.orderNumber} />
        <InfoField label="Status">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              statusStyles[orderDetail.status],
            )}
          >
            {orderDetail.status}
          </span>
        </InfoField>
        <InfoField label="Admission Number" value={orderDetail.admissionNumber || "-"} />
        <InfoField label="Admission Type" value={orderDetail.admission_type || "-"} />
        <InfoField label="Admission Status" value={orderDetail.admissionStatus || "-"} />
        <InfoField
          label="Admission Date"
          value={orderDetail.admissionDate ? formatDate(orderDetail.admissionDate) : "-"}
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

        <ScrollShadow className="max-h-[50vh]">
          <div className="flex flex-col gap-3">
            {fields.map((field, index) => {
              const detailItem = index < originalItemCount ? orderDetail.items[index] : null;

              return (
                <div
                  key={field.id}
                  className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800 sm:grid-cols-[1fr_130px_1fr_auto]"
                >
                  <Controller
                    name={`items.${index}.drugId`}
                    control={control}
                    render={({ field: drugField }) => (
                      <ProductAutocomplete
                        label={`Item ${index + 1}`}
                        selectedKey={drugField.value || null}
                        onSelectionChange={(key) => drugField.onChange(key)}
                        placeholder="Search drug..."
                        required
                        error={errors.items?.[index]?.drugId?.message}
                        initialItems={index < initialProducts.length ? [initialProducts[index]] : undefined}
                      />
                    )}
                  />

                  <div className="flex flex-col gap-1.5">
                      {/* <label className="text-sm font-medium">
                        Qty <span className="text-danger">*</span>
                      </label> */}
                    <Controller
                      name={`items.${index}.quantity`}
                      control={control}
                      render={({ field }) => (
                        <InputGroup>
                          <InputGroup.Input
                            type="number"
                            min={1}
                            placeholder="Qty"
                            // value={field.value ?? ""}
                            defaultValue={field.value}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === "" ? undefined : Number(val));
                            }}
                            className={cn(errors.items?.[index]?.quantity && "border-danger", "max-w-15 md:max-w-full")}
                            onBlur={field.onBlur}
                            ref={field.ref}
                          />
                          {detailItem?.baseUnitAbbreviation && (
                            <InputGroup.Suffix>
                              <span className="whitespace-nowrap">
                                {detailItem.baseUnitAbbreviation}
                              </span>
                            </InputGroup.Suffix>
                          )}
                        </InputGroup>
                      )}
                    />
                    {errors.items?.[index]?.quantity && (
                      <p className="text-sm text-danger">{errors.items[index].quantity?.message}</p>
                    )}
                  </div>

                  {detailItem ? (
                    <div className="flex flex-col gap-0.5">
                      {/* <label className="text-sm font-medium">Instructions</label> */}
                      <Input
                        placeholder="Instructions"
                        {...register(`items.${index}.instructions`)}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      {/* <label className="text-sm font-medium">Instructions</label> */}
                      <Input
                        placeholder="Instructions"
                        {...register(`items.${index}.instructions`)}
                      />
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant="danger"
                    type="button"
                    className="self-end"
                    onPress={() => remove(index)}
                    isIconOnly
                  >
                    {/* Remove */}
                    <TrashBin/>
                  </Button>
                </div>
              );
            })}
          </div>
        </ScrollShadow>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="update-notes" className="text-sm font-medium">
          Notes
        </label>
        <TextArea
          id="update-notes"
          placeholder="Additional notes (optional)"
          {...register("notes")}
        />
        {errors.notes && <p className="text-sm text-danger">{errors.notes.message}</p>}
      </div>

      {submitError && <p className="text-sm text-danger">{submitError}</p>}
    </form>
  );
}

function InfoField({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-zinc-500">{label}</span>
      {children ?? <span className="text-sm">{value}</span>}
    </div>
  );
}
