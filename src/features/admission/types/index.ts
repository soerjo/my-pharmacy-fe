import { z } from "zod";

export const admissionSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  admissionDate: z.string().min(1, "Admission date is required"),
  dischargeDate: z.string().optional(),
  wardId: z.string().min(1, "Ward is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  status: z.enum(["admitted", "discharged", "transferred"]).optional(),
  notes: z.string().optional(),
});

export type AdmissionFormValues = z.infer<typeof admissionSchema>;
export type AdmissionStatus = "admitted" | "discharged" | "transferred";

export interface Admission {
  id: string;
  patientId: string;
  patientName: string;
  admissionDate: string;
  dischargeDate?: string;
  wardId: string;
  wardName: string;
  diagnosis: string;
  status: AdmissionStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
