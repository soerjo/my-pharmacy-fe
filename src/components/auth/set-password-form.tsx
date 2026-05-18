"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Spinner } from "@heroui/react";
import { setPasswordSchema, type SetPasswordFormValues } from "@/types";
import { authService } from "@/services/auth-service";
import { PasswordInput } from "@/components/ui";
import { onServerError } from "@/providers/error-provider";

export function SetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: SetPasswordFormValues) {
    setIsLoading(true);
    try {
      await authService.setPassword({ newPassword: data.newPassword });
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
      <h3 className="text-base font-semibold">Set Password</h3>
      <p className="text-sm text-default-400">
        You registered via Google and have no password set yet. Create a password
        to enable email/password login.
      </p>

      {isSuccess && (
        <p className="text-sm text-success">Password set successfully.</p>
      )}

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
        label="Confirm Password"
        placeholder="Confirm new password"
        register={register}
        error={errors.confirmPassword?.message}
        required
      />

      <Button type="submit" variant="primary" isDisabled={isLoading} className="w-fit">
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Spinner size="sm" />
            Setting...
          </span>
        ) : (
          "Set Password"
        )}
      </Button>
    </form>
  );
}
