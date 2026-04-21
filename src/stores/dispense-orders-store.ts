import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { DispenseOrder, DispenseOrderFormValues } from "@/types";
import { depoService } from "@/services/depo-service";

export interface DispenseOrdersFilters {
  search: string;
  status: string;
}

export interface DispenseOrdersPagination {
  page: number;
  pageSize: number;
}

interface DispenseOrdersState {
  filters: DispenseOrdersFilters;
  pagination: DispenseOrdersPagination;
  isFormOpen: boolean;
  editingOrder: DispenseOrder | undefined;
  deletingId: string | null;

  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: Error | null;

  setFilters: (filters: Partial<DispenseOrdersFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  openCreateForm: () => void;
  openEditForm: (order: DispenseOrder) => void;
  closeForm: () => void;
  setDeletingId: (id: string | null) => void;

  createOrder: (data: DispenseOrderFormValues) => Promise<void>;
  updateOrder: (id: string, data: DispenseOrderFormValues) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  resetUI: () => void;
  resetAll: () => void;
}

const DEFAULT_FILTERS: DispenseOrdersFilters = {
  search: "",
  status: "",
};

const DEFAULT_PAGINATION: DispenseOrdersPagination = {
  page: 1,
  pageSize: 10,
};

const INITIAL_STATE = {
  filters: DEFAULT_FILTERS,
  pagination: DEFAULT_PAGINATION,
  isFormOpen: false,
  editingOrder: undefined,
  deletingId: null,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
} as const;

export const useDispenseOrdersStore = create<DispenseOrdersState>()(
  devtools(
    (set) => ({
      ...INITIAL_STATE,

      setFilters: (partial) =>
        set(
          (state) => ({
            filters: { ...state.filters, ...partial },
            pagination: DEFAULT_PAGINATION,
          }),
          false,
          "setFilters",
        ),

      resetFilters: () =>
        set(
          { filters: DEFAULT_FILTERS, pagination: DEFAULT_PAGINATION },
          false,
          "resetFilters",
        ),

      setPage: (page) =>
        set(
          (state) => ({ pagination: { ...state.pagination, page } }),
          false,
          "setPage",
        ),

      setPageSize: (pageSize) =>
        set(
          (state) => ({
            pagination: { ...state.pagination, pageSize, page: 1 },
          }),
          false,
          "setPageSize",
        ),

      openCreateForm: () =>
        set(
          { isFormOpen: true, editingOrder: undefined },
          false,
          "openCreateForm",
        ),

      openEditForm: (order) =>
        set(
          { isFormOpen: true, editingOrder: order },
          false,
          "openEditForm",
        ),

      closeForm: () =>
        set(
          { isFormOpen: false, editingOrder: undefined },
          false,
          "closeForm",
        ),

      setDeletingId: (id) =>
        set({ deletingId: id }, false, "setDeletingId"),

      createOrder: async (data) => {
        set({ isCreating: true, error: null }, false, "createOrder/start");
        try {
          await depoService.createDispenseOrder(data);
          set({ isCreating: false }, false, "createOrder/success");
        } catch (error) {
          set({ isCreating: false, error: error as Error }, false, "createOrder/error");
          throw error;
        }
      },

      updateOrder: async (id, data) => {
        set({ isUpdating: true, error: null }, false, "updateOrder/start");
        try {
          await depoService.updateDispenseOrder(id, data);
          set({ isUpdating: false }, false, "updateOrder/success");
        } catch (error) {
          set({ isUpdating: false, error: error as Error }, false, "updateOrder/error");
          throw error;
        }
      },

      deleteOrder: async (id) => {
        set({ isDeleting: true, error: null }, false, "deleteOrder/start");
        try {
          await depoService.deleteDispenseOrder(id);
          set({ isDeleting: false }, false, "deleteOrder/success");
        } catch (error) {
          set({ isDeleting: false, error: error as Error }, false, "deleteOrder/error");
          throw error;
        }
      },

      resetUI: () =>
        set(
          {
            isFormOpen: false,
            editingOrder: undefined,
            deletingId: null,
          },
          false,
          "resetUI",
        ),

      resetAll: () =>
        set({ ...INITIAL_STATE }, false, "resetAll"),
    }),
    { name: "dispense-orders-store" },
  ),
);
