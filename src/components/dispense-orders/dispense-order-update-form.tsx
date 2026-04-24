"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Input,
  Button,
  TextArea,
  Spinner,
  ScrollShadow,
  InputGroup,
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
  ModalBody,
  ModalFooter,
  useOverlayState,
} from "@heroui/react";
import { dispenseOrderSchema, type DispenseOrderFormValues, type DispenseOrderStatus, type Product } from "@/types";
import { useDispenseOrders, useDispenseOrder } from "@/hooks/use-dispense-orders";
import { ProductAutocomplete } from "@/components/ui";
import { formatDate, cn } from "@/utils";
import { TrashBin } from "@gravity-ui/icons";

const statusStyles: Record<DispenseOrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  PREPARING: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  DISPENSED: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

const STATUS_OPTIONS = [
  { id: "PENDING", label: "PENDING" },
  { id: "PREPARING", label: "PREPARING" },
  { id: "DISPENSED", label: "DISPENSED" },
  { id: "CANCELLED", label: "CANCELLED" },
];

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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [productMap, setProductMap] = useState<Map<string, Product>>(new Map());
  const [pendingStatus, setPendingStatus] = useState<DispenseOrderStatus | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [pendingRemoveIndex, setPendingRemoveIndex] = useState<number | null>(null);

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
    }
  }, [orderDetail]);

  const initialProducts = useMemo(() => {
    if (!orderDetail) return [];
    return orderDetail.items.map(
      (item) =>
        ({
          id: item.drugId,
          name: item.drugName,
          baseUnitAbbreviation: item.baseUnitAbbreviation,
        }) as Product,
    );
  }, [orderDetail]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
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

  const handleProductSelect = useCallback((product: Product | null) => {
    if (product) {
      setProductMap((prev) => new Map(prev).set(product.id, product));
    }
  }, []);

  useEffect(() => {
    if (orderDetail) {
      const items = orderDetail.items.map((item) => ({
        drugId: item.drugId,
        quantity: item.quantity,
        instructions: item.instructions ?? "",
      }));
      reset({
        admissionId: orderDetail.admissionId,
        status: orderDetail.status,
        notes: orderDetail.notes ?? "",
        items,
      });
    }
  }, [orderDetail, reset]);

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
      STATUS_OPTIONS.filter(
        (opt) => opt.id === orderDetail?.status || validNextStatuses.includes(opt.id),
      ),
    [orderDetail, validNextStatuses],
  );

  const orderId = orderDetail?.id ?? id;

  const isStatusChanging = isPreparing || isDispensing || isCancelling;

  const confirmModalState = useOverlayState({
    isOpen: pendingStatus !== null,
    onOpenChange: (open) => {
      if (!open) setPendingStatus(null);
    },
  });

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

  const handleDismissConfirm = useCallback(() => {
    setPendingStatus(null);
    setCancelReason("");
  }, []);

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const deleteModalState = useOverlayState({
    isOpen: pendingRemoveIndex !== null,
    onOpenChange: (open) => {
      if (!open) setPendingRemoveIndex(null);
    },
  });

  const handleConfirmRemove = useCallback(() => {
    if (pendingRemoveIndex !== null) {
      remove(pendingRemoveIndex);
      setPendingRemoveIndex(null);
    }
  }, [pendingRemoveIndex, remove]);

  async function onSubmit(data: DispenseOrderFormValues) {
    if (!orderId) return;
    setSubmitError(null);
    try {
      await updateOrder(orderId, data);
      onClose();
    } catch {
      setSubmitError("Failed to update order. Please try again.");
    }
  }

  const isReadOnly = orderDetail?.status === "DISPENSED" || orderDetail?.status === "CANCELLED";

  if (isLoadingDetail) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8">
        <Spinner size="lg" />
        <p className="text-sm text-zinc-500">Loading order detail...</p>
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="py-8 text-center text-sm text-zinc-500">Order not found.</div>
    );
  }

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-1">
      <div className="grid grid-cols-2 gap-4">
        <InfoField label="Order Number" >
          <span className="text-black">{orderDetail.orderNumber}</span>
          <span className="text-sm">{orderDetail.createdAt ? formatDate(orderDetail.createdAt) : "-"}</span>
        </InfoField>
        <InfoField label="Status">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Select
                  selectedKey={field.value}
                  onSelectionChange={(key) => handleStatusChange(String(key))}
                  isDisabled={isStatusChanging || validNextStatuses.length === 0}
                  className="w-fit shadow-none"
                  
                  // variant="secondary"
                >
                  <Select.Trigger className="w-auto py-0" >
                    <Select.Value className="p-0 flex justify-center items-center" />
                    <Select.Indicator />
                  </Select.Trigger>
                  <SelectPopover className="w-auto">
                    <ListBox items={filteredStatusOptions}>
                      {(item) => (
                        <ListBoxItem key={item.id} textValue={item.label}>
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                              statusStyles[item.id as DispenseOrderStatus],
                            )}
                          >
                            {item.label}
                          </span>
                        </ListBoxItem>
                      )}
                    </ListBox>
                  </SelectPopover>
                </Select>
                {isStatusChanging && <Spinner size="sm" />}
              </div>
            )}
          />
        </InfoField>
        <InfoField label="Admission Number">
          <span className="text-black">{orderDetail.admissionNumber}</span>
          <span className="text-sm">{orderDetail.admissionCreatedAt ? formatDate(orderDetail.admissionCreatedAt) : "-"}</span>
        </InfoField>
        <InfoField label="Admission Type" value={orderDetail.admission_type || "-"} />
        <InfoField label="Patient Name" value={orderDetail.patientName} />
        <InfoField label="Admission Status" value={orderDetail.admissionStatus || "-"} /> 
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="update-notes" className="text-sm font-medium">
          Notes
        </label>
        <TextArea
          id="update-notes"
          placeholder="Additional notes (optional)"
          readOnly={isReadOnly}
          // {isReadOnly && ...register("notes")}
          {...register("notes")}
        />
        {errors.notes && <p className="text-sm text-danger">{errors.notes.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-black">
            Items <span className="text-danger">*</span>
          </label>
          <Button
            size="sm"
            variant="secondary"
            type="button"
            onPress={() => append({ drugId: "", quantity: 1, instructions: "" })}
            isDisabled={isReadOnly}
          >
            + Add Item
          </Button>
        </div>

        {errors.items && !Array.isArray(errors.items) && (
          <p className="text-sm text-danger">{errors.items.message}</p>
        )}

        <ScrollShadow hideScrollBar className="max-h-[40vh] md:max-h-[35vh]">
          <div className="flex flex-col gap-3">
            {fields.map((field, index) => {
              const currentDrugId = watchedItems?.[index]?.drugId;
              const selectedProduct = currentDrugId ? productMap.get(currentDrugId) : undefined;

              return (
                <div
                  key={field.id}
                  className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800 sm:grid-cols-[1fr_130px_1fr_auto]"
                >
                  <Controller
                    name={`items.${index}.drugId`}
                    control={control}
                    render={({ field: drugField }) => (
                      <ProductAutocomplete
                        label={`Item ${index + 1}`}
                        selectedKey={drugField.value || null}
                        onSelectionChange={(key) => drugField.onChange(key)}
                        onProductSelect={handleProductSelect}
                        placeholder="Search drug..."
                        required
                        // isDisabled={isReadOnly}
                        readOnly={isReadOnly}
                        error={errors.items?.[index]?.drugId?.message}
                        initialItems={index < initialProducts.length ? [initialProducts[index]] : undefined}
                      />
                    )}
                  />

                  <div className="flex flex-col gap-1.5">
                    <Controller
                      name={`items.${index}.quantity`}
                      control={control}
                      render={({ field }) => (
                        <InputGroup>
                          <InputGroup.Input
                            type="number"
                            min={1}
                            placeholder="Qty"
                            defaultValue={field.value}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === "" ? undefined : Number(val));
                            }}
                            className={cn(errors.items?.[index]?.quantity && "border-danger", "max-w-full")}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            // disabled={isReadOnly}
                            readOnly={isReadOnly}
                          />
                          {selectedProduct?.baseUnitAbbreviation && (
                            <InputGroup.Suffix>
                              <span className="whitespace-nowrap">
                                {selectedProduct.baseUnitAbbreviation}
                              </span>
                            </InputGroup.Suffix>
                          )}
                        </InputGroup>
                      )}
                    />
                    {errors.items?.[index]?.quantity && (
                      <p className="text-sm text-danger">{errors.items[index].quantity?.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Input
                      placeholder="Instructions"
                      // disabled={isReadOnly}
                      readOnly={isReadOnly}
                      {...register(`items.${index}.instructions`)}
                    />
                  </div>

                  <Button
                    size="sm"
                    variant="danger"
                    type="button"
                    className="self-end"
                    onPress={() => setPendingRemoveIndex(index)}
                    isDisabled={isReadOnly}
                    isIconOnly
                  >
                    <TrashBin/>
                  </Button>
                </div>
              );
            })}
          </div>
        </ScrollShadow>
      </div>

      {submitError && <p className="text-sm text-danger">{submitError}</p>}

      <StatusConfirmModal
        state={confirmModalState}
        title={confirmModalTitle}
        message={confirmModalMessage}
        isCancelled={pendingStatus === "CANCELLED"}
        cancelReason={cancelReason}
        onCancelReasonChange={setCancelReason}
        onConfirm={handleConfirmStatusChange}
        onDismiss={handleDismissConfirm}
        isConfirming={isStatusChanging && pendingStatus !== null}
      />

      <DeleteItemConfirmModal
        state={deleteModalState}
        itemName={pendingRemoveIndex !== null ? (productMap.get(watchedItems?.[pendingRemoveIndex]?.drugId ?? "")?.name ?? `Item ${pendingRemoveIndex + 1}`) : ""}
        onConfirm={handleConfirmRemove}
        onDismiss={() => setPendingRemoveIndex(null)}
      />
    </form>
  );
}

