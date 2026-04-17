"use client";

import { useShallow } from "zustand/react/shallow";
import { Button, Input, Spinner } from "@heroui/react";
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
import { usePatients } from "@/hooks/use-patients";
import { usePatientsStore } from "@/stores/patients-store";
import { PatientForm } from "./patient-form";
import { formatDate } from "@/utils";
import type { Patient } from "@/types";

export function PatientsTable() {
  const { patients, isLoading, deletePatient } = usePatients();

  const {
    filters,
    isFormOpen,
    editingPatient,
    deletingId,
  } = usePatientsStore(
    useShallow((state) => ({
      filters: state.filters,
      isFormOpen: state.isFormOpen,
      editingPatient: state.editingPatient,
      deletingId: state.deletingId,
    })),
  );

  const store = usePatientsStore.getState();

  function handleEdit(patient: Patient) {
    store.openEditForm(patient);
  }

  function handleCloseForm() {
    store.closeForm();
  }

  async function handleDelete(id: string) {
    store.setDeletingId(id);
    try {
      await deletePatient(id);
    } finally {
      store.setDeletingId(null);
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
        <h2 className="text-xl font-semibold">Patients</h2>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Magnifier className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-default-400" />
            <Input
              placeholder="Search patients..."
              value={filters.search}
              onChange={(e) =>
                store.setFilters({ search: e.target.value })
              }
              className="pl-8"
              aria-label="Search patients"
            />
          </div>
          <Button
            variant="primary"
            onPress={() => store.openCreateForm()}
          >
            + Add Patient
          </Button>
        </div>
      </div>

      {isFormOpen && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingPatient ? "Edit Patient" : "New Patient"}
          </h3>
          <PatientForm
            patient={editingPatient}
            onClose={handleCloseForm}
          />
        </div>
      )}

      {patients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 py-12 text-center text-zinc-500">
          {filters.search
            ? `No patients found for "${filters.search}".`
            : "No patients found. Click \"+ Add Patient\" to create one."}
        </div>
      ) : (
        <Table aria-label="Patients table">
          <TableContent>
            <TableHeader>
              <TableColumn>MRN</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Gender</TableColumn>
              <TableColumn>Date of Birth</TableColumn>
              <TableColumn>Phone</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody items={patients}>
              {(patient: Patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.mrn}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.gender ?? "-"}</TableCell>
                  <TableCell>
                    {patient.dateOfBirth
                      ? formatDate(patient.dateOfBirth)
                      : "-"}
                  </TableCell>
                  <TableCell>{patient.phone ?? "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onPress={() => handleEdit(patient)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onPress={() => handleDelete(patient.id)}
                        isDisabled={deletingId === patient.id}
                      >
                        {deletingId === patient.id ? (
                          <Spinner size="sm" />
                        ) : (
                          "Delete"
                        )}
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
