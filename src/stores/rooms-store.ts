import { createEntityStore } from "@/lib/create-entity-store";
import type { Room } from "@/types";

export interface RoomsFilters {
  isActive: boolean;
  search: string;
}

export const useRoomsStore = createEntityStore<Room, RoomsFilters>(
  { isActive: true, search: "" },
  "rooms-store",
);
