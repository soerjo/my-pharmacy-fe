"use client";

import { Button, Spinner } from "@heroui/react";
import { TableCell, TableRow } from "@heroui/react";
import { formatDate } from "@/utils";
import type { Patient } from "@/types";

interface PatientRowProps {
  patient: Patient;
  isDeleting: boolean;
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => void;
}

export function PatientRow({
  patient,
  isDeleting,
  onEdit,
  onDelete,
}: PatientRowProps) {
  return (
    <TableRow key={patient.id}>
      <TableCell>{patient.mrn}</TableCell>
      <TableCell>{patient.name}</TableCell>
      <TableCell>{patient.gender ?? "-"}</TableCell>
      <TableCell>
        {patient.dateOfBirth ? formatDate(patient.dateOfBirth) : "-"}
      </TableCell>
      <TableCell>{patient.phone ?? "-"}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onPress={() => onEdit(patient)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onPress={() => onDelete(patient.id)}
            isDisabled={isDeleting}
          >
            {isDeleting ? <Spinner size="sm" /> : "Delete"}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
