"use client";

import { useShallow } from "zustand/react/shallow";
import { Button, TableCell, TableColumn, TableRow } from "@heroui/react";
import { DataTable } from "@/components/ui/data-table";
import { useRooms } from "@/hooks/use-rooms";
import { useRoomsStore } from "@/stores/rooms-store";
import { RoomForm } from "./room-form";
import type { Room } from "@/types";

export function RoomsTable() {
  const {
    rooms,
    isLoading,
    error,
    pagination,
    paginationMeta,
    setPage,
    setPageSize,
  } = useRooms();

  const {
    filters,
    setFilters,
    isFormOpen,
    editingEntity,
    openCreateForm,
    openEditForm,
    closeForm,
  } = useRoomsStore(
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
    <DataTable<Room>
      entityNamePlural="Rooms"
      ariaLabel="Rooms table"
      data={rooms}
      isLoading={isLoading}
      error={error}
      columns={
        <>
          <TableColumn isRowHeader>Code</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Category</TableColumn>
          <TableColumn>Actions</TableColumn>
        </>
      }
      renderRow={(room: Room) => (
        <TableRow key={room.id}>
          <TableCell>{room.code ?? "-"}</TableCell>
          <TableCell>{room.name}</TableCell>
          <TableCell>{room?.categoryName ?? "-"}</TableCell>
          <TableCell>
            <Button size="sm" variant="secondary" onPress={() => openEditForm(room)}>
              Edit
            </Button>
          </TableCell>
        </TableRow>
      )}
      isFormOpen={isFormOpen}
      formTitle={editingEntity ? `Edit ${editingEntity.name}` : "New Room"}
      renderForm={(onClose, formId) => <RoomForm room={editingEntity} onClose={onClose} formId={formId} />}
      onCloseForm={closeForm}
      filters={filters}
      onSearchChange={(value) => setFilters({ search: value })}
      onAdd={openCreateForm}
      addLabel="+ Add Room"
      page={pagination.page}
      pageSize={pagination.pageSize}
      totalItems={paginationMeta?.total ?? 0}
      totalPages={paginationMeta?.totalPages ?? 1}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
    />
  );
}
