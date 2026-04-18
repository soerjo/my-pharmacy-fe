"use client";

import { AsyncAutocomplete } from "./async-autocomplete";
import { usePatientSearch } from "@/hooks/use-patient-search";
import type { Patient } from "@/types";

interface PatientAutocompleteProps {
  selectedKey: string | null;
  onSelectionChange: (key: string | null) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  required?: boolean;
}

export function PatientAutocomplete({
  selectedKey,
  onSelectionChange,
  label = "Patient",
  placeholder = "Search patients...",
  className,
  error,
  required,
}: PatientAutocompleteProps) {
  return (
    <AsyncAutocomplete<Patient>
      useSearch={usePatientSearch}
      selectedKey={selectedKey}
      onSelectionChange={onSelectionChange}
      getId={(p) => p.id}
      getTextValue={(p) => p.name}
      renderItem={(patient) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{patient.name}</span>
          <span className="text-xs text-default-400">{patient.mrn}</span>
        </div>
      )}
      label={label}
      placeholder={placeholder}
      emptyText="No patients found"
      className={className}
      error={error}
      required={required}
    />
  );
}
