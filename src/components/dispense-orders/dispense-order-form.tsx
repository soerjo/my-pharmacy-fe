"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Spinner, TextArea } from "@heroui/react";
import { dispenseOrderSchema, type DispenseOrderFormValues, type DispenseOrder } from "@/types";
import { useDispenseOrders } from "@/hooks/use-dispense-orders";

interface DispenseOrderFormProps {
  order?: DispenseOrder;
  onClose: () => void;
}

export function DispenseOrderForm({ order, onClose }: DispenseOrderFormProps) {
  const { createOrder, updateOrder, isCreating, isUpdating } = useDispenseOrders();
  const isEditing = !!order;
  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DispenseOrderFormValues>({
    resolver: zodResolver(dispenseOrderSchema),
    defaultValues: order
      ? {
          patientId: order.patientId,
          prescriptionNumber: order.prescriptionNumber,
          medications: order.medications,
          status: order.status,
          notes: order.notes ?? "",
        }
      : {
          patientId: "",
          prescriptionNumber: "",
          medications: "",
          status: "pending",
          notes: "",
        },
  });

  async function onSubmit(data: DispenseOrderFormValues) {
    if (isEditing && order) {
      await updateOrder(order.id, data);
    } else {
      await createOrder(data);
    }
    onClose();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="patientId" className="text-sm font-medium">
          Patient ID <span className="text-danger">*</span>
        </label>
        <Input
          id="patientId"
          placeholder="Enter patient ID"
          {...register("patientId")}
        />
        {errors.patientId && (
          <p className="text-sm text-danger">{errors.patientId.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="prescriptionNumber" className="text-sm font-medium">
          Prescription Number <span className="text-danger">*</span>
        </label>
        <Input
          id="prescriptionNumber"
          placeholder="Enter prescription number"
          {...register("prescriptionNumber")}
        />
        {errors.prescriptionNumber && (
          <p className="text-sm text-danger">{errors.prescriptionNumber.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="medications" className="text-sm font-medium">
          Medications <span className="text-danger">*</span>
        </label>
        <TextArea
          id="medications"
          placeholder="Enter medications (e.g., Amoxicillin 500mg, Paracetamol 500mg)"
          {...register("medications")}
        />
        {errors.medications && (
          <p className="text-sm text-danger">{errors.medications.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="status" className="text-sm font-medium">
          Status <span className="text-danger">*</span>
        </label>
        <select
          id="status"
          className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
          {...register("status")}
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {errors.status && (
          <p className="text-sm text-danger">{errors.status.message}</p>
        )}
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
