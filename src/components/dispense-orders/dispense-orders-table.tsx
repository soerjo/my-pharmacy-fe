"use client";

import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopover,
  ListBox,
  ListBoxItem,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContainer,
  ModalDialog,
  ModalFooter,
  ModalHeader,
  ModalHeading,
  TableCell,
  TableColumn,
  TableRow,
  useOverlayState,
} from "@heroui/react";
import { DataTable } from "@/components/ui/data-table";
import { useDispenseOrders } from "@/hooks/use-dispense-orders";
import { useDispenseOrdersStore } from "@/stores/dispense-orders-store";
import { DispenseOrderCreateForm } from "./dispense-order-create-form";
import { DispenseOrderUpdateForm } from "./dispense-order-update-form";
import { DispenseOrderFormDetail } from "./dispense-order-form-detail";
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

const UPDATE_FORM_ID = "dispense-order-update-form";

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
    openCreateForm,
    closeForm,
  } = useDispenseOrdersStore(
    useShallow((state) => ({
      filters: state.filters,
      setFilters: state.setFilters,
      isFormOpen: state.isFormOpen,
      openCreateForm: state.openCreateForm,
      closeForm: state.closeForm,
    })),
  );

  const [detailId, setDetailId] = useState<string | null>(null);
  const [updateId, setUpdateId] = useState<string | null>(null);

  const detailModalState = useOverlayState({
    isOpen: !!detailId,
    onOpenChange: (open) => {
      if (!open) setDetailId(null);
    },
  });

  const updateModalState = useOverlayState({
    isOpen: !!updateId,
    onOpenChange: (open) => {
      if (!open) setUpdateId(null);
    },
  });

  function openDetail(id: string) {
    setDetailId(id);
  }

  function openUpdate(id: string) {
    setUpdateId(id);
  }

  function closeDetail() {
    setDetailId(null);
  }

  function closeUpdate() {
    setUpdateId(null);
  }

  return (
    <>
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
              <div className="flex gap-1">
                <Button size="sm" variant="secondary" onPress={() => openDetail(order.id ?? order.orderNumber)}>
                  Detail
                </Button>
                <Button size="sm" variant="secondary" onPress={() => openUpdate(order.id ?? order.orderNumber)}>
                  Edit
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
        isFormOpen={isFormOpen}
        formTitle="New Dispense Order"
        renderForm={(onClose, formId) => <DispenseOrderCreateForm onClose={onClose} formId={formId} />}
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

      {/* Detail Modal */}
      <Modal state={detailModalState}>
        <ModalBackdrop variant="blur">
          <ModalContainer size="lg" className="p-2 sm:p-10">
            <ModalDialog className="h-dvh w-full max-w-full sm:h-auto sm:w-3/4 sm:max-w-3/4 sm:rounded-3xl">
              <ModalHeader>
                <ModalHeading>Order Detail</ModalHeading>
              </ModalHeader>
              <ModalBody className="p-2">
                {detailId && <DispenseOrderFormDetail id={detailId} />}
              </ModalBody>
              <ModalFooter>
                <Button variant="secondary" onPress={closeDetail}>
                  Close
                </Button>
              </ModalFooter>
            </ModalDialog>
          </ModalContainer>
        </ModalBackdrop>
      </Modal>

      {/* Update Modal */}
      <Modal state={updateModalState}>
        <ModalBackdrop variant="blur">
          <ModalContainer size="lg" className="p-2 sm:p-10">
            <ModalDialog className="h-dvh w-full max-w-full sm:h-auto sm:w-3/4 sm:max-w-3/4 sm:rounded-3xl">
              <ModalHeader>
                <ModalHeading>Edit Order</ModalHeading>
              </ModalHeader>
              <ModalBody className="p-2">
                {updateId && <DispenseOrderUpdateForm id={updateId} onClose={closeUpdate} formId={UPDATE_FORM_ID} />}
              </ModalBody>
              <ModalFooter>
                <Button variant="secondary" onPress={closeUpdate}>
                  Cancel
                </Button>
                <Button type="submit" form={UPDATE_FORM_ID} variant="primary">
                  Save
                </Button>
              </ModalFooter>
            </ModalDialog>
          </ModalContainer>
        </ModalBackdrop>
      </Modal>
    </>
  );
}
