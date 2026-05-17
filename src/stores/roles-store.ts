import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Role } from "@/types";

interface RolesState {
  selectedRole: Role | null;
  isFormOpen: boolean;
  isPermissionsModalOpen: boolean;
  selectedPermissionIds: string[];
  editingRole: Role | null;

  setSelectedRole: (role: Role | null) => void;
  openCreateForm: () => void;
  openEditForm: (role: Role) => void;
  closeForm: () => void;
  openPermissionsModal: (role: Role) => void;
  closePermissionsModal: () => void;
  setSelectedPermissionIds: (ids: string[]) => void;
  resetAll: () => void;
}

const INITIAL_STATE = {
  selectedRole: null,
  isFormOpen: false,
  isPermissionsModalOpen: false,
  selectedPermissionIds: [] as string[],
  editingRole: null as Role | null,
};

export const useRolesStore = create<RolesState>()(
  devtools(
    (set) => ({
      ...INITIAL_STATE,

      setSelectedRole: (role) => set({ selectedRole: role }, false, "setSelectedRole"),

      openCreateForm: () =>
        set({ isFormOpen: true, editingRole: null }, false, "openCreateForm"),

      openEditForm: (role) =>
        set({ isFormOpen: true, editingRole: role }, false, "openEditForm"),

      closeForm: () =>
        set({ isFormOpen: false, editingRole: null }, false, "closeForm"),

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

      resetAll: () => set({ ...INITIAL_STATE }, false, "resetAll"),
    }),
    { name: "roles-store" },
  ),
);
