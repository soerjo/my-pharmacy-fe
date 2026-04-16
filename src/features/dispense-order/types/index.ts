import { z } from "zod";

export const dispenseOrderSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  prescriptionNumber: z.string().min(1, "Prescription number is required"),
  medications: z.string().min(1, "Medications are required"),
  status: z.enum(["pending", "processing", "completed", "cancelled"]),
  notes: z.string().optional(),
});
export type DispenseOrderFormValues = z.infer<typeof dispenseOrderSchema>;

export type DispenseOrderStatus = "pending" | "processing" | "completed" | "cancelled";

export interface DispenseOrder {
  id: string;
  patientId: string;
  patientName: string;
  prescriptionNumber: string;
  medications: string;
  status: DispenseOrderStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
