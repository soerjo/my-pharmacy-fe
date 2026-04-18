import { z } from "zod";

export const roomCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  isIntensive: z.boolean(),
  description: z.string(),
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type RoomCategory = z.infer<typeof roomCategorySchema>;
