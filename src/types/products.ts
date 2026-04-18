import { z } from "zod";

export const DOSAGE_FORM_VALUES = ["TABLET", "CAPSULE", "SYRUP", "INJECTION", "CREAM", "OINTMENT", "DROPS", "INHALER", "POWDER", "OTHER"] as const;
export type DosageForm = (typeof DOSAGE_FORM_VALUES)[number];

export const productSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  genericName: z.string().optional(),
  manufacturer: z.string().optional(),
  category: z.string().optional(),
  dosageForm: z.string().optional(),
  strength: z.string().optional(),
  unitPrice: z.number().min(0, "Price must be positive").optional(),
  description: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export interface Product {
  id: string;
  orgId: string;
  sku: string;
  name: string;
  genericName?: string;
  manufacturer?: string;
  categoryName?: string;
  dosageForm?: DosageForm;
  strength?: string;
  unitPrice?: number;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
