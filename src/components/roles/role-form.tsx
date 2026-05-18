"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, TextArea } from "@heroui/react";

const roleFormSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

interface RoleFormProps {
  defaultValues?: Partial<RoleFormValues>;
  onSubmit: (data: RoleFormValues) => Promise<void>;
  onClose: () => void;
  formId: string;
  onSubmittingChange?: (submitting: boolean) => void;
  isSubmitting?: boolean;
}

export function RoleForm({
  defaultValues,
  onSubmit,
  onClose: _onClose,
  formId,
  onSubmittingChange,
  isSubmitting = false,
}: RoleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
    },
  });

  useEffect(() => {
    onSubmittingChange?.(isSubmitting);
  }, [isSubmitting, onSubmittingChange]);

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="role-name" className="text-sm font-medium">
          Role Name
        </label>
        <Input
          id="role-name"
          placeholder="e.g. Admin, Pharmacist, Viewer"
          {...register("name")}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-danger">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="role-description" className="text-sm font-medium">
          Description
        </label>
        <TextArea
          id="role-description"
          placeholder="Optional description of this role"
          {...register("description")}
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
}
