import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { GuestRoute } from "@/hooks/use-auth";
import { ForgotPasswordProvider } from "@/providers/forgot-password-provider";

export default function ForgotPasswordPage() {
  return (
    <GuestRoute>
      <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
        <ForgotPasswordProvider>
          <ForgotPasswordForm />
        </ForgotPasswordProvider>
      </div>
    </GuestRoute>
  );
}
