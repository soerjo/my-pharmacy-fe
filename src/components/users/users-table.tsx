"use client";

import { useState, useCallback, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  Button,
  TableCell,
  TableColumn,
  TableRow,
  Badge,
  useOverlayState,
} from "@heroui/react";
import { DataTable } from "@/components/ui/data-table";
import { useUsers } from "@/hooks/use-users";
import { useUsersStore } from "@/stores/users-store";
import { UserForm } from "./user-form";
import { ChangesConfirmModal } from "@/components/ui";
import type { User } from "@/types";
import type { UserFormValues } from "./user-form";

export function UsersTable() {
  const {
    users,
    isLoading,
    error,
    pagination,
    setPage,
    setPageSize,
    createUser,
    updateUser,
    deleteUser,
    isCreating,
    isUpdating,
    isDeleting,
  } = useUsers();

  const {
    filters,
    setFilters,
    isFormOpen,
    editingEntity,
    openCreateForm,
    openEditForm,
    closeForm,
    setDeletingId,
    deletingId,
  } = useUsersStore(
    useShallow((state) => ({
      filters: state.filters,
      setFilters: state.setFilters,
      isFormOpen: state.isFormOpen,
      editingEntity: state.editingEntity,
      openCreateForm: state.openCreateForm,
      openEditForm: state.openEditForm,
      closeForm: state.closeForm,
      setDeletingId: state.setDeletingId,
      deletingId: state.deletingId,
    })),
  );

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
    [setDeletingId],
  );

  const confirmDelete = useCallback(async () => {
    if (deletingId) {
      await deleteUser(deletingId);
      setDeletingId(null);
    }
  }, [deletingId, deleteUser, setDeletingId]);

  const handleFormSubmit = useCallback(
    async (data: UserFormValues) => {
      if (editingEntity) {
        await updateUser(editingEntity.id, data);
      } else {
        await createUser(data as Parameters<typeof createUser>[0]);
      }
      closeForm();
    },
    [editingEntity, createUser, updateUser, closeForm],
  );

  const filteredUsers = useMemo(() => {
    if (!filters.search) return users;
    const search = filters.search.toLowerCase();
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(search) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(search),
    );
  }, [users, filters.search]);

  const paginatedUsers = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    return filteredUsers.slice(start, start + pagination.pageSize);
  }, [filteredUsers, pagination.page, pagination.pageSize]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / pagination.pageSize),
  );

  return (
    <>
      <DataTable<User>
        entityNamePlural="Users"
        ariaLabel="Users table"
        data={paginatedUsers}
        isLoading={isLoading}
        error={error}
        columns={
          <>
            <TableColumn defaultWidth="1fr" minWidth={150}>
              Name
            </TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={180}>
              Email
            </TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={120}>
              Role
            </TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={140}>
              Organization
            </TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={100}>
              Status
            </TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={160}>
              Actions
            </TableColumn>
          </>
        }
        renderRow={(user: User) => (
          <TableRow key={user.id}>
            <TableCell>
              <p className="font-medium">
                {user.firstName} {user.lastName}
              </p>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role ?? "-"}</TableCell>
            <TableCell>
              {user.organizationName ?? user.organizationId ?? "-"}
            </TableCell>
            <TableCell>
              <Badge
                variant="soft"
                color={user.isActive ? "success" : "danger"}
                size="sm"
              >
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onPress={() => openEditForm(user)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onPress={() => handleDelete(user.id)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
        isFormOpen={isFormOpen}
        formTitle={editingEntity ? "Edit User" : "New User"}
        renderForm={(onClose, formId, onSubmittingChange) => (
          <UserForm
            defaultValues={
              editingEntity
                ? {
                    email: editingEntity.email,
                    firstName: editingEntity.firstName ?? "",
                    lastName: editingEntity.lastName ?? "",
                    organizationId: editingEntity.organizationId,
                    roleId: "",
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
        filters={filters}
        onSearchChange={(value: string) => setFilters({ search: value })}
        onAdd={openCreateForm}
        addLabel="+ Add User"
        page={pagination.page}
        pageSize={pagination.pageSize}
        totalItems={filteredUsers.length}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <ChangesConfirmModal
        state={deleteModalState}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={confirmDelete}
        onDismiss={() => setDeletingId(null)}
        isConfirming={isDeleting}
        confirmLabel="Yes, delete"
        confirmVariant="danger"
      />
    </>
  );
}
