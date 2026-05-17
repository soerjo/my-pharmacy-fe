import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
});

export const updateRoleSchema = createRoleSchema.partial();

export const assignPermissionsSchema = z.object({
  permissionIds: z
    .array(z.string())
    .min(1, "At least one permission is required"),
});

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;
export type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>;
export type AssignPermissionsFormValues = z.infer<
  typeof assignPermissionsSchema
>;

export interface Role {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[];
  _count?: {
    userRoles: number;
    rolePermissions: number;
  };
}

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  group: string | null;
  createdAt: string;
  updatedAt: string;
}
