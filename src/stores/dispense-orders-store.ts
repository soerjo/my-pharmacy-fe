import { create } from "zustand";
import { devtools } from "zustand/middleware";
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

interface CancelOrderState {
  cancellingOrderId: string | null;
  cancelReason: string;
  openCancelModal: (id: string) => void;
  closeCancelModal: () => void;
  setCancelReason: (reason: string) => void;
}

const INITIAL_CANCEL_STATE = {
  cancellingOrderId: null as string | null,
  cancelReason: "",
};

export const useCancelOrderStore = create<CancelOrderState>()(
  devtools(
    (set) => ({
      ...INITIAL_CANCEL_STATE,
      openCancelModal: (id: string) =>
        set({ cancellingOrderId: id, cancelReason: "" }, false, "openCancelModal"),
      closeCancelModal: () =>
        set(INITIAL_CANCEL_STATE, false, "closeCancelModal"),
      setCancelReason: (reason: string) =>
        set({ cancelReason: reason }, false, "setCancelReason"),
    }),
    { name: "cancel-order-store" },
  ),
);
