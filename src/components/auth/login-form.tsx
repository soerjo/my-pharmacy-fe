"use client";


import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardContent, Input, Button, Spinner, Separator } from "@heroui/react";
import { useRouter } from "next/navigation";
import { loginSchema, type LoginFormValues } from "@/types";
import { useLoginStore } from "@/stores";
import { AppLink, PasswordInput } from "@/components/ui";
import { ROUTES } from "@/constants";
import { appConfig } from "@/config";
import { onServerError } from "@/providers/error-provider";

export function LoginForm() {
  const { login, isLoading } = useLoginStore();
  const router = useRouter();

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
    try {
      await login(data);
      router.push(ROUTES.home);
    } catch (err) {
      onServerError(err);
    }
  }

  return (
    <Card className="w-full max-w-md mx-4 px-4 md:mx-0">
      <CardHeader className="flex flex-col items-center gap-2 pb-2">
        <Image src="/pwa-192x192.png" alt="Logo" width={48} height={48} priority />
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-sm text-default-400">
          Enter your credentials to continue
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
            <PasswordInput
              name="password"
              label="Password"
              placeholder="Enter your password"
              register={register}
              error={errors.password?.message}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <AppLink href={ROUTES.forgotPassword} className="text-xs text-primary">
              Forgot password?
            </AppLink>
          </div>


          <Button
            type="submit"
            variant="primary"
            fullWidth
            isDisabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-default-400">OR</span>
          <Separator className="flex-1" />
        </div>

        <Button
          variant="secondary"
          fullWidth
          onPress={() => {
            window.location.href = `${appConfig.auth.apiUrl}/auth/google`;
          }}
        >
          <svg className="size-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Sign in with Google
        </Button>

        <p className="mt-4 text-center text-sm text-default-400">
          Don&apos;t have an account?{" "}
          <AppLink href={ROUTES.register} className="text-primary font-medium">
            Create one
          </AppLink>
        </p>
      </CardContent>
    </Card>
  );
}
