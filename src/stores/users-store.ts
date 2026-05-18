import { createEntityStore } from "@/lib/create-entity-store";
import type { User } from "@/types";

export interface UsersFilters {
  isActive: boolean;
  search: string;
}

export const useUsersStore = createEntityStore<User, UsersFilters>(
  { isActive: true, search: "" },
  "users-store",
);
