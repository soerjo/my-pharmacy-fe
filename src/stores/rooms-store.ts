import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Room } from "@/types";

export interface RoomsFilters {
  isActive: boolean;
  search: string;
}

export interface RoomsPagination {
  page: number;
  pageSize: number;
}

interface RoomsUIState {
  filters: RoomsFilters;
  pagination: RoomsPagination;
  isFormOpen: boolean;
  editingRoom: Room | undefined;
  deletingId: string | null;

  setFilters: (filters: Partial<RoomsFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  openCreateForm: () => void;
  openEditForm: (room: Room) => void;
  closeForm: () => void;
  setDeletingId: (id: string | null) => void;
  resetUI: () => void;
  resetAll: () => void;
}

const DEFAULT_FILTERS: RoomsFilters = {
  isActive: true,
  search: "",
};

const DEFAULT_PAGINATION: RoomsPagination = {
  page: 1,
  pageSize: 10,
};

const INITIAL_STATE = {
  filters: DEFAULT_FILTERS,
  pagination: DEFAULT_PAGINATION,
  isFormOpen: false,
  editingRoom: undefined,
  deletingId: null,
} as const;

export const useRoomsStore = create<RoomsUIState>()(
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
          { isFormOpen: true, editingRoom: undefined },
          false,
          "openCreateForm",
        ),

      openEditForm: (room) =>
        set(
          { isFormOpen: true, editingRoom: room },
          false,
          "openEditForm",
        ),

      closeForm: () =>
        set(
          { isFormOpen: false, editingRoom: undefined },
          false,
          "closeForm",
        ),

      setDeletingId: (id) =>
        set({ deletingId: id }, false, "setDeletingId"),

      resetUI: () =>
        set(
          {
            isFormOpen: false,
            editingRoom: undefined,
            deletingId: null,
          },
          false,
          "resetUI",
        ),

      resetAll: () =>
        set({ ...INITIAL_STATE }, false, "resetAll"),
    }),
    { name: "rooms-store" },
  ),
);
