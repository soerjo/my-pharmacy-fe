import { RegisterForm } from "@/components/auth/register-form";
import { GuestRoute } from "@/hooks/use-auth";

export default function RegisterPage() {
  return (
    <GuestRoute>
      <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
        <RegisterForm />
      </div>
    </GuestRoute>
  );
}
