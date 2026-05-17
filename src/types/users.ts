import { z } from "zod";

export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  organizationId: z.string().min(1, "Organization is required"),
  roleId: z.string().optional(),
});

export const updateUserSchema = createUserSchema
  .partial()
  .omit({ password: true })
  .extend({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
  });

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  role: string;
  organizationId: string;
  organizationName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  roleName?: string;
  createdAt: string;
}
