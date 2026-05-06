"use client";

import { useRef, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useOverlayState, TableCell, TableColumn, TableRow } from "@heroui/react";
import { DataTable } from "@/components/ui/data-table";
import { usePatients } from "@/hooks/use-patients";
import { usePatientsStore } from "@/stores/patients-store";
import { PatientForm } from "./patient-form";
import { ChangesConfirmModal } from "../dispense-orders/dispense-order-changes-confirm-modal";
import { AppLink } from "@/components/ui";
import { formatDate } from "@/utils";
import { ROUTES } from "@/constants";
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

  const isDirtyRef = useRef(false);
  const changesOverlayState = useOverlayState({ defaultOpen: false });

  const handleCloseRequest = useCallback(() => {
    if (isDirtyRef.current) {
      changesOverlayState.open();
    } else {
      closeForm();
    }
  }, [closeForm, changesOverlayState]);

  const handleDirtyChange = useCallback((dirty: boolean) => {
    isDirtyRef.current = dirty;
  }, []);

  return (
    <>
      <DataTable<Patient>
        entityNamePlural="Patients"
        ariaLabel="Patients table"
        data={patients}
        isLoading={isLoading}
        error={error}
        columns={
          <>
            <TableColumn defaultWidth="1fr" minWidth={100} isRowHeader>MRN</TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={150}>
              Name</TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={100}>
              Gender</TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={150}>
              Date of Birth</TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={100}>
              Phone</TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={110}>
              Actions</TableColumn>
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
              <div className="flex gap-1">
                <AppLink
                  href={`${ROUTES.patients}/${patient.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  Detail
                </AppLink>
                <span className="text-default-300">|</span>
                <button
                  type="button"
                  onClick={() => openEditForm(patient)}
                  className="text-sm text-primary hover:underline hover:cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </TableCell>
          </TableRow>
        )}
        isFormOpen={isFormOpen}
        formTitle={editingEntity ? `Edit Patient` : "New Patient"}
        renderForm={(onClose, formId, onSubmittingChange) => (
          <PatientForm
            patientId={editingEntity?.id}
            onClose={onClose}
            formId={formId}
            onDirtyChange={handleDirtyChange}
            onSubmittingChange={onSubmittingChange}
          />
        )}
        onCloseForm={handleCloseRequest}
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

      <ChangesConfirmModal
        state={changesOverlayState}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to close? All changes will be lost."
        isCancelled={false}
        cancelReason=""
        onCancelReasonChange={() => {}}
        onConfirm={closeForm}
        onDismiss={() => changesOverlayState.close()}
        isConfirming={false}
      />
    </>
  );
}
