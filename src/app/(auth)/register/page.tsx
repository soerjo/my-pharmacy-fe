import { RegisterForm } from "@/features/auth/components";
import { GuestRoute } from "@/features/auth/hooks";
import { RegisterProvider } from "@/features/auth/providers/register-provider";

export default function RegisterPage() {
  return (
    <GuestRoute>
      <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
        <RegisterProvider>
          <RegisterForm />
        </RegisterProvider>
      </div>
    </GuestRoute>
  );
}
