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
import { useDispenseOrders } from "@/hooks/use-dispense-orders";
import { useDispenseOrdersStore } from "@/stores/dispense-orders-store";
import { onServerError } from "@/providers/error-provider";
import { DispenseOrderForm } from "./dispense-order-form";
import { DispenseOrdersToolbar } from "./dispense-orders-toolbar";
import { DispenseOrderRow } from "./dispense-order-row";
import { DispenseOrdersPagination } from "./dispense-orders-pagination";

export function DispenseOrdersTable() {
  const {
    dispenseOrders,
    isLoading,
    isFetching,
    error,
    deleteOrder,
    pagination,
    paginationMeta,
    setPage,
    setPageSize,
  } = useDispenseOrders();

  const {
    filters,
    setFilters,
    isFormOpen,
    editingOrder,
    deletingId,
    openCreateForm,
    openEditForm,
    closeForm,
    setDeletingId,
  } = useDispenseOrdersStore(
    useShallow((state) => ({
      filters: state.filters,
      setFilters: state.setFilters,
      isFormOpen: state.isFormOpen,
      editingOrder: state.editingOrder,
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
      await deleteOrder(id);
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
        <p className="text-sm text-danger">Failed to load dispense orders. Please try again.</p>
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
      <DispenseOrdersToolbar
        searchValue={filters.search}
        statusValue={filters.status}
        onSearchChange={(value) => setFilters({ search: value })}
        onStatusChange={(value) => setFilters({ status: value })}
        onAdd={openCreateForm}
      />

      {isFormOpen && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingOrder ? `Edit ${editingOrder.orderNumber}` : "New Dispense Order"}
          </h3>
          <DispenseOrderForm
            order={editingOrder}
            onClose={closeForm}
          />
        </div>
      )}

      {dispenseOrders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 py-12 text-center text-zinc-500">
          {filters.search
            ? `No dispense orders found for "${filters.search}".`
            : 'No dispense orders found. Click "+ New Order" to create one.'}
        </div>
      ) : (
        <Table aria-label="Dispense orders table">
          <TableContent>
            <TableHeader>
              <TableColumn isRowHeader>Order #</TableColumn>
              <TableColumn>Admission #</TableColumn>
              <TableColumn>Type</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Admission Date</TableColumn>
              <TableColumn>Created At</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody items={dispenseOrders} >
              {(order: any) => (
                <DispenseOrderRow
                  key={order.orderNumber}
                  order={order}
                  isDeleting={deletingId === (order.id ?? order.orderNumber)}
                  onEdit={openEditForm}
                  onDelete={handleDelete}
                />
              )}
            </TableBody>
          </TableContent>
          <TableFooter>
            <DispenseOrdersPagination
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
