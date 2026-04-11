import { QueryProvider } from "./query-provider";
import { AuthProvider } from "@/features/auth/providers/auth-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
}
