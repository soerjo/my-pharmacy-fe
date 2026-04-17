import { QueryProvider } from "./query-provider";
import { AuthProvider } from "./auth-provider";

export { AuthProvider } from "./auth-provider";
export { LoginProvider } from "./login-provider";
export { RegisterProvider } from "./register-provider";
export { ForgotPasswordProvider } from "./forgot-password-provider";
export { ResetPasswordProvider } from "./reset-password-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
}
