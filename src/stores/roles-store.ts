import { createEntityStore } from "@/lib/create-entity-store";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Role } from "@/types";

export interface RolesFilters {
  search: string;
}

export const useRolesStore = createEntityStore<Role, RolesFilters>(
  { search: "" },
  "roles-store",
);

interface RolesPermissionsState {
  selectedRole: Role | null;
  isPermissionsModalOpen: boolean;
  selectedPermissionIds: string[];

  openPermissionsModal: (role: Role) => void;
  closePermissionsModal: () => void;
  setSelectedPermissionIds: (ids: string[]) => void;
}

export const useRolesPermissionsStore = create<RolesPermissionsState>()(
  devtools(
    (set) => ({
      selectedRole: null,
      isPermissionsModalOpen: false,
      selectedPermissionIds: [],

      openPermissionsModal: (role) =>
        set(
          { isPermissionsModalOpen: true, selectedRole: role, selectedPermissionIds: [] },
          false,
          "openPermissionsModal",
        ),

      closePermissionsModal: () =>
        set(
          { isPermissionsModalOpen: false, selectedRole: null, selectedPermissionIds: [] },
          false,
          "closePermissionsModal",
        ),

      setSelectedPermissionIds: (ids) =>
        set({ selectedPermissionIds: ids }, false, "setSelectedPermissionIds"),
    }),
    { name: "roles-permissions-store" },
  ),
);
