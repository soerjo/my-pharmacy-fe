"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  TextArea, 
  Spinner, 
  Accordion, 
  useOverlayState,
  ModalBody,
  ModalFooter,
  Button,
 } from "@heroui/react";
import { ChevronDown, Receipt, Book } from "@gravity-ui/icons";
import {
  dispenseOrderSchema,
  type DispenseOrderFormValues,
  type DispenseOrderStatus,
  type Product,
  DISPENSE_ORDER_STATUS_OPTIONS,
} from "@/types";
import { useDispenseOrders, useDispenseOrder } from "@/hooks/use-dispense-orders";
import { InfoField } from "@/components/ui";
import { formatDate } from "@/utils";
import { DispenseOrderSectionDetails } from "./dispense-order-section-details";
import { DispenseOrderSectionItems } from "./dispense-order-section-items";
import { StatusConfirmModal } from "./dispense-order-status-confirm-modal";
import { DeleteItemConfirmModal } from "./dispense-order-delete-item-modal";
import { ChangesConfirmModal } from "./dispense-order-changes-confirm-modal";

interface DispenseOrderUpdateFormProps {
  id: string;
  onClose: () => void;
  formId: string;
}

export function DispenseOrderUpdateForm({ id, onClose, formId }: DispenseOrderUpdateFormProps) {
  const {
    updateOrder,
    prepareOrder,
    dispenseOrder: dispenseOrderAction,
    cancelOrder,
    isPreparing,
    isDispensing,
    isCancelling,
  } = useDispenseOrders();
  const { dispenseOrder: orderDetail, isLoading: isLoadingDetail } = useDispenseOrder(id);

  const [productMap, setProductMap] = useState<Map<string, Product>>(new Map());
  const [pendingStatus, setPendingStatus] = useState<DispenseOrderStatus | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [pendingRemoveIndex, setPendingRemoveIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<DispenseOrderFormValues>({
    resolver: zodResolver(dispenseOrderSchema),
    defaultValues: {
      admissionId: "",
      status: "PENDING" as DispenseOrderStatus,
      notes: "",
      items: [{ drugId: "", quantity: 1, instructions: "" }],
    },
  });

  const watchedItems = watch("items");
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  useEffect(() => {
    if (orderDetail) {
      const map = new Map<string, Product>();
      orderDetail.items.forEach((item) => {
        map.set(item.drugId, {
          id: item.drugId,
          name: item.drugName,
          baseUnitAbbreviation: item.baseUnitAbbreviation,
        } as Product);
      });
      setProductMap(map);

      reset({
        admissionId: orderDetail.admissionId,
        status: orderDetail.status,
        notes: orderDetail.notes ?? "",
        items: orderDetail.items.map((item) => ({
          drugId: item.drugId,
          quantity: item.quantity,
          instructions: item.instructions ?? "",
        })),
      });
    }
  }, [orderDetail, reset]);

  const orderId = orderDetail?.id ?? id;
  const isReadOnly = orderDetail?.status === "DISPENSED" || orderDetail?.status === "CANCELLED";

  const validNextStatuses = useMemo(() => {
    if (!orderDetail) return [];
    switch (orderDetail.status) {
      case "PENDING":
        return ["PREPARING", "CANCELLED"];
      case "PREPARING":
        return ["DISPENSED", "CANCELLED"];
      default:
        return [];
    }
  }, [orderDetail]);

  const filteredStatusOptions = useMemo(
    () =>
      DISPENSE_ORDER_STATUS_OPTIONS.filter(
        (opt) => opt.id === orderDetail?.status || validNextStatuses.includes(opt.id),
      ),
    [orderDetail, validNextStatuses],
  );

  const isStatusChanging = isPreparing || isDispensing || isCancelling;

  const confirmModalState = useOverlayState({
    isOpen: pendingStatus !== null,
    onOpenChange: (open) => {
      if (!open) setPendingStatus(null);
    },
  });

  const deleteModalState = useOverlayState({
    isOpen: pendingRemoveIndex !== null,
    onOpenChange: (open) => {
      if (!open) setPendingRemoveIndex(null);
    },
  });

  const changesOverlayState = useOverlayState({ defaultOpen: false });

  const handleClose = useCallback(() => {
    if (isDirty) {
      changesOverlayState.open();
    } else {
      onClose();
    }
  }, [isDirty, changesOverlayState, onClose]);

  const handleProductSelect = useCallback((product: Product | null) => {
    if (product) {
      setProductMap((prev) => new Map(prev).set(product.id, product));
    }
  }, []);

  const handleStatusChange = useCallback(
    (newStatus: string) => {
      if (newStatus === orderDetail?.status || !orderId) return;
      setPendingStatus(newStatus as DispenseOrderStatus);
    },
    [orderDetail, orderId],
  );

  const handleConfirmStatusChange = useCallback(async () => {
    if (!orderId || !pendingStatus) return;
    try {
      if (pendingStatus === "PREPARING") {
        await prepareOrder(orderId);
      } else if (pendingStatus === "DISPENSED") {
        await dispenseOrderAction(orderId);
      } else if (pendingStatus === "CANCELLED") {
        await cancelOrder({ id: orderId, cancelReason: cancelReason || undefined });
      }
    } catch {
      // Error handled by mutation toast
    } finally {
      setPendingStatus(null);
      setCancelReason("");
    }
  }, [pendingStatus, prepareOrder, dispenseOrderAction, cancelOrder, orderId, cancelReason]);

  const handleConfirmRemove = useCallback(() => {
    if (pendingRemoveIndex !== null) {
      remove(pendingRemoveIndex);
      setPendingRemoveIndex(null);
    }
  }, [pendingRemoveIndex, remove]);

  const confirmModalTitle = useMemo(() => {
    switch (pendingStatus) {
      case "PREPARING":
        return "Prepare Order";
      case "DISPENSED":
        return "Dispense Order";
      case "CANCELLED":
        return "Cancel Order";
      default:
        return "";
    }
  }, [pendingStatus]);

  const confirmModalMessage = useMemo(() => {
    switch (pendingStatus) {
      case "PREPARING":
        return "Are you sure you want to start preparing this order?";
      case "DISPENSED":
        return "Are you sure you want to mark this order as dispensed?";
      case "CANCELLED":
        return "Are you sure you want to cancel this order? This action cannot be undone.";
      default:
        return "";
    }
  }, [pendingStatus]);

  async function onSubmit(data: DispenseOrderFormValues) {
    if (!orderId) return;
    try {
      await updateOrder(orderId, data);
      onClose();
    } catch {
      // Error handled by mutation toast
    }
  }

  if (isLoadingDetail) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8">
        <Spinner size="lg" />
        <p className="text-sm text-zinc-500">Loading order detail...</p>
      </div>
    );
  }

  if (!orderDetail) {
    return <div className="py-8 text-center text-sm text-zinc-500">Order not found.</div>;
  }

  return (
    <>
  <ModalBody >
    <form id={formId} onSubmit={handleSubmit(onSubmit)}>
      <Accordion
        allowsMultipleExpanded
        defaultExpandedKeys={["dispense-details", "order-items"]}
        variant="default"
      >
        <DispenseOrderSectionDetails
          orderDetail={orderDetail}
          control={control}
          onStatusChange={handleStatusChange}
          isStatusChanging={isStatusChanging}
          canChangeStatus={validNextStatuses.length > 0}
          filteredStatusOptions={filteredStatusOptions}
        />

        <Accordion.Item id="dispense-items">
          <Accordion.Heading>
            <Accordion.Trigger>
              <span className="mr-3 size-4 shrink-0 text-muted">
                <Receipt />
              </span>
              {"Admission Details"}
              <Accordion.Indicator>
                <ChevronDown />
              </Accordion.Indicator>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>
              <div className="grid grid-cols-2 gap-4">
                <InfoField label="Admission Number">
                  <div className="flex flex-col gap-0 text-sm">
                    <span className="text-black">{orderDetail.admissionNumber}</span>
                    <span className="text-xs">
                      {orderDetail.admissionCreatedAt
                        ? formatDate(orderDetail.admissionCreatedAt)
                        : "-"}
                    </span>
                  </div>
                </InfoField>
                <InfoField label="Admission Type" value={orderDetail.admission_type || "-"} />
                <InfoField label="Patient Name" value={orderDetail.patientName} />
                <InfoField label="Admission Status" value={orderDetail.admissionStatus || "-"} />
              </div>
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item id="order-notes">
          <Accordion.Heading>
            <Accordion.Trigger>
              <span className="mr-3 size-4 shrink-0 text-muted">
                <Book />
              </span>
              {"Order Notes"}
              <Accordion.Indicator>
                <ChevronDown />
              </Accordion.Indicator>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>
              <div className="flex flex-col gap-1.5">
                <TextArea
                  id="update-notes"
                  className="text-sm mt-1"
                  placeholder="Additional notes (optional)"
                  rows={6}
                  readOnly={isReadOnly}
                  {...register("notes")}
                />
                {errors.notes && <p className="text-sm text-danger">{errors.notes.message}</p>}
              </div>
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>

        <DispenseOrderSectionItems
          fields={fields}
          append={append}
          control={control}
          register={register}
          watchedItems={watchedItems}
          errors={errors}
          isReadOnly={isReadOnly}
          productMap={productMap}
          onProductSelect={handleProductSelect}
          initialItems={orderDetail.items}
          onRemoveRequest={setPendingRemoveIndex}
        />
      </Accordion>

      <StatusConfirmModal
        state={confirmModalState}
        title={confirmModalTitle}
        message={confirmModalMessage}
        isCancelled={pendingStatus === "CANCELLED"}
        cancelReason={cancelReason}
        onCancelReasonChange={setCancelReason}
        onConfirm={handleConfirmStatusChange}
        onDismiss={() => {
          setPendingStatus(null);
          setCancelReason("");
        }}
        isConfirming={isStatusChanging && pendingStatus !== null}
      />

      <ChangesConfirmModal
        state={changesOverlayState}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to close? All changes will be lost."
        isCancelled={false}
        cancelReason=""
        onCancelReasonChange={() => {}}
        onConfirm={onClose}
        onDismiss={() => changesOverlayState.close()}
        isConfirming={false}
      />

      <DeleteItemConfirmModal
        state={deleteModalState}
        itemName={
          pendingRemoveIndex !== null
            ? (productMap.get(watchedItems?.[pendingRemoveIndex]?.drugId ?? "")?.name ??
              `Item ${pendingRemoveIndex + 1}`)
            : ""
        }
        onConfirm={handleConfirmRemove}
        onDismiss={() => setPendingRemoveIndex(null)}
      />
    </form>
    </ModalBody>
      <ModalFooter className="px-4 pb-4">
        <Button variant="secondary" onPress={handleClose}>{isDirty ? "Cancel" : "Close"}</Button>
        {isDirty && <Button type="submit" form={formId}>Save</Button>}
      </ModalFooter>
    </>
  );
}
