"use client";

import { useShallow } from "zustand/react/shallow";
import { Button, Spinner } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableContent,
  TableFooter,
} from "@heroui/react";
import { usePatients } from "@/hooks/use-patients";
import { usePatientsStore } from "@/stores/patients-store";
import { onServerError } from "@/providers/error-provider";
import { PatientForm } from "./patient-form";
import { PatientsToolbar } from "./patients-toolbar";
import { PatientRow } from "./patient-row";
import { PatientsPagination } from "./patients-pagination";
import type { Patient } from "@/types";

export function PatientsTable() {
  const {
    patients,
    isLoading,
    isFetching,
    error,
    deletePatient,
    pagination,
    paginationMeta,
    setPage,
    setPageSize,
  } = usePatients();

  const {
    filters,
    setFilters,
    isFormOpen,
    editingPatient,
    deletingId,
    openCreateForm,
    openEditForm,
    closeForm,
    setDeletingId,
  } = usePatientsStore(
    useShallow((state) => ({
      filters: state.filters,
      setFilters: state.setFilters,
      isFormOpen: state.isFormOpen,
      editingPatient: state.editingPatient,
      deletingId: state.deletingId,
      openCreateForm: state.openCreateForm,
      openEditForm: state.openEditForm,
      closeForm: state.closeForm,
      setDeletingId: state.setDeletingId,
    })),
  );

  const totalPages = paginationMeta?.totalPages ?? 1;
  const totalItems = paginationMeta?.total ?? 0;

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deletePatient(id);
    } catch (err) {
      onServerError(err);
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-danger/20 bg-danger/5 py-12">
        <p className="text-sm text-danger">Failed to load patients. Please try again.</p>
        <Button
          variant="secondary"
          size="sm"
          onPress={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* {isFetching && (
        <div className="h-0.5 w-full overflow-hidden">
          <div className="h-full w-full animate-pulse bg-primary" />
        </div>
      )} */}

      <PatientsToolbar
        searchValue={filters.search}
        onSearchChange={(value) => setFilters({ search: value })}
        onAdd={openCreateForm}
      />

      {isFormOpen && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingPatient ? `Edit ${editingPatient.name}` : "New Patient"}
          </h3>
          <PatientForm patient={editingPatient} onClose={closeForm} />
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
              <TableColumn isRowHeader>MRN</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Gender</TableColumn>
              <TableColumn>Date of Birth</TableColumn>
              <TableColumn>Phone</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody items={patients}>
              {(patient: Patient) => (
                <PatientRow
                  key={patient.id}
                  patient={patient}
                  isDeleting={deletingId === patient.id}
                  onEdit={openEditForm}
                  onDelete={handleDelete}
                />
              )}
            </TableBody>
          </TableContent>
          <TableFooter>
            <PatientsPagination
              page={pagination.page}
              pageSize={pagination.pageSize}
              totalItems={totalItems}
              totalPages={totalPages}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </TableFooter>
        </Table>
      )}
    </div>
  );
}
