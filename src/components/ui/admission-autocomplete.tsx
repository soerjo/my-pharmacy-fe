"use client";

import { AsyncAutocomplete } from "./async-autocomplete";
import { useAdmissionSearch } from "@/hooks/use-admission-search";
import type { Admission } from "@/types";

interface AdmissionAutocompleteProps {
  selectedKey: string | null;
  onSelectionChange: (key: string | null) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  required?: boolean;
}

export function AdmissionAutocomplete({
  selectedKey,
  onSelectionChange,
  label = "Admission",
  placeholder = "Search admissions...",
  className,
  error,
  required,
}: AdmissionAutocompleteProps) {
  return (
    <AsyncAutocomplete<Admission>
      useSearch={useAdmissionSearch}
      selectedKey={selectedKey}
      onSelectionChange={onSelectionChange}
      getId={(a) => a.id}
      getTextValue={(a) => a.patientName || a.id}
      renderItem={(admission) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{admission.patientName}</span>
          <span className="text-xs text-default-400">{admission.diagnosis || admission.status}</span>
        </div>
      )}
      label={label}
      placeholder={placeholder}
      emptyText="No admissions found"
      className={className}
      error={error}
      required={required}
    />
  );
}
