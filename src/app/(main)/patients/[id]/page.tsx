import { use } from "react";
import { PatientDetail } from "@/components/patients/patient-detail";

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="p-6">
      <PatientDetail id={id} />
    </div>
  );
}
