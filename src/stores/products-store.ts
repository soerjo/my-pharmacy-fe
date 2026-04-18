import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Product } from "@/types";

export interface ProductsFilters {
  isActive: boolean;
  search: string;
}

export interface ProductsPagination {
  page: number;
  pageSize: number;
}

interface ProductsUIState {
  filters: ProductsFilters;
  pagination: ProductsPagination;
  isFormOpen: boolean;
  editingProduct: Product | undefined;
  deletingId: string | null;

  setFilters: (filters: Partial<ProductsFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  openCreateForm: () => void;
  openEditForm: (product: Product) => void;
  closeForm: () => void;
  setDeletingId: (id: string | null) => void;
  resetUI: () => void;
  resetAll: () => void;
}

const DEFAULT_FILTERS: ProductsFilters = {
  isActive: true,
  search: "",
};

const DEFAULT_PAGINATION: ProductsPagination = {
  page: 1,
  pageSize: 10,
};

const INITIAL_STATE = {
  filters: DEFAULT_FILTERS,
  pagination: DEFAULT_PAGINATION,
  isFormOpen: false,
  editingProduct: undefined,
  deletingId: null,
} as const;

export const useProductsStore = create<ProductsUIState>()(
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
          { isFormOpen: true, editingProduct: undefined },
          false,
          "openCreateForm",
        ),

      openEditForm: (product) =>
        set(
          { isFormOpen: true, editingProduct: product },
          false,
          "openEditForm",
        ),

      closeForm: () =>
        set(
          { isFormOpen: false, editingProduct: undefined },
          false,
          "closeForm",
        ),

      setDeletingId: (id) =>
        set({ deletingId: id }, false, "setDeletingId"),

      resetUI: () =>
        set(
          {
            isFormOpen: false,
            editingProduct: undefined,
            deletingId: null,
          },
          false,
          "resetUI",
        ),

      resetAll: () =>
        set({ ...INITIAL_STATE }, false, "resetAll"),
    }),
    { name: "products-store" },
  ),
);
