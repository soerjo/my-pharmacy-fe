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
import { useAdmissions } from "@/hooks/use-admissions";
import { useAdmissionsStore } from "@/stores/admissions-store";
import { onServerError } from "@/providers/error-provider";
import { AdmissionForm } from "./admission-form";
import { AdmissionsToolbar } from "./admissions-toolbar";
import { AdmissionRow } from "./admission-row";
import { AdmissionsPagination } from "./admissions-pagination";
import type { Admission } from "@/types";

export function AdmissionsTable() {
  const {
    admissions,
    isLoading,
    isFetching,
    error,
    deleteAdmission,
    pagination,
    paginationMeta,
    setPage,
    setPageSize,
  } = useAdmissions();

  const {
    filters,
    setFilters,
    isFormOpen,
    editingAdmission,
    deletingId,
    openCreateForm,
    openEditForm,
    closeForm,
    setDeletingId,
  } = useAdmissionsStore(
    useShallow((state) => ({
      filters: state.filters,
      setFilters: state.setFilters,
      isFormOpen: state.isFormOpen,
      editingAdmission: state.editingAdmission,
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
      await deleteAdmission(id);
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
        <p className="text-sm text-danger">Failed to load admissions. Please try again.</p>
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
      <AdmissionsToolbar
        searchValue={filters.search}
        onSearchChange={(value) => setFilters({ search: value })}
        onAdd={openCreateForm}
      />

      {isFormOpen && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingAdmission ? "Edit Admission" : "New Admission"}
          </h3>
          <AdmissionForm
            admission={editingAdmission}
            onClose={closeForm}
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
              <TableColumn isRowHeader>Patient</TableColumn>
              <TableColumn>Ward</TableColumn>
              <TableColumn>Diagnosis</TableColumn>
              <TableColumn>Admission Date</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody items={admissions}>
              {(admission: Admission) => (
                <AdmissionRow
                  key={admission.id}
                  admission={admission}
                  isDeleting={deletingId === admission.id}
                  onEdit={openEditForm}
                  onDelete={handleDelete}
                />
              )}
            </TableBody>
          </TableContent>
          <TableFooter>
            <AdmissionsPagination
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
