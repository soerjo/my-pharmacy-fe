"use client";

import { useState } from "react";
import { Button, Spinner } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { useDispenseOrders } from "@/features/dispense-order/hooks";
import { DispenseOrderForm } from "@/features/dispense-order/components/dispense-order-form";
import { cn, formatDate } from "@/utils";
import type { DispenseOrder, DispenseOrderStatus } from "@/features/dispense-order/types";

const statusStyles: Record<DispenseOrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

export function DispenseOrdersTable() {
  const { dispenseOrders, isLoading, deleteOrder } = useDispenseOrders();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<DispenseOrder | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleEdit(order: DispenseOrder) {
    setEditingOrder(order);
    setIsFormOpen(true);
  }

  function handleCloseForm() {
    setIsFormOpen(false);
    setEditingOrder(undefined);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteOrder(id);
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Dispense Orders</h2>
        <Button
          variant="primary"
          onPress={() => {
            setEditingOrder(undefined);
            setIsFormOpen(true);
          }}
        >
          + New Order
        </Button>
      </div>

      {isFormOpen && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingOrder ? "Edit Order" : "New Dispense Order"}
          </h3>
          <DispenseOrderForm
            order={editingOrder}
            onClose={handleCloseForm}
          />
        </div>
      )}

      {dispenseOrders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 py-12 text-center text-zinc-500">
          No dispense orders found. Click &quot;+ New Order&quot; to create one.
        </div>
      ) : (
        <Table aria-label="Dispense orders table">
          <TableHeader>
            <TableColumn>Prescription #</TableColumn>
            <TableColumn>Patient</TableColumn>
            <TableColumn>Medications</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Created</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody items={dispenseOrders}>
            {(order: DispenseOrder) => (
              <TableRow key={order.id}>
                <TableCell>{order.prescriptionNumber}</TableCell>
                <TableCell>{order.patientName}</TableCell>
                <TableCell>{order.medications}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                      statusStyles[order.status]
                    )}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onPress={() => handleEdit(order)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onPress={() => handleDelete(order.id)}
                      isDisabled={deletingId === order.id}
                    >
                      {deletingId === order.id ? <Spinner size="sm" /> : "Delete"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
