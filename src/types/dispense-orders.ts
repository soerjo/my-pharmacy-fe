import { z } from "zod";

export type DispenseOrderStatus = "PENDING" | "PREPARING" | "DISPENSED" | "CANCELLED";

export interface DispenseOrderItem {
  id: string;
  dispenseOrderId: string;
  drugId: string;
  quantity: number;
  instructions: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string | null;
}

export interface DispenseOrder {
  id?: string;
  orgId?: string;
  orderNumber: string;
  patientId: string;
  admissionId: string;
  dispensedAt: string | null;
  notes: string;
  cancelReason: string | null;
  status: DispenseOrderStatus;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string | null;
  type: string | null;
  admissionNumber: string | null;
  admissionDate: string | null;
  roomId: string | null;
  items?: DispenseOrderItem[];
}

const dispenseOrderItemSchema = z.object({
  drugId: z.string().min(1, "Drug is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  instructions: z.string(),
});

export const dispenseOrderSchema = z.object({
  // patientId: z.string().min(1, "Patient is required"),
  admissionId: z.string().min(1, "Admission is required"),
  notes: z.string(),
  items: z.array(dispenseOrderItemSchema).min(1, "At least one item is required"),
});

export type DispenseOrderFormValues = z.infer<typeof dispenseOrderSchema>;
