import { z } from "zod";

export const roomSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  categoryId: z.string(),
});

export type RoomFormValues = z.infer<typeof roomSchema>;

export interface Room {
  id: string;
  orgId: string;
  code?: string;
  name: string;
  categoryId?: string;
  categoryName?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
