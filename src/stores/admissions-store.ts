import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Admission } from "@/types";

export interface AdmissionsFilters {
  isActive: boolean;
  search: string;
}

export interface AdmissionsPagination {
  page: number;
  pageSize: number;
}

interface AdmissionsUIState {
  filters: AdmissionsFilters;
  pagination: AdmissionsPagination;
  isFormOpen: boolean;
  editingAdmission: Admission | undefined;
  deletingId: string | null;

  setFilters: (filters: Partial<AdmissionsFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  openCreateForm: () => void;
  openEditForm: (admission: Admission) => void;
  closeForm: () => void;
  setDeletingId: (id: string | null) => void;
  resetUI: () => void;
  resetAll: () => void;
}

const DEFAULT_FILTERS: AdmissionsFilters = {
  isActive: true,
  search: "",
};

const DEFAULT_PAGINATION: AdmissionsPagination = {
  page: 1,
  pageSize: 10,
};

const INITIAL_STATE = {
  filters: DEFAULT_FILTERS,
  pagination: DEFAULT_PAGINATION,
  isFormOpen: false,
  editingAdmission: undefined,
  deletingId: null,
} as const;

export const useAdmissionsStore = create<AdmissionsUIState>()(
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
          { isFormOpen: true, editingAdmission: undefined },
          false,
          "openCreateForm",
        ),

      openEditForm: (admission) =>
        set(
          { isFormOpen: true, editingAdmission: admission },
          false,
          "openEditForm",
        ),

      closeForm: () =>
        set(
          { isFormOpen: false, editingAdmission: undefined },
          false,
          "closeForm",
        ),

      setDeletingId: (id) =>
        set({ deletingId: id }, false, "setDeletingId"),

      resetUI: () =>
        set(
          {
            isFormOpen: false,
            editingAdmission: undefined,
            deletingId: null,
          },
          false,
          "resetUI",
        ),

      resetAll: () =>
        set({ ...INITIAL_STATE }, false, "resetAll"),
    }),
    { name: "admissions-store" },
  ),
);
