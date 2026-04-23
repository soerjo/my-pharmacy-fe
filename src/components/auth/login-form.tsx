"use client";


import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardContent, Input, Button, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { loginSchema, type LoginFormValues } from "@/types";
import { useLoginStore } from "@/stores";
import { AppLink, PasswordInput } from "@/components/ui";
import { ROUTES } from "@/constants";
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
      </CardContent>
    </Card>
  );
}
