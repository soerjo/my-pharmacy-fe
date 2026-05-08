import { createEntityStore } from "@/lib/create-entity-store";
import type { Admission, AdmissionStatus } from "@/types";

export interface AdmissionsFilters {
  status: AdmissionStatus;
  search: string;
}

export const useAdmissionsStore = createEntityStore<Admission, AdmissionsFilters>(
  { status: "ADMITTED", search: "" },
  "admissions-store",
);
