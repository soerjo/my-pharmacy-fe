"use client";

import { useShallow } from "zustand/react/shallow";
import {
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopover,
  ListBox,
  ListBoxItem,
  TableCell,
  TableColumn,
  TableRow,
} from "@heroui/react";
import { DataTable } from "@/components/ui/data-table";
import { useDispenseOrders } from "@/hooks/use-dispense-orders";
import { useDispenseOrdersStore } from "@/stores/dispense-orders-store";
import { DispenseOrderForm } from "./dispense-order-form";
import { formatDate, cn } from "@/utils";
import type { DispenseOrder, DispenseOrderStatus } from "@/types";

const STATUS_OPTIONS: { id: string; label: string }[] = [
  { id: "", label: "All statuses" },
  { id: "PENDING", label: "Pending" },
  { id: "PREPARING", label: "Preparing" },
  { id: "DISPENSED", label: "Dispensed" },
  { id: "CANCELLED", label: "Cancelled" },
];

const statusStyles: Record<DispenseOrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  PREPARING: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  DISPENSED: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

export function DispenseOrdersTable() {
  const {
    dispenseOrders,
    isLoading,
    error,
    pagination,
    paginationMeta,
    setPage,
    setPageSize,
  } = useDispenseOrders();

  const {
    filters,
    setFilters,
    isFormOpen,
    editingEntity,
    openCreateForm,
    openEditForm,
    closeForm,
  } = useDispenseOrdersStore(
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
    <DataTable<DispenseOrder>
      entityNamePlural="Dispense Orders"
      ariaLabel="Dispense orders table"
      data={dispenseOrders}
      isLoading={isLoading}
      error={error}
      columns={
        <>
          <TableColumn isRowHeader>Order #</TableColumn>
          <TableColumn>Admission #</TableColumn>
          <TableColumn>Type</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Admission Date</TableColumn>
          <TableColumn>Created At</TableColumn>
          <TableColumn>Actions</TableColumn>
        </>
      }
      renderRow={(order: DispenseOrder) => (
        <TableRow key={order.orderNumber}>
          <TableCell>{order.orderNumber}</TableCell>
          <TableCell>{order.admissionNumber ?? "-"}</TableCell>
          <TableCell>{order.type ?? "-"}</TableCell>
          <TableCell>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                statusStyles[order.status],
              )}
            >
              {order.status}
            </span>
          </TableCell>
          <TableCell>{order.admissionDate ? formatDate(order.admissionDate) : "-"}</TableCell>
          <TableCell>{order.createdAt ? formatDate(order.createdAt) : "-"}</TableCell>
          <TableCell>
            <Button size="sm" variant="secondary" onPress={() => openEditForm(order)}>
              Edit
            </Button>
          </TableCell>
        </TableRow>
      )}
      isFormOpen={isFormOpen}
      formTitle={editingEntity ? `Edit ${editingEntity.orderNumber}` : "New Dispense Order"}
      renderForm={(onClose, formId) => <DispenseOrderForm order={editingEntity} onClose={onClose} formId={formId} />}
      onCloseForm={closeForm}
      filters={filters}
      onSearchChange={(value) => setFilters({ search: value })}
      onAdd={openCreateForm}
      addLabel="+ New Order"
      toolbarExtra={
        <Select
          selectedKey={filters.status || undefined}
          onSelectionChange={(key) => {
            setFilters({ status: key ? String(key) : "" });
          }}
          fullWidth
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectPopover>
            <ListBox items={STATUS_OPTIONS}>
              {(item) => (
                <ListBoxItem key={item.id} textValue={item.label}>
                  {item.label}
                </ListBoxItem>
              )}
            </ListBox>
          </SelectPopover>
        </Select>
      }
      page={pagination.page}
      pageSize={pagination.pageSize}
      totalItems={paginationMeta?.total ?? 0}
      totalPages={paginationMeta?.totalPages ?? 1}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
    />
  );
}
