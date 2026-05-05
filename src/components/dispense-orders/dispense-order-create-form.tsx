"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispenseOrders } from "@/hooks/use-dispense-orders";
import { DispenseOrderFormBody } from "./dispense-order-form-body";
import { dispenseCreateOrderSchema, type DispenseOrderCreateFormValues } from "@/types/dispense-orders";
import type { Product } from "@/types";

interface DispenseOrderCreateFormProps {
  onClose: () => void;
  formId: string;
  onDirtyChange?: (dirty: boolean) => void;
  onSubmittingChange?: (submitting: boolean) => void;
}

export function DispenseOrderCreateForm({ onClose, formId, onDirtyChange, onSubmittingChange }: DispenseOrderCreateFormProps) {
  const { createOrder } = useDispenseOrders();

  const [productMap, setProductMap] = useState<Map<string, Product>>(new Map());

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<DispenseOrderCreateFormValues>({
    resolver: zodResolver(dispenseCreateOrderSchema),
    defaultValues: {
      admissionId: "",
      admissionDate: new Date().toISOString().split("T")[0],
      notes: "",
      items: [{ drugId: "", quantity: 1, instructions: "" }],
    },
  });

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const watchedItems = watch("items");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const handleProductSelect = useCallback((product: Product | null) => {
    if (product) {
      setProductMap((prev) => new Map(prev).set(product.id, product));
    }
  }, []);

  async function onSubmit(data: DispenseOrderCreateFormValues) {
    try {
      onSubmittingChange?.(true);
      await createOrder(data);
      onDirtyChange?.(false);
      onClose();
    } catch {
      onSubmittingChange?.(false);
    }
  }

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <DispenseOrderFormBody
        control={control}
        register={register}
        errors={errors}
        fields={fields}
        append={append}
        remove={remove}
        watchedItems={watchedItems}
        productMap={productMap}
        onProductSelect={handleProductSelect}
      />
    </form>
  );
}
