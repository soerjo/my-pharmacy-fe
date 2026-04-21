import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { GuestRoute } from "@/hooks/use-auth";

export default function ResetPasswordPage() {
  return (
    <GuestRoute>
      <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
        <ResetPasswordForm />
      </div>
    </GuestRoute>
  );
}
