"use client";

import { ArrowUpFromSquare } from "@gravity-ui/icons";
import { Button, Spinner, toast } from "@heroui/react";
import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useDispenseOrders } from "@/hooks/use-dispense-orders";
import type { DispenseOrder, DispenseOrderDetailItem } from "@/types";

interface FlatRow {
  orderNumber: string;
  orderDate: string;
  mrn: string;
  patientName: string;
  admissionNumber: string;
  status: string;
  notes: string;
  dispensedAt: string;
  cancelReason: string;
  createdAt: string;
  drugName: string;
  categoryName: string;
  quantity: number;
  instructions: string;
  baseUnitName: string;
}

const columns: { key: keyof FlatRow; header: string }[] = [
  // { key: "orderNumber", header: "Order #" },
  { key: "orderDate", header: "Order Date" },
  { key: "mrn", header: "NRM" },
  { key: "patientName", header: "Patient Name" },
  // { key: "status", header: "Status" },
  { key: "drugName", header: "Drug Name" },
  { key: "categoryName", header: "Drugs Category" },
  { key: "quantity", header: "Qty" },
  { key: "baseUnitName", header: "Unit" },
  { key: "instructions", header: "Instructions" },
  { key: "notes", header: "Notes" },
  // { key: "dispensedAt", header: "Dispensed At" },
  // { key: "cancelReason", header: "Cancel Reason" },
  // { key: "createdAt", header: "Created At" },
];

function flattenOrders(orders: DispenseOrder[]): FlatRow[] {
  return orders.flatMap((order) => {
    const items = (order.items ?? []) as unknown as DispenseOrderDetailItem[];
    const orderFields = {
      orderNumber: order.orderNumber ?? "",
      orderDate: order.orderDate ?? "",
      mrn: order.mrn ?? "",
      patientName: order.patientName ?? "",
      admissionNumber: order.admissionNumber ?? "",
      status: order.status ?? "",
      notes: order.notes ?? "",
      dispensedAt: order.dispensedAt ?? "",
      cancelReason: order.cancelReason ?? "",
      createdAt: order.createdAt ?? "",
    };

      if (items.length === 0) {
        return [{ 
            ...orderFields, 
            drugName: "", 
            categoryName: "", 
            quantity: 0, 
            instructions: "", 
            baseUnitName: "", 
        }];
      }

    return items.map((item) => ({
      ...orderFields,
      drugName: item.drugName ?? "",
      categoryName: item.categoryName ?? "",
      quantity: item.quantity ?? 0,
      instructions: item.instructions ?? "",
      baseUnitName: item.baseUnitName ?? "",
    }));
  });
}

const ExportXLSX = () => {
  const { ordersExportQuery } = useDispenseOrders();
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const result = await ordersExportQuery.refetch();

      if (!result.data) {
        toast.warning("No data to export");
        return;
      }

      const orders: DispenseOrder[] = result.data?.data?.data ?? [];

      if (orders.length === 0) {
        toast.warning("No data to export");
        return;
      }

      const flatRows = flattenOrders(orders);
      const worksheetData = flatRows.map((row) =>
        Object.fromEntries(columns.map((col) => [col.header, String(row[col.key] ?? "")])),
      );

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Dispense Orders");

      const columnWidths = columns.map((col) => ({
        wch:
          Math.max(
            col.header.length,
            ...flatRows.map((row) => String(row[col.key] ?? "").length),
          ) + 2,
      }));
      worksheet["!cols"] = columnWidths;

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `dispense-orders-${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error("Export error:", err);
      toast.danger("Export failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Button variant="secondary" isIconOnly={true} isDisabled={loading} onPress={handleExport} className="h-12 w-12 aspect-square rounded-full shadow-lg md:hidden">
      {loading ? <Spinner color="current" size="sm" /> : <ArrowUpFromSquare />}
      {/* Export */}
    </Button>
    <Button variant="secondary" isDisabled={loading} onPress={handleExport} className="shadow-lg md:flex hidden">
      {loading ? <Spinner color="current" size="sm" /> : <ArrowUpFromSquare />}
      Export
    </Button>
    </>
  );
};

export default ExportXLSX;
