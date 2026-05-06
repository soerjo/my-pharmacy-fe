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
          <TableColumn defaultWidth="1fr" minWidth={150} isRowHeader>Patient</TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={150}>
            Ward</TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={150}>
            Diagnosis</TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={150}>
            Admission Date</TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={150}>
            Status</TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={180}>
            Actions</TableColumn>
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
          <TableCell className="flex flex-row gap-2">
            <Button size="sm" variant="secondary" onPress={() => openEditForm(admission)}>
              Edit
            </Button>
            <Button size="sm" variant="secondary" onPress={() => openEditForm(admission)}>
              Add Order
            </Button>

          </TableCell>
        </TableRow>
      )}
      isFormOpen={isFormOpen}
      formTitle={editingEntity ? "Edit Admission" : "New Admission"}
      renderForm={(onClose, formId) => <AdmissionForm admission={editingEntity} onClose={onClose} formId={formId} />}
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
