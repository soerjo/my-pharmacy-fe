"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Spinner } from "@heroui/react";
import { changePasswordSchema, type ChangePasswordFormValues } from "@/types";
import { authService } from "@/services/auth-service";
import { PasswordInput } from "@/components/ui";
import { onServerError } from "@/providers/error-provider";

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ChangePasswordFormValues) {
    setIsLoading(true);
    try {
      const { confirmPassword: _, ...rest } = data;
      void _;
      const { currentPassword, newPassword } = rest;
      await authService.changePassword({ currentPassword, newPassword });
      setIsSuccess(true);
      reset();
    } catch (err) {
      onServerError(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h3 className="text-base font-semibold">Change Password</h3>

      {isSuccess && (
        <p className="text-sm text-success">Password changed successfully.</p>
      )}

      <PasswordInput
        name="currentPassword"
        label="Current Password"
        placeholder="Enter current password"
        register={register}
        error={errors.currentPassword?.message}
        required
      />

      <PasswordInput
        name="newPassword"
        label="New Password"
        placeholder="Enter new password"
        register={register}
        error={errors.newPassword?.message}
        required
      />

      <PasswordInput
        name="confirmPassword"
        label="Confirm New Password"
        placeholder="Confirm new password"
        register={register}
        error={errors.confirmPassword?.message}
        required
      />

      <Button type="submit" variant="primary" isDisabled={isLoading} className="w-fit">
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Spinner size="sm" />
            Changing...
          </span>
        ) : (
          "Change Password"
        )}
      </Button>
    </form>
  );
}
