import { createEntityStore } from "@/lib/create-entity-store";
import type { Patient } from "@/types";

export interface PatientsFilters {
  isActive: boolean;
  search: string;
}

export const usePatientsStore = createEntityStore<Patient, PatientsFilters>(
  { isActive: true, search: "" },
  "patients-store",
);
