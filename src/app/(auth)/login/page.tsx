import { LoginForm } from "@/features/auth/components";
import { GuestRoute } from "@/features/auth/hooks";
import { LoginProvider } from "@/features/auth/providers/login-provider";

export default function LoginPage() {
  return (
    <GuestRoute>
      <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
        <LoginProvider>
          <LoginForm />
        </LoginProvider>
      </div>
    </GuestRoute>
  );
}
