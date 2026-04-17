import { MainLayout } from "@/components/layouts";
import { ProtectedRoute } from "@/hooks/use-auth";

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
}
