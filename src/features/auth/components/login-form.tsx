"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardContent, Input, Button, Spinner } from "@heroui/react";
import { loginSchema, type LoginFormValues } from "@/features/auth/types";
import { useAuth } from "@/features/auth/hooks";
import { AppLink } from "@/components/ui";
import { ROUTES } from "@/constants";

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    await login(data).catch(() => {
    });
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
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-sm text-default-400">
          Enter your credentials to continue
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {error && (
            <div
              role="alert"
              className="rounded-lg bg-danger-50 border border-danger-200 px-4 py-3 text-sm text-danger-700 dark:bg-danger-950 dark:border-danger-800 dark:text-danger-300"
            >
              {error.message || "Login failed. Please try again."}
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

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password <span className="text-danger">*</span>
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-danger">{errors.password.message}</p>
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
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-center text-sm text-default-400">
            Don&apos;t have an account?{" "}
            <AppLink href={ROUTES.home} className="text-primary font-medium">
              Go back
            </AppLink>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
