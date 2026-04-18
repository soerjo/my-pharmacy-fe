"use client";

import { Button, Chip, Spinner } from "@heroui/react";
import { TableCell, TableRow } from "@heroui/react";
import { formatDate } from "@/utils";
import type { Admission } from "@/types";

const statusStyles: Record<string, "default" | "warning" | "danger" | "success" | "accent"> = {
  admitted: "accent",
  discharged: "success",
  transferred: "warning",
};

interface AdmissionRowProps {
  admission: Admission;
  isDeleting: boolean;
  onEdit: (admission: Admission) => void;
  onDelete: (id: string) => void;
}

export function AdmissionRow({
  admission,
  isDeleting,
  onEdit,
  onDelete,
}: AdmissionRowProps) {
  return (
    <TableRow key={admission.id}>
      <TableCell>{admission.patientName}</TableCell>
      <TableCell>{admission.wardName}</TableCell>
      <TableCell>{admission.diagnosis}</TableCell>
      <TableCell>{formatDate(admission.admissionDate)}</TableCell>
      <TableCell>
        <Chip
          size="sm"
          variant="soft"
          color={statusStyles[admission.status] ?? "default"}
        >
          {admission.status}
        </Chip>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onPress={() => onEdit(admission)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onPress={() => onDelete(admission.id)}
            isDisabled={isDeleting}
          >
            {isDeleting ? <Spinner size="sm" /> : "Delete"}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
