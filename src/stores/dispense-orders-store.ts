import { createEntityStore } from "@/lib/create-entity-store";
import type { DispenseOrder } from "@/types";

function getTodayDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export interface DispenseOrdersFilters {
  search: string;
  status: string;
  startDate: string;
  endDate: string;
}

export const useDispenseOrdersStore = createEntityStore<DispenseOrder, DispenseOrdersFilters>(
  { search: "", status: "", startDate: getTodayDateString(), endDate: getTodayDateString() },
  "dispense-orders-store",
);
