"use client";

import { Button, Spinner } from "@heroui/react";
import { TableCell, TableRow } from "@heroui/react";
import { formatDate } from "@/utils";
import type { DispenseOrder, DispenseOrderStatus } from "@/types";
import { cn } from "@/utils";
import { useRouter } from "next/navigation";
import { DispenseOrderModal } from "./dispense-order-form-modal";

const statusStyles: Record<DispenseOrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  PREPARING: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  DISPENSED: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

interface DispenseOrderRowProps {
  order: DispenseOrder;
  isDeleting: boolean;
  onEdit: (order: DispenseOrder) => void;
  onDelete: (id: string) => void;
}

export function DispenseOrderRow({ order, isDeleting, onEdit, onDelete }: DispenseOrderRowProps) {
  return (
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
        <div className="flex gap-2">
          {/* <Button size="sm" variant="secondary" onPress={() => router.push(`?id=${order.id}`)}>
            Edit
          </Button> */}
          <DispenseOrderModal id={order.id!} />
          {/* <Button
            size="sm"
            variant="danger"
            onPress={() => onDelete(order.id ?? order.orderNumber)}
            isDisabled={isDeleting}
          >
            {isDeleting ? <Spinner size="sm" /> : "Delete"}
          </Button> */}
        </div>
      </TableCell>
    </TableRow>
  );
}
