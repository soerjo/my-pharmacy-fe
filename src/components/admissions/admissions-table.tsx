"use client";

import { useState } from "react";
import { Button, Input, Spinner, Chip } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  TableContent,
} from "@heroui/react";
import { Magnifier } from "@gravity-ui/icons";
import { useAdmissions } from "@/hooks/use-admissions";
import { AdmissionForm } from "./admission-form";
import { formatDate } from "@/utils";
import type { Admission } from "@/types";

const statusStyles: Record<string, "default" | "warning" | "danger" | "success" | "accent"> = {
  admitted: "accent",
  discharged: "success",
  transferred: "warning",
};

export function AdmissionsTable() {
  const {
    admissions,
    isLoading,
    filters,
    setSearch,
    deleteAdmission,
  } = useAdmissions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAdmission, setEditingAdmission] = useState<Admission | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleEdit(admission: Admission) {
    setEditingAdmission(admission);
    setIsFormOpen(true);
  }

  function handleCloseForm() {
    setIsFormOpen(false);
    setEditingAdmission(undefined);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteAdmission(id);
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Admissions</h2>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Magnifier className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-default-400" />
            <Input
              placeholder="Search admissions..."
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
              aria-label="Search admissions"
            />
          </div>
          <Button
            variant="primary"
            onPress={() => {
              setEditingAdmission(undefined);
              setIsFormOpen(true);
            }}
          >
            + Add Admission
          </Button>
        </div>
      </div>

      {isFormOpen && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingAdmission ? "Edit Admission" : "New Admission"}
          </h3>
          <AdmissionForm
            admission={editingAdmission}
            onClose={handleCloseForm}
          />
        </div>
      )}

      {admissions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 py-12 text-center text-zinc-500">
          {filters.search
            ? `No admissions found for "${filters.search}".`
            : "No admissions found. Click \"+ Add Admission\" to create one."}
        </div>
      ) : (
        <Table aria-label="Admissions table">
          <TableContent>
            <TableHeader>
              <TableColumn>Patient</TableColumn>
              <TableColumn>Ward</TableColumn>
              <TableColumn>Diagnosis</TableColumn>
              <TableColumn>Admission Date</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody items={admissions}>
              {(admission: Admission) => (
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
                      <Button
                        size="sm"
                        variant="secondary"
                        onPress={() => handleEdit(admission)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onPress={() => handleDelete(admission.id)}
                        isDisabled={deletingId === admission.id}
                      >
                        {deletingId === admission.id ? <Spinner size="sm" /> : "Delete"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </TableContent>
        </Table>
      )}
    </div>
  );
}
