import { clients } from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse } from "@/types";
import type { DispenseOrder, DispenseOrderFormValues } from "@/types";

export const warehouseService = {
  getDispenseOrders: () =>
    clients.warehouse.get<ApiResponse<PaginatedResponse<DispenseOrder>>>("/api/dispense-orders"),

  getDispenseOrder: (id: string) =>
    clients.warehouse.get<ApiResponse<DispenseOrder>>(`/api/dispense-orders/${id}`),

  createDispenseOrder: (data: DispenseOrderFormValues) =>
    clients.warehouse.post<ApiResponse<DispenseOrder>>("/api/dispense-orders", data),

  updateDispenseOrder: (id: string, data: DispenseOrderFormValues) =>
    clients.warehouse.put<ApiResponse<DispenseOrder>>(`/api/dispense-orders/${id}`, data),

  deleteDispenseOrder: (id: string) =>
    clients.warehouse.delete<ApiResponse<void>>(`/api/dispense-orders/${id}`),
};
