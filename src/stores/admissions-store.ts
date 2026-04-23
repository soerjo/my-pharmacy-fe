import { createEntityStore } from "@/lib/create-entity-store";
import type { Admission } from "@/types";

export interface AdmissionsFilters {
  isActive: boolean;
  search: string;
}

export const useAdmissionsStore = createEntityStore<Admission, AdmissionsFilters>(
  { isActive: true, search: "" },
  "admissions-store",
);
