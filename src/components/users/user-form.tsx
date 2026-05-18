"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Select, SelectTrigger, SelectValue, SelectPopover, ListBox, Label, ListBoxItem } from "@heroui/react";
import { useAllRoles } from "@/hooks/use-roles";

const userFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  roleId: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  defaultValues?: Partial<UserFormValues>;
  onSubmit: (data: UserFormValues) => Promise<void>;
  onClose: () => void;
  formId: string;
  onSubmittingChange?: (submitting: boolean) => void;
  isSubmitting?: boolean;
}

export function UserForm({
  defaultValues,
  onSubmit,
  onClose: _onClose,
  formId,
  onSubmittingChange,
  isSubmitting = false,
}: UserFormProps) {
  const isEditing = !!defaultValues?.email;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: defaultValues?.email ?? "",
      password: "",
      firstName: defaultValues?.firstName ?? "",
      lastName: defaultValues?.lastName ?? "",
      roleId: defaultValues?.roleId ?? "",
    },
  });

  const { data: roles = [], isLoading: rolesLoading } = useAllRoles();

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
        <label htmlFor="user-email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="user-email"
          placeholder="user@example.com"
          {...register("email")}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-danger">{errors.email.message}</p>
        )}
      </div>

      {!isEditing && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="user-password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="user-password"
            placeholder="Min. 8 characters"
            type="password"
            {...register("password")}
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="text-sm text-danger">{errors.password.message}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="user-firstName" className="text-sm font-medium">
            First Name
          </label>
          <Input
            id="user-firstName"
            placeholder="John"
            {...register("firstName")}
            disabled={isSubmitting}
          />
          {errors.firstName && (
            <p className="text-sm text-danger">{errors.firstName.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="user-lastName" className="text-sm font-medium">
            Last Name
          </label>
          <Input
            id="user-lastName"
            placeholder="Doe"
            {...register("lastName")}
            disabled={isSubmitting}
          />
          {errors.lastName && (
            <p className="text-sm text-danger">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Controller
          name="roleId"
          control={control}
          render={({ field }) => (
            <Select
              selectedKey={field.value || undefined}
              onSelectionChange={(key) => field.onChange(key ? String(key) : "")}
              fullWidth
              isDisabled={isSubmitting || rolesLoading}
            >
              <Label>Role</Label>
              <SelectTrigger>
                <SelectValue />
                <Select.Indicator />
              </SelectTrigger>
              <SelectPopover>
                <ListBox items={roles}>
                  {(role) => (
                    <ListBoxItem key={role.id} textValue={role.name}>
                      {role.name}
                    </ListBoxItem>
                  )}
                </ListBox>
              </SelectPopover>
            </Select>
          )}
        />
      </div>
    </form>
  );
}