function StatusConfirmModal({
  state,
  title,
  message,
  isCancelled,
  cancelReason,
  onCancelReasonChange,
  onConfirm,
  onDismiss,
  isConfirming,
}: {
  state: ReturnType<typeof useOverlayState>;
  title: string;
  message: string;
  isCancelled: boolean;
  cancelReason: string;
  onCancelReasonChange: (value: string) => void;
  onConfirm: () => void;
  onDismiss: () => void;
  isConfirming: boolean;
}) {
  return (
    <Modal state={state}>
      <ModalBackdrop variant="blur">
        <ModalContainer size="sm">
          <ModalDialog>
            <ModalHeader>
              <ModalHeading>{title}</ModalHeading>
            </ModalHeader>
            <ModalBody className="flex flex-col gap-3">
              <p className="text-sm">{message}</p>
              {isCancelled && (
                <TextArea
                  placeholder="Reason for cancellation (optional)"
                  value={cancelReason}
                  onChange={(e) => onCancelReasonChange(e.target.value)}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onPress={onDismiss}>
                No, go back
              </Button>
              <Button
                variant={isCancelled ? "danger" : "primary"}
                onPress={onConfirm}
                isDisabled={isConfirming}
              >
                {isConfirming ? <Spinner size="sm" /> : isCancelled ? "Yes, cancel order" : "Yes, confirm"}
              </Button>
            </ModalFooter>
          </ModalDialog>
        </ModalContainer>
      </ModalBackdrop>
    </Modal>
  );
}

function DeleteItemConfirmModal({
  state,
  itemName,
  onConfirm,
  onDismiss,
}: {
  state: ReturnType<typeof useOverlayState>;
  itemName: string;
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  return (
    <Modal state={state}>
      <ModalBackdrop variant="blur">
        <ModalContainer size="sm">
          <ModalDialog>
            <ModalHeader>
              <ModalHeading>Remove Item</ModalHeading>
            </ModalHeader>
            <ModalBody>
              <p className="text-sm">
                Are you sure you want to remove <span className="font-semibold">{itemName}</span> from the order?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onPress={onDismiss}>
                Cancel
              </Button>
              <Button variant="danger" onPress={onConfirm}>
                Yes, remove
              </Button>
            </ModalFooter>
          </ModalDialog>
        </ModalContainer>
      </ModalBackdrop>
    </Modal>
  );
}

function InfoField({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-zinc-500">{label}</span>

      {children ? (
        <div className="flex flex-col gap-0 text-sm">
          {children}
        </div>
      ) :
        <span className="text-sm text-black">{value}</span>}
    </div>
  );
}
