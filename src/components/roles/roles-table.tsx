"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Button,
  TableCell,
  TableColumn,
  TableRow,
  useOverlayState,
} from "@heroui/react";
import { DataTable } from "@/components/ui/data-table";
import { useRoles } from "@/hooks/use-roles";
import { useRolesStore } from "@/stores/roles-store";
import { RoleForm } from "./role-form";
import { ChangesConfirmModal } from "@/components/ui";
import type { Role, CreateRoleFormValues } from "@/types";

export function RolesTable() {
  const {
    roles,
    isLoading,
    error,
    createRole,
    updateRole,
    deleteRole,
    isCreating,
    isUpdating,
    isDeleting,
  } = useRoles();

  const {
    isFormOpen,
    editingRole,
    openCreateForm,
    openEditForm,
    closeForm,
  } = useRolesStore();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const deleteModalState = useOverlayState({
    isOpen: !!deletingId,
    onOpenChange: (open: boolean) => {
      if (!open) setDeletingId(null);
    },
  });

  const handleDelete = useCallback(
    (id: string) => {
      setDeletingId(id);
    },
    [],
  );

  const confirmDelete = useCallback(async () => {
    if (deletingId) {
      await deleteRole(deletingId);
      setDeletingId(null);
    }
  }, [deletingId, deleteRole]);

  const handleFormSubmit = useCallback(
    async (data: CreateRoleFormValues) => {
      if (editingRole) {
        await updateRole(editingRole.id, data);
      } else {
        await createRole(data);
      }
      closeForm();
    },
    [editingRole, createRole, updateRole, closeForm],
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const filteredRoles = useMemo(() => {
    if (!search) return roles;
    const q = search.toLowerCase();
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q),
    );
  }, [roles, search]);

  const paginatedRoles = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRoles.slice(start, start + pageSize);
  }, [filteredRoles, page, pageSize]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRoles.length / pageSize),
  );

  return (
    <>
      <DataTable<Role>
        entityNamePlural="Roles"
        ariaLabel="Roles table"
        data={paginatedRoles}
        isLoading={isLoading}
        error={error}
        columns={
          <>
            <TableColumn defaultWidth="1fr" minWidth={180}>
              Name
            </TableColumn>
            <TableColumn defaultWidth="2fr" minWidth={250}>
              Description
            </TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={140}>
              Actions
            </TableColumn>
          </>
        }
        renderRow={(role: Role) => (
          <TableRow key={role.id}>
            <TableCell>
              <p className="font-medium">{role.name}</p>
            </TableCell>
            <TableCell>
              <p className="text-sm text-default-400">
                {role.description ?? "-"}
              </p>
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onPress={() => openEditForm(role)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onPress={() => handleDelete(role.id)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
        isFormOpen={isFormOpen}
        formTitle={editingRole ? "Edit Role" : "New Role"}
        renderForm={(onClose, formId, onSubmittingChange) => (
          <RoleForm
            defaultValues={
              editingRole
                ? {
                    name: editingRole.name,
                    description: editingRole.description ?? "",
                  }
                : undefined
            }
            onSubmit={handleFormSubmit}
            onClose={onClose}
            formId={formId}
            onSubmittingChange={onSubmittingChange}
            isSubmitting={isCreating || isUpdating}
          />
        )}
        onCloseForm={closeForm}
        filters={{ search }}
        onSearchChange={setSearch}
        onAdd={openCreateForm}
        addLabel="+ Add Role"
        page={page}
        pageSize={pageSize}
        totalItems={filteredRoles.length}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={(size: number) => {
          setPageSize(size);
          setPage(1);
        }}
      />

      <ChangesConfirmModal
        state={deleteModalState}
        title="Delete Role"
        message="Are you sure you want to delete this role? This action cannot be undone."
        onConfirm={confirmDelete}
        onDismiss={() => setDeletingId(null)}
        isConfirming={isDeleting}
        confirmLabel="Yes, delete"
        confirmVariant="danger"
      />
    </>
  );
}
