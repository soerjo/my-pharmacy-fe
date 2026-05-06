import { clients } from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse } from "@/types";
import type {
  Patient,
  PatientFormValues,
  Admission,
  AdmissionFormValues,
  CreateAdmissionFormValues,
  Room,
  RoomFormValues,
  RoomCategory,
  DispenseOrder,
  DispenseOrderFormValues,
  DispenseOrderDetail,
} from "@/types";
import { DispenseOrderCreateFormValues } from "@/types/dispense-orders";

export const depoService = {
  getDispenseOrders: (params?: { search?: string; status?: string; startDate?: string; endDate?: string; page?: number; limit?: number, isExport?:boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.startDate) searchParams.set("startDate", params.startDate);
    if (params?.endDate) searchParams.set("endDate", params.endDate);
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));
    if (params?.isExport !== undefined) searchParams.set("isExport", String(params.isExport));

    return clients.depo.get<ApiResponse<PaginatedResponse<DispenseOrder>>>(
      searchParams.toString() ? `/dispense-orders?${searchParams.toString()}` : "/dispense-orders",
    );
  },

  getDispenseOrder: (id: string) =>
    clients.depo.get<ApiResponse<DispenseOrderDetail>>(`/dispense-orders/${id}`),

  createDispenseOrder: (data: DispenseOrderCreateFormValues) =>
    clients.depo.post<ApiResponse<DispenseOrder>>("/dispense-orders", data),

  updateDispenseOrder: (id: string, data: DispenseOrderFormValues) =>
    clients.depo.put<ApiResponse<DispenseOrder>>(`/dispense-orders/${id}`, data),

  deleteDispenseOrder: (id: string) =>
    clients.depo.delete<ApiResponse<void>>(`/dispense-orders/${id}`),

  prepareDispenseOrder: (id: string) =>
    clients.depo.post<ApiResponse<DispenseOrder>>(`/dispense-orders/${id}/prepare`),

  dispenseDispenseOrder: (id: string) =>
    clients.depo.post<ApiResponse<DispenseOrder>>(`/dispense-orders/${id}/dispense`),

  cancelDispenseOrder: (id: string, data?: { cancelReason?: string }) =>
    clients.depo.post<ApiResponse<DispenseOrder>>(`/dispense-orders/${id}/cancel`, data),

  getPatients: (params?: { isActive?: boolean; search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.isActive !== undefined) searchParams.set("isActive", String(params.isActive));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

    return clients.depo.get<ApiResponse<PaginatedResponse<Patient>>>(
      searchParams.toString() ? `/patients?${searchParams.toString()}` : "/patients"
    );
  },

  getPatient: (id: string) =>
    clients.depo.get<ApiResponse<Patient>>(`/patients/${id}`),

  createPatient: (data: PatientFormValues) =>
    clients.depo.post<ApiResponse<Patient>>("/patients", data),

  updatePatient: (id: string, data: PatientFormValues) =>
    clients.depo.put<ApiResponse<Patient>>(`/patients/${id}`, data),

  deletePatient: (id: string) =>
    clients.depo.delete<ApiResponse<void>>(`/patients/${id}`),

  getAdmissions: (params?: { isActive?: boolean; search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.isActive !== undefined) searchParams.set("isActive", String(params.isActive));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

    return clients.depo.get<ApiResponse<PaginatedResponse<Admission>>>(
      searchParams.toString() ? `/admissions?${searchParams.toString()}` : "/admissions"
    );
  },

  getAdmission: (id: string) =>
    clients.depo.get<ApiResponse<Admission>>(`/admissions/${id}`),

  createAdmission: (data: CreateAdmissionFormValues) =>
    clients.depo.post<ApiResponse<Admission>>("/admissions", data),

  updateAdmission: (id: string, data: AdmissionFormValues) =>
    clients.depo.put<ApiResponse<Admission>>(`/admissions/${id}`, data),

  deleteAdmission: (id: string) =>
    clients.depo.delete<ApiResponse<void>>(`/admissions/${id}`),

  getRoomCategories: (params?: { search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

    return clients.depo.get<ApiResponse<PaginatedResponse<RoomCategory>>>(
      searchParams.toString() ? `/room-categories?${searchParams.toString()}` : "/room-categories"
    );
  },

  getRooms: (params?: { isActive?: boolean; search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.isActive !== undefined) searchParams.set("isActive", String(params.isActive));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

    return clients.depo.get<ApiResponse<PaginatedResponse<Room>>>(
      searchParams.toString() ? `/rooms?${searchParams.toString()}` : "/rooms"
    );
  },

  getRoom: (id: string) =>
    clients.depo.get<ApiResponse<Room>>(`/rooms/${id}`),

  createRoom: (data: RoomFormValues) =>
    clients.depo.post<ApiResponse<Room>>("/rooms", data),

  updateRoom: (id: string, data: RoomFormValues) =>
    clients.depo.put<ApiResponse<Room>>(`/rooms/${id}`, data),

  deleteRoom: (id: string) =>
    clients.depo.delete<ApiResponse<void>>(`/rooms/${id}`),
};
