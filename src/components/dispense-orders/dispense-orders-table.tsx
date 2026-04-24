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
  TooltipRoot,
  TooltipContent,
  toast,
  useOverlayState,
  Table,
} from "@heroui/react";
import { Copy } from "@gravity-ui/icons";
import { DataTable } from "@/components/ui/data-table";
import { useDispenseOrders } from "@/hooks/use-dispense-orders";
import { useDispenseOrdersStore } from "@/stores/dispense-orders-store";
import { DispenseOrderCreateForm } from "./dispense-order-create-form";
import { DispenseOrderUpdateForm } from "./dispense-order-update-form";
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

function CopyableText({ text }: { text?: string | null }) {
  if (!text) return <p>-</p>;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied!", { description: text });
  };

  return (
    <TooltipRoot>
      <div className="flex items-center gap-1.5">
        <p>{text}</p>
        <TooltipContent showArrow>
          <span className="text-xs">Copy</span>
        </TooltipContent>
        <button
          type="button"
          onClick={handleCopy}
          className="text-default-400 hover:text-default-600 transition-colors hover:cursor-pointer"
        >
          <Copy className="size-3.5" />
        </button>
      </div>
    </TooltipRoot>
  );
}

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

  const [updateId, setUpdateId] = useState<string | null>(null);
  const [updateOrderStatus, setUpdateOrderStatus] = useState<DispenseOrderStatus | null>(null);

  const updateModalState = useOverlayState({
    isOpen: !!updateId,
    onOpenChange: (open) => {
      if (!open) {
        setUpdateId(null);
        setUpdateOrderStatus(null);
      }
    },
  });

  function openUpdate(id: string, status: DispenseOrderStatus) {
    setUpdateId(id);
    setUpdateOrderStatus(status);
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
            <Table.Column isRowHeader defaultWidth="1fr" minWidth={200} >Order # <Table.ColumnResizer /></Table.Column>
            <Table.Column defaultWidth="1fr" minWidth={200} >Admission # <Table.ColumnResizer /></Table.Column>
            <Table.Column>Patient Name</Table.Column>
            <Table.Column defaultWidth="1fr" minWidth={120}>Status <Table.ColumnResizer /></Table.Column>
            <Table.Column defaultWidth="1fr" minWidth={100}>Actions <Table.ColumnResizer /></Table.Column>
          </>
        }
        renderRow={(order: DispenseOrder) => (
          <Table.Row key={order.orderNumber}>
            <Table.Cell>
              <div>
                <p>{order.orderNumber}</p>              
                <p className="text-xs text-default-400"> {order.createdAt ? formatDate(order.createdAt) : "-"}</p>
              </div>
              </Table.Cell>
            <Table.Cell>
              <div>
                <CopyableText text={order.admissionNumber} />
                <p className="text-xs text-default-400">
                  {order.type ?? "-"} | {order.admissionDate ? formatDate(order.admissionDate) : "-"}
                </p>
              </div>
            </Table.Cell>
            <Table.Cell>{order.patientName ?? "-"}</Table.Cell> 
            <Table.Cell>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                  statusStyles[order.status],
                )}
              >
                {order.status}
              </span>
            </Table.Cell>
            <Table.Cell>
              <div className="flex gap-1">
                <Button size="sm" variant="secondary" onPress={() => openUpdate(order.id!, order.status)}>
                  Details
                </Button>
              </div>
            </Table.Cell>
          </Table.Row>
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
              <Select.Indicator />
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

      {/* Update Modal => could be used for view details */}
      <Modal state={updateModalState}>
        <ModalBackdrop variant="blur">
          <ModalContainer size="lg">
            <ModalDialog className="h-dvh w-full max-w-full sm:h-auto sm:w-3/4 sm:max-w-3/4 sm:rounded-3xl">
              <ModalHeader>
                <ModalHeading>Edit Order</ModalHeading>
              </ModalHeader>
              <ModalBody>
                {updateId && <DispenseOrderUpdateForm id={updateId} onClose={closeUpdate} formId={UPDATE_FORM_ID} />}
              </ModalBody>
              <ModalFooter>
                <Button variant="secondary" onPress={closeUpdate}>
                  {updateOrderStatus === "DISPENSED" || updateOrderStatus === "CANCELLED" ? "Close" : "Cancel"}
                </Button>
                {updateOrderStatus !== "DISPENSED" && updateOrderStatus !== "CANCELLED" && (
                  <Button type="submit" form={UPDATE_FORM_ID} variant="primary">
                    Save
                  </Button>
                )}
              </ModalFooter>
            </ModalDialog>
          </ModalContainer>
        </ModalBackdrop>
      </Modal>
    </>
  );
}
