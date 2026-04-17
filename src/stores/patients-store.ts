import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Patient } from "@/types";

export interface PatientsFilters {
  isActive: boolean;
  search: string;
}

export interface PatientsPagination {
  page: number;
  pageSize: number;
}

interface PatientsUIState {
  filters: PatientsFilters;
  pagination: PatientsPagination;
  isFormOpen: boolean;
  editingPatient: Patient | undefined;
  deletingId: string | null;

  setFilters: (filters: Partial<PatientsFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  openCreateForm: () => void;
  openEditForm: (patient: Patient) => void;
  closeForm: () => void;
  setDeletingId: (id: string | null) => void;
  resetUI: () => void;
  resetAll: () => void;
}

const DEFAULT_FILTERS: PatientsFilters = {
  isActive: true,
  search: "",
};

const DEFAULT_PAGINATION: PatientsPagination = {
  page: 1,
  pageSize: 10,
};

const INITIAL_STATE = {
  filters: DEFAULT_FILTERS,
  pagination: DEFAULT_PAGINATION,
  isFormOpen: false,
  editingPatient: undefined,
  deletingId: null,
} as const;

export const usePatientsStore = create<PatientsUIState>()(
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
          { isFormOpen: true, editingPatient: undefined },
          false,
          "openCreateForm",
        ),

      openEditForm: (patient) =>
        set(
          { isFormOpen: true, editingPatient: patient },
          false,
          "openEditForm",
        ),

      closeForm: () =>
        set(
          { isFormOpen: false, editingPatient: undefined },
          false,
          "closeForm",
        ),

      setDeletingId: (id) =>
        set({ deletingId: id }, false, "setDeletingId"),

      resetUI: () =>
        set(
          {
            isFormOpen: false,
            editingPatient: undefined,
            deletingId: null,
          },
          false,
          "resetUI",
        ),

      resetAll: () =>
        set({ ...INITIAL_STATE }, false, "resetAll"),
    }),
    { name: "patients-store" },
  ),
);
