import { z } from "zod";

export const DOSAGE_FORM_VALUES = [
  "TABLET",
  "CAPSULE",
  "SYRUP",
  "INJECTION",
  "CREAM",
  "OINTMENT",
  "DROPS",
  "INHALER",
  "POWDER",
  "OTHER",
] as const;
export type DosageForm = (typeof DOSAGE_FORM_VALUES)[number];

export const PRODUCT_TYPE_VALUES = [
  "BRANDED",
  "GENERIC",
  "OTC",
  "SUPPLEMENT",
  "MEDICAL_DEVICE",
  "OTHER",
] as const;
export type ProductType = (typeof PRODUCT_TYPE_VALUES)[number];

export const productSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  productType: z.string().min(1, "Product type is required"),
  dosageForm: z.string().optional(),
  strength: z.string().optional(),
  casNumber: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  manufacturerId: z.string().min(1, "Manufacturer is required"),
  baseUnitId: z.string().min(1, "Base unit is required"),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export interface Product {
  id: string;
  organizationId: string;
  code?: string;
  name: string;
  description?: string;
  productType?: ProductType;
  dosageForm?: DosageForm;
  strength?: string;
  casNumber?: string;
  categoryId?: string;
  categoryName?: string;
  manufacturerId?: string;
  manufacturerName?: string;
  baseUnitId?: string;
  baseUnitName?: string;
  baseUnitCode?: string;
  baseUnitAbbreviation?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
