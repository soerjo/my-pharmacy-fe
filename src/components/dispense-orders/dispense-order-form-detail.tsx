"use client";

import { ScrollShadow, Spinner } from "@heroui/react";
import { useDispenseOrder } from "@/hooks/use-dispense-orders";
import { formatDate, cn } from "@/utils";
import type { DispenseOrderDetailItem, DispenseOrderStatus } from "@/types";

const statusStyles: Record<DispenseOrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  PREPARING: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  DISPENSED: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

interface DispenseOrderFormDetailProps {
  id: string;
}

export function DispenseOrderFormDetail({ id }: DispenseOrderFormDetailProps) {
  const { dispenseOrder, isLoading } = useDispenseOrder(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8">
        <Spinner size="lg" />
        <p className="text-sm text-zinc-500">Loading order detail...</p>
      </div>
    );
  }

  if (!dispenseOrder) {
    return (
      <div className="py-8 text-center text-sm text-zinc-500">
        Order not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <InfoField label="Order Number" value={dispenseOrder.orderNumber} />
        <InfoField label="Status">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              statusStyles[dispenseOrder.status],
            )}
          >
            {dispenseOrder.status}
          </span>
        </InfoField>
        <InfoField label="Admission Number" value={dispenseOrder.admissionNumber || "-"} />
        <InfoField label="Admission Type" value={dispenseOrder.admission_type || "-"} />
        <InfoField label="Admission Status" value={dispenseOrder.admissionStatus || "-"} />
        <InfoField
          label="Admission Date"
          value={dispenseOrder.admissionDate ? formatDate(dispenseOrder.admissionDate) : "-"}
        />
        <InfoField
          label="Created At"
          value={formatDate(dispenseOrder.createdAt)}
        />
        <InfoField
          label="Dispensed At"
          value={dispenseOrder.dispensedAt ? formatDate(dispenseOrder.dispensedAt) : "-"}
        />
      </div>

      {dispenseOrder.notes && (
        <InfoField label="Notes" value={dispenseOrder.notes} />
      )}

      {dispenseOrder.cancelReason && (
        <InfoField label="Cancel Reason" value={dispenseOrder.cancelReason} />
      )}

      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-medium">Items ({dispenseOrder.items.length})</h4>
        <ScrollShadow className="max-h-[25vh]">
        <div className="flex flex-col gap-2">
          {dispenseOrder.items.map((item) => (<ItemRow key={item.id} item={item} />))}
        </div>
        </ScrollShadow>
      </div>
    </div>
  );
}

function ItemRow({ item }: { item: DispenseOrderDetailItem}) {
  return (
    <div
      key={item.id}
      className="grid grid-cols-[1fr_80px_80px_1fr] gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-zinc-500">Drug</span>
        <span className="text-sm">{item.drugName}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-zinc-500">Qty</span>
        <span className="text-sm">
          {item.quantity} {item.baseUnitAbbreviation}
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-zinc-500">Unit</span>
        <span className="text-sm">{item.baseUnitName}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-zinc-500">Instructions</span>
        <span className="text-sm">{item.instructions || "-"}</span>
      </div>
    </div>

  )
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
      {children ?? <span className="text-sm">{value}</span>}
    </div>
  );
}
