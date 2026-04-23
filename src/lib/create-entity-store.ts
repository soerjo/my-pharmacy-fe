import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface EntityUIState<T, F> {
  filters: F;
  pagination: { page: number; pageSize: number };
  isFormOpen: boolean;
  editingEntity: T | undefined;
  deletingId: string | null;

  setFilters: (filters: Partial<F>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  openCreateForm: () => void;
  openEditForm: (entity: T) => void;
  closeForm: () => void;
  setDeletingId: (id: string | null) => void;
  resetUI: () => void;
  resetAll: () => void;
}

export function createEntityStore<T, F extends object>(
  defaultFilters: F,
  storeName: string,
) {
  const DEFAULT_PAGINATION = { page: 1, pageSize: 10 } as const;

  const INITIAL_STATE = {
    filters: defaultFilters,
    pagination: DEFAULT_PAGINATION,
    isFormOpen: false,
    editingEntity: undefined as T | undefined,
    deletingId: null as string | null,
  };

  return create<EntityUIState<T, F>>()(
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
          set({ filters: defaultFilters, pagination: DEFAULT_PAGINATION }, false, "resetFilters"),

        setPage: (page) =>
          set((state) => ({ pagination: { ...state.pagination, page } }), false, "setPage"),

        setPageSize: (pageSize) =>
          set(
            (state) => ({ pagination: { ...state.pagination, pageSize, page: 1 } }),
            false,
            "setPageSize",
          ),

        openCreateForm: () =>
          set({ isFormOpen: true, editingEntity: undefined }, false, "openCreateForm"),

        openEditForm: (entity: T) =>
          set({ isFormOpen: true, editingEntity: entity }, false, "openEditForm"),

        closeForm: () =>
          set({ isFormOpen: false, editingEntity: undefined }, false, "closeForm"),

        setDeletingId: (id) => set({ deletingId: id }, false, "setDeletingId"),

        resetUI: () =>
          set({ isFormOpen: false, editingEntity: undefined, deletingId: null }, false, "resetUI"),

        resetAll: () => set({ ...INITIAL_STATE }, false, "resetAll"),
      }),
      { name: storeName },
    ),
  );
}
