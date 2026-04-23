import { createEntityStore } from "@/lib/create-entity-store";
import type { DispenseOrder } from "@/types";

export interface DispenseOrdersFilters {
  search: string;
  status: string;
}

export const useDispenseOrdersStore = createEntityStore<DispenseOrder, DispenseOrdersFilters>(
  { search: "", status: "" },
  "dispense-orders-store",
);
