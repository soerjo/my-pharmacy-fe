"use client";

import { useShallow } from "zustand/react/shallow";
import { Button, Chip, TableCell, TableColumn, TableRow } from "@heroui/react";
import { DataTable } from "@/components/ui/data-table";
import { useAdmissions } from "@/hooks/use-admissions";
import { useAdmissionsStore } from "@/stores/admissions-store";
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
    error,
    pagination,
    paginationMeta,
    setPage,
    setPageSize,
  } = useAdmissions();

  const {
    filters,
    setFilters,
    isFormOpen,
    editingEntity,
    openCreateForm,
    openEditForm,
    closeForm,
  } = useAdmissionsStore(
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
    <DataTable<Admission>
      entityNamePlural="Admissions"
      ariaLabel="Admissions table"
      data={admissions}
      isLoading={isLoading}
      error={error}
      columns={
        <>
          <TableColumn isRowHeader>Patient</TableColumn>
          <TableColumn>Ward</TableColumn>
          <TableColumn>Diagnosis</TableColumn>
          <TableColumn>Admission Date</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Actions</TableColumn>
        </>
      }
      renderRow={(admission: Admission) => (
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
            <Button size="sm" variant="secondary" onPress={() => openEditForm(admission)}>
              Edit
            </Button>
          </TableCell>
        </TableRow>
      )}
      isFormOpen={isFormOpen}
      formTitle={editingEntity ? "Edit Admission" : "New Admission"}
      renderForm={(onClose) => <AdmissionForm admission={editingEntity} onClose={onClose} />}
      onCloseForm={closeForm}
      filters={filters}
      onSearchChange={(value) => setFilters({ search: value })}
      onAdd={openCreateForm}
      addLabel="+ Add Admission"
      page={pagination.page}
      pageSize={pagination.pageSize}
      totalItems={paginationMeta?.total ?? 0}
      totalPages={paginationMeta?.totalPages ?? 1}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
    />
  );
}
