import { LoginForm } from "@/components/auth/login-form";
import { GuestRoute } from "@/hooks/use-auth";
import { LoginProvider } from "@/providers/login-provider";

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
