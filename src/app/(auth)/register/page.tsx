import { RegisterForm } from "@/components/auth/register-form";
import { GuestRoute } from "@/hooks/use-auth";
import { RegisterProvider } from "@/providers/register-provider";

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
