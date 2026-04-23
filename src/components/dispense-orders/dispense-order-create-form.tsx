"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dispenseOrderSchema, type DispenseOrderFormValues } from "@/types";
import { useDispenseOrders } from "@/hooks/use-dispense-orders";
import { DispenseOrderFormBody } from "./dispense-order-form-body";

interface DispenseOrderCreateFormProps {
  onClose: () => void;
  formId: string;
}

export function DispenseOrderCreateForm({ onClose, formId }: DispenseOrderCreateFormProps) {
  const { createOrder } = useDispenseOrders();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DispenseOrderFormValues>({
    resolver: zodResolver(dispenseOrderSchema),
    defaultValues: {
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
      await createOrder(data);
      onClose();
    } catch {
      setSubmitError("Failed to create order. Please try again.");
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
      />
      {submitError && <p className="text-sm text-danger">{submitError}</p>}
    </form>
  );
}
