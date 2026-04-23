"use client";


import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, Input, Button, Spinner } from "@heroui/react";
import { registerSchema, type RegisterFormValues } from "@/types";
import { useRegisterStore } from "@/stores";
import { AppLink, PasswordInput } from "@/components/ui";
import { ROUTES } from "@/constants";
import { ApiError } from "@/lib";

export function RegisterForm() {
  const { register: registerUser, isLoading } = useRegisterStore();
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [apiErrMsg, setApiErrMsg] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterFormValues, event?: React.BaseSyntheticEvent) {
    event?.preventDefault();
    
    try {
      await registerUser(data);
      setSuccess(true);
      router.push(ROUTES.login);
    } catch(error: unknown) {
      if(error instanceof ApiError) {
        if(error.status == 400) {
          const errorMessage = error.message;
          const errorResponse: ApiError = JSON.parse(errorMessage);
          setApiErrMsg(errorResponse.message);
        }
      }
    }
  }
  
  if (success) {
    return (
      <Card className="w-full max-w-md mx-4 px-4 md:mx-0">
        <CardContent className="flex flex-col items-center gap-4 py-8">
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
          <h1 className="text-2xl font-bold">Registration Successful</h1>
          <p className="text-sm text-default-400 text-center">
            Redirecting to login...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-4 px-4 md:mx-0">
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
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" x2="19" y1="8" y2="14" />
          <line x1="22" x2="16" y1="11" y2="11" />
        </svg>
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-sm text-default-400">
          Fill in your details to get started
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* {error && (
            <div
              role="alert"
              className="rounded-lg bg-danger-50 border border-danger-200 px-4 py-3 text-sm text-danger-700 dark:bg-danger-950 dark:border-danger-800 dark:text-danger-300"
            >
              {error.message || "Registration failed. Please try again."}
            </div>
          )} */}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="firstName" className="text-sm font-medium">
                First Name <span className="text-danger">*</span>
              </label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-sm text-danger">{errors.firstName.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last Name <span className="text-danger">*</span>
              </label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-sm text-danger">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-danger">*</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
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

          <div className="flex flex-col gap-1.5">
            <PasswordInput
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm new password"
              register={register}
              error={errors.confirmPassword?.message}
              required
            />
          </div>

          {apiErrMsg && <p className="text-sm text-red-400">{apiErrMsg}</p>}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isDisabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>

          <p className="text-center text-sm text-default-400">
            Already have an account?{" "}
            <AppLink href={ROUTES.login} className="text-primary font-medium">
              Sign in
            </AppLink>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
