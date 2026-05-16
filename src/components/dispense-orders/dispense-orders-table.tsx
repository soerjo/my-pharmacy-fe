"use client";

import { useState, useCallback, useRef, useMemo } from "react";
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
  ModalContainer,
  ModalDialog,
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
import { ArrowUpFromSquare, Copy } from "@gravity-ui/icons";
import { DataTable } from "@/components/ui/data-table";
import { useDispenseOrders } from "@/hooks/use-dispense-orders";
import { useDispenseOrdersStore } from "@/stores/dispense-orders-store";
import { DispenseOrderCreateForm } from "./dispense-order-create-form";
import { DispenseOrderUpdateForm } from "./dispense-order-update-form";
import { ChangesConfirmModal } from "./dispense-order-changes-confirm-modal";
import { formatDate, cn } from "@/utils";
import {
  type DispenseOrder,
  type DispenseOrderStatus,
  DISPENSE_ORDER_STATUS_STYLES,
} from "@/types";
import { RangeDatePicker } from "../ui/range-date-picker";
import { OrderSelectItem } from "../ui/order-select-item";
import { today, getLocalTimeZone, type CalendarDate } from "@internationalized/date";
import ExportCSV from "./dispense-order-export-csv";


const UPDATE_FORM_ID = "dispense-order-update-form";

function CopyableText({ text }: { text?: string | null }) {
  const handleCopy = useCallback(async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    toast.success("Copied!", { description: text });
  }, [text]);

  if (!text) return <p>-</p>;

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

  const { filters, setFilters, isFormOpen, openCreateForm, closeForm } =
    useDispenseOrdersStore(
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

  const isCreateDirtyRef = useRef(false);
  const createChangesOverlayState = useOverlayState({ defaultOpen: false });

  const handleCreateCloseRequest = useCallback(() => {
    if (isCreateDirtyRef.current) {
      createChangesOverlayState.open();
    } else {
      closeForm();
    }
  }, [closeForm, createChangesOverlayState]);

  const handleCreateDirtyChange = useCallback((dirty: boolean) => {
    isCreateDirtyRef.current = dirty;
  }, []);

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

  const defaultDateRange = useMemo(() => {
    const now = today(getLocalTimeZone());
    return { start: now, end: now };
  }, []);

  const handleDateRangeChange = useCallback(
    (range: { start: CalendarDate; end: CalendarDate } | null) => {
      if (!range) return;
      setFilters({
        startDate: range.start.toString(),
        endDate: range.end.toString(),
      });
    },
    [setFilters],
  );

  return (
    <>
      <DataTable<DispenseOrder>
        exportButton={<ExportCSV/>}
        entityNamePlural="Dispense Orders"
        ariaLabel="Dispense orders table"
        data={dispenseOrders}
        isLoading={isLoading}
        error={error}
        columns={
          <>
            <TableColumn isRowHeader defaultWidth="1fr" minWidth={200}>
              Order # <Table.ColumnResizer />
            </TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={200}>
              Admission # <Table.ColumnResizer />
            </TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={160}>Patient Name</TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={120}>
              Status <Table.ColumnResizer />
            </TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={100}>
              Actions <Table.ColumnResizer />
            </TableColumn>
          </>
        }
        renderRow={(order: DispenseOrder) => (
          <TableRow key={order.orderNumber}>
            <TableCell>
              <div>
                <p>{order.orderNumber}</p>
                <p className="text-xs text-default-400">
                  {order.orderDate ? formatDate(order.orderDate) : "-"}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <CopyableText text={order.admissionNumber} />
                <p className="text-xs text-default-400">
                  {order.type ?? "-"} | {order.admissionDate ? formatDate(order.admissionDate) : "-"}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p>{order.patientName ?? "-"}</p>
                <p className="text-xs text-default-400">{order.mrn ?? "-"}</p>
              </div>
            </TableCell>
            <TableCell>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                  DISPENSE_ORDER_STATUS_STYLES[order.status],
                )}
              >
                {order.status}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button size="sm" variant="secondary" onPress={() => openUpdate(order.id!, order.status)}>
                  Details
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
        isFormOpen={isFormOpen}
        formTitle="New Dispense Order"
        renderForm={(onClose, formId, onSubmittingChange) => (
          <DispenseOrderCreateForm onClose={onClose} formId={formId} onDirtyChange={handleCreateDirtyChange} onSubmittingChange={onSubmittingChange} />
        )}
        onCloseForm={handleCreateCloseRequest}
        filters={filters}
        onSearchChange={(value) => setFilters({ search: value })}
        onAdd={openCreateForm}
        addLabel="+ New Order"
        toolbarExtra={
          <div className="flex md:flex-row flex-col gap-4 w-full">
            <OrderSelectItem filters={filters} setFilters={setFilters}/>
            <RangeDatePicker defaultValue={defaultDateRange} onChange={handleDateRangeChange} />
          </div>
        }
        page={pagination.page}
        pageSize={pagination.pageSize}
        totalItems={paginationMeta?.total ?? 0}
        totalPages={paginationMeta?.totalPages ?? 1}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <ChangesConfirmModal
        state={createChangesOverlayState}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to close? All changes will be lost."
        isCancelled={false}
        cancelReason=""
        onCancelReasonChange={() => {}}
        onConfirm={closeForm}
        onDismiss={() => createChangesOverlayState.close()}
        isConfirming={false}
      />

      <Modal state={updateModalState}>
        <ModalBackdrop variant="blur">
          <ModalContainer size="lg">
              <ModalDialog className="h-dvh w-full max-w-full md:h-auto md:w-3/4 md:max-w-2/4 md:rounded-3xl p-0 md:p-2">
              <ModalHeader className="px-4 pt-4">
                <ModalHeading>Edit Order</ModalHeading>
              </ModalHeader>
                  <DispenseOrderUpdateForm id={updateId!} onClose={closeUpdate} formId={UPDATE_FORM_ID} />
            </ModalDialog>
          </ModalContainer>
        </ModalBackdrop>
      </Modal>
    </>
  );
}
