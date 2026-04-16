import { AdmissionsTable } from "@/features/admission/components";
import { AdmissionsProvider } from "@/features/admission/hooks";

export default function AdmissionsPage() {
  return (
    <div className="p-6">
      <AdmissionsProvider>
        <AdmissionsTable />
      </AdmissionsProvider>
    </div>
  );
}
