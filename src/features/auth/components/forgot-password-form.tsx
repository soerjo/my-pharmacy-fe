"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardContent, Input, Button, Spinner } from "@heroui/react";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/features/auth/types";
import { useForgotPassword } from "@/features/auth/hooks";
import { AppLink } from "@/components/ui";
import { ROUTES } from "@/constants";

export function ForgotPasswordForm() {
  const { forgotPassword, isLoading, error } = useForgotPassword();
  const [mounted, setMounted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    try {
      await forgotPassword(data);
      setIsSuccess(true);
    } catch {
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md px-4">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-success"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h1 className="text-2xl font-bold">Check Your Email</h1>
          <p className="text-center text-sm text-default-400">
            We&apos;ve sent a password reset link to your email address.
          </p>
        </CardHeader>

        <CardContent>
          <p className="text-center text-sm text-default-400">
            <AppLink href={ROUTES.login} className="text-primary font-medium">
              Back to login
            </AppLink>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md px-4">
      <CardHeader className="flex flex-col items-center gap-2 pb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-default-400"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-center text-sm text-default-400">
          Enter your email to receive a password reset link
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {error && (
            <div
              role="alert"
              className="rounded-lg bg-danger-50 border border-danger-200 px-4 py-3 text-sm text-danger-700 dark:bg-danger-950 dark:border-danger-800 dark:text-danger-300"
            >
              {error.message || "Failed to send reset link. Please try again."}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-danger">*</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-danger">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isDisabled={mounted ? Boolean(isLoading) : false}
          >
            {mounted && isLoading ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" />
                Sending...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </Button>

          <p className="text-center text-sm text-default-400">
            Remember your password?{" "}
            <AppLink href={ROUTES.login} className="text-primary font-medium">
              Back to login
            </AppLink>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
