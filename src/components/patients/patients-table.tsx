"use client";

import { useShallow } from "zustand/react/shallow";
import { Button, TableCell, TableColumn, TableRow } from "@heroui/react";
import { DataTable } from "@/components/ui/data-table";
import { usePatients } from "@/hooks/use-patients";
import { usePatientsStore } from "@/stores/patients-store";
import { PatientForm } from "./patient-form";
import { formatDate } from "@/utils";
import type { Patient } from "@/types";

export function PatientsTable() {
  const {
    patients,
    isLoading,
    error,
    pagination,
    paginationMeta,
    setPage,
    setPageSize,
  } = usePatients();

  const {
    filters,
    setFilters,
    isFormOpen,
    editingEntity,
    openCreateForm,
    openEditForm,
    closeForm,
  } = usePatientsStore(
    useShallow((state) => ({
      filters: state.filters,
      setFilters: state.setFilters,
      isFormOpen: state.isFormOpen,
      editingEntity: state.editingEntity,
      openCreateForm: state.openCreateForm,
      openEditForm: state.openEditForm,
      closeForm: state.closeForm,
    })),
  );

  return (
    <DataTable<Patient>
      entityNamePlural="Patients"
      ariaLabel="Patients table"
      data={patients}
      isLoading={isLoading}
      error={error}
      columns={
        <>
          <TableColumn isRowHeader>MRN</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Gender</TableColumn>
          <TableColumn>Date of Birth</TableColumn>
          <TableColumn>Phone</TableColumn>
          <TableColumn>Actions</TableColumn>
        </>
      }
      renderRow={(patient: Patient) => (
        <TableRow key={patient.id}>
          <TableCell>{patient.mrn}</TableCell>
          <TableCell>{patient.name}</TableCell>
          <TableCell>{patient.gender ?? "-"}</TableCell>
          <TableCell>{patient.dateOfBirth ? formatDate(patient.dateOfBirth) : "-"}</TableCell>
          <TableCell>{patient.phone ?? "-"}</TableCell>
          <TableCell>
            <Button size="sm" variant="secondary" onPress={() => openEditForm(patient)}>
              Edit
            </Button>
          </TableCell>
        </TableRow>
      )}
      isFormOpen={isFormOpen}
      formTitle={editingEntity ? `Edit ${editingEntity.name}` : "New Patient"}
      renderForm={(onClose) => <PatientForm patient={editingEntity} onClose={onClose} />}
      onCloseForm={closeForm}
      filters={filters}
      onSearchChange={(value) => setFilters({ search: value })}
      onAdd={openCreateForm}
      addLabel="+ Add Patient"
      page={pagination.page}
      pageSize={pagination.pageSize}
      totalItems={paginationMeta?.total ?? 0}
      totalPages={paginationMeta?.totalPages ?? 1}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
    />
  );
}
