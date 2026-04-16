import { PatientsTable } from "@/features/patients/components";
import { PatientsProvider } from "@/features/patients/hooks";

export default function PatientsPage() {
  return (
    <div className="p-6">
      <PatientsProvider>
        <PatientsTable />
      </PatientsProvider>
    </div>
  );
}
