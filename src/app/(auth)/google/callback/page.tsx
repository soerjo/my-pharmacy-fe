"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@heroui/react";
import { TokenManager } from "@/lib/token-manager";
import { ROUTES } from "@/constants";

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();

  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  useEffect(() => {
    if (accessToken) {
      TokenManager.setAccessToken(accessToken);
      if (refreshToken) {
        TokenManager.setRefreshToken(refreshToken);
      }
      window.location.href = ROUTES.home;
    } else {
      setTimeout(() => {
        window.location.href = ROUTES.login;
      }, 3000);
    }
  }, [accessToken, refreshToken]);

  if (!accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-danger">Authentication Failed</h1>
          <p className="mt-2 text-default-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
