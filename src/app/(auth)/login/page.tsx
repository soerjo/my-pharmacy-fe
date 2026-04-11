import { LoginForm } from "@/features/auth/components";
import { GuestRoute } from "@/features/auth/hooks";

export default function LoginPage() {
  return (
    <GuestRoute>
      <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
        <LoginForm />
      </div>
    </GuestRoute>
  );
}
