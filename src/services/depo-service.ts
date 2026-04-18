import { clients } from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse } from "@/types";
import type {
  Patient,
  PatientFormValues,
  Admission,
  AdmissionFormValues,
} from "@/types";

export const depoService = {
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

  createAdmission: (data: AdmissionFormValues) =>
    clients.depo.post<ApiResponse<Admission>>("/api/admissions", data),

  updateAdmission: (id: string, data: AdmissionFormValues) =>
    clients.depo.put<ApiResponse<Admission>>(`/api/admissions/${id}`, data),

  deleteAdmission: (id: string) =>
    clients.depo.delete<ApiResponse<void>>(`/api/admissions/${id}`),
};
