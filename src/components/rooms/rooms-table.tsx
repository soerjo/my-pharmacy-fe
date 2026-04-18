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
import { useRooms } from "@/hooks/use-rooms";
import { useRoomsStore } from "@/stores/rooms-store";
import { onServerError } from "@/providers/error-provider";
import { RoomForm } from "./room-form";
import { RoomsToolbar } from "./rooms-toolbar";
import { RoomRow } from "./room-row";
import { RoomsPagination } from "./rooms-pagination";
import type { Room } from "@/types";

export function RoomsTable() {
  const {
    rooms,
    isLoading,
    isFetching,
    error,
    deleteRoom,
    pagination,
    paginationMeta,
    setPage,
    setPageSize,
  } = useRooms();

  const {
    filters,
    setFilters,
    isFormOpen,
    editingRoom,
    deletingId,
    openCreateForm,
    openEditForm,
    closeForm,
    setDeletingId,
  } = useRoomsStore(
    useShallow((state) => ({
      filters: state.filters,
      setFilters: state.setFilters,
      isFormOpen: state.isFormOpen,
      editingRoom: state.editingRoom,
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
      await deleteRoom(id);
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
        <p className="text-sm text-danger">Failed to load rooms. Please try again.</p>
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
      <RoomsToolbar
        searchValue={filters.search}
        onSearchChange={(value) => setFilters({ search: value })}
        onAdd={openCreateForm}
      />

      {isFormOpen && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingRoom ? `Edit ${editingRoom.name}` : "New Room"}
          </h3>
          <RoomForm room={editingRoom} onClose={closeForm} />
        </div>
      )}

      {rooms.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 py-12 text-center text-zinc-500">
          {filters.search
            ? `No rooms found for "${filters.search}".`
            : "No rooms found. Click \"+ Add Room\" to create one."}
        </div>
      ) : (
        <Table aria-label="Rooms table">
          <TableContent>
            <TableHeader>
              <TableColumn>Code</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Category</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody items={rooms}>
              {(room: Room) => (
                <RoomRow
                  key={room.id}
                  room={room}
                  isDeleting={deletingId === room.id}
                  onEdit={openEditForm}
                  onDelete={handleDelete}
                />
              )}
            </TableBody>
          </TableContent>
          <TableFooter>
            <RoomsPagination
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
