import { z } from "zod";

export const createAdmissionSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  wardId: z.string().min(1, "Ward is required"),
  admissionDate: z.string().min(1, "Admission date is required"),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateAdmissionFormValues = z.infer<typeof createAdmissionSchema>;

export const admissionSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  wardId: z.string().min(1, "Ward is required"),
  admissionDate: z.string().min(1, "Admission date is required"),
  dischargeDate: z.string().optional(),
  diagnosis: z.string().optional(),
  status: z.enum(["ADMITTED", "DISCHARGED"]).optional(),
  notes: z.string().optional(),
});

export type AdmissionFormValues = z.infer<typeof admissionSchema>;
export type AdmissionStatus = "ADMITTED" | "DISCHARGED";

export interface Admission {
  id: string;
  patientId: string;
  patientName: string;
  admissionNumber: string;
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
