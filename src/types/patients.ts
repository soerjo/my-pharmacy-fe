import { z } from "zod";

export const GENDER_VALUES = ["MALE", "FEMALE", "OTHER"] as const;
export type Gender = (typeof GENDER_VALUES)[number];

export const patientSchema = z.object({
  mrn: z.string().min(1, "MRN is required"),
  name: z.string().min(1, "Name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().refine((v) => GENDER_VALUES.includes(v as Gender), "Invalid gender"),
  phone: z.string().optional(),
  address: z.string().optional(),
  allergies: z.string().optional(),
  notes: z.string().optional(),
});

export type PatientFormValues = z.infer<typeof patientSchema>;

export interface Patient {
  id: string;
  orgId: string;
  mrn: string;
  name: string;
  dateOfBirth?: string;
  gender?: Gender;
  phone?: string;
  address?: string;
  allergies?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
