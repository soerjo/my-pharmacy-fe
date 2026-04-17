import { AdmissionsTable } from "@/components/admissions/admissions-table";
import { AdmissionsProvider } from "@/hooks/use-admissions";

export default function AdmissionsPage() {
  return (
    <div className="p-6">
      <AdmissionsProvider>
        <AdmissionsTable />
      </AdmissionsProvider>
    </div>
  );
}
