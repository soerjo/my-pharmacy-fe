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
} from "@/types";

export const depoService = {
  getDispenseOrders: (params?: { search?: string; status?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

    return clients.depo.get<ApiResponse<PaginatedResponse<DispenseOrder>>>(
      searchParams.toString() ? `/api/dispense-orders?${searchParams.toString()}` : "/api/dispense-orders",
    );
  },

  getDispenseOrder: (id: string) =>
    clients.depo.get<ApiResponse<DispenseOrder>>(`/api/dispense-orders/${id}`),

  createDispenseOrder: (data: DispenseOrderFormValues) =>
    clients.depo.post<ApiResponse<DispenseOrder>>("/api/dispense-orders", data),

  updateDispenseOrder: (id: string, data: DispenseOrderFormValues) =>
    clients.depo.put<ApiResponse<DispenseOrder>>(`/api/dispense-orders/${id}`, data),

  deleteDispenseOrder: (id: string) =>
    clients.depo.delete<ApiResponse<void>>(`/api/dispense-orders/${id}`),

  getPatients: (params?: { isActive?: boolean; search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.isActive !== undefined) searchParams.set("isActive", String(params.isActive));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

    return clients.depo.get<ApiResponse<PaginatedResponse<Patient>>>(
      searchParams.toString() ? `/api/patients?${searchParams.toString()}` : "/api/patients"
    );
  },

  getPatient: (id: string) =>
    clients.depo.get<ApiResponse<Patient>>(`/api/patients/${id}`),

  createPatient: (data: PatientFormValues) =>
    clients.depo.post<ApiResponse<Patient>>("/api/patients", data),

  updatePatient: (id: string, data: PatientFormValues) =>
    clients.depo.put<ApiResponse<Patient>>(`/api/patients/${id}`, data),

  deletePatient: (id: string) =>
    clients.depo.delete<ApiResponse<void>>(`/api/patients/${id}`),

  getAdmissions: (params?: { isActive?: boolean; search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.isActive !== undefined) searchParams.set("isActive", String(params.isActive));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

    return clients.depo.get<ApiResponse<PaginatedResponse<Admission>>>(
      searchParams.toString() ? `/api/admissions?${searchParams.toString()}` : "/api/admissions"
    );
  },

  getAdmission: (id: string) =>
    clients.depo.get<ApiResponse<Admission>>(`/api/admissions/${id}`),

  createAdmission: (data: CreateAdmissionFormValues) =>
    clients.depo.post<ApiResponse<Admission>>("/api/admissions", data),

  updateAdmission: (id: string, data: AdmissionFormValues) =>
    clients.depo.put<ApiResponse<Admission>>(`/api/admissions/${id}`, data),

  deleteAdmission: (id: string) =>
    clients.depo.delete<ApiResponse<void>>(`/api/admissions/${id}`),

  getRoomCategories: (params?: { search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

    return clients.depo.get<ApiResponse<PaginatedResponse<RoomCategory>>>(
      searchParams.toString() ? `/api/room-categories?${searchParams.toString()}` : "/api/room-categories"
    );
  },

  getRooms: (params?: { isActive?: boolean; search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.isActive !== undefined) searchParams.set("isActive", String(params.isActive));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

    return clients.depo.get<ApiResponse<PaginatedResponse<Room>>>(
      searchParams.toString() ? `/api/rooms?${searchParams.toString()}` : "/api/rooms"
    );
  },

  getRoom: (id: string) =>
    clients.depo.get<ApiResponse<Room>>(`/api/rooms/${id}`),

  createRoom: (data: RoomFormValues) =>
    clients.depo.post<ApiResponse<Room>>("/api/rooms", data),

  updateRoom: (id: string, data: RoomFormValues) =>
    clients.depo.put<ApiResponse<Room>>(`/api/rooms/${id}`, data),

  deleteRoom: (id: string) =>
    clients.depo.delete<ApiResponse<void>>(`/api/rooms/${id}`),
};
