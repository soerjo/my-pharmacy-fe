"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ROUTES } from "@/constants";
import { depoClient, queryKeys } from "@/lib";
import type { ApiResponse } from "@/types";
import type { AdmissionFormValues, Admission } from "@/features/admission/types";

interface AdmissionFilters {
  isActive: boolean;
  search: string;
}

interface AdmissionsContextValue {
  admissions: Admission[];
  isLoading: boolean;
  error: Error | null;
  filters: AdmissionFilters;
  setSearch: (search: string) => void;
  setIsActive: (isActive: boolean) => void;
  createAdmission: (data: AdmissionFormValues) => Promise<void>;
  updateAdmission: (id: string, data: AdmissionFormValues) => Promise<void>;
  deleteAdmission: (id: string) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

const AdmissionsContext = createContext<AdmissionsContextValue | undefined>(undefined);

export function AdmissionsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<AdmissionFilters>({
    isActive: true,
    search: "",
  });

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const setIsActive = useCallback((isActive: boolean) => {
    setFilters((prev) => ({ ...prev, isActive }));
  }, []);

  const params = new URLSearchParams();
  params.set("isActive", String(filters.isActive));
  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }

  const admissionsQuery = useQuery({
    queryKey: queryKeys.admissions.list(Object.fromEntries(params)),
    queryFn: () =>
      depoClient.get<ApiResponse<Admission[]>>(
        `${API_ROUTES.admissions}?${params.toString()}`
      ),
    select: (response) => response.data,
  });

  const createMutation = useMutation({
    mutationFn: (data: AdmissionFormValues) =>
      depoClient.post<ApiResponse<Admission>>(API_ROUTES.admissions, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admissions.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdmissionFormValues }) =>
      depoClient.put<ApiResponse<Admission>>(`${API_ROUTES.admissions}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admissions.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      depoClient.delete<ApiResponse<void>>(`${API_ROUTES.admissions}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admissions.all });
    },
  });

  const createAdmission = useCallback(async (data: AdmissionFormValues) => {
    await createMutation.mutateAsync(data);
  }, [createMutation]);

  const updateAdmission = useCallback(async (id: string, data: AdmissionFormValues) => {
    await updateMutation.mutateAsync({ id, data });
  }, [updateMutation]);

  const deleteAdmission = useCallback(async (id: string) => {
    await deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  const value: AdmissionsContextValue = {
    admissions: admissionsQuery.data ?? [],
    isLoading: admissionsQuery.isLoading,
    error: admissionsQuery.error,
    filters,
    setSearch,
    setIsActive,
    createAdmission,
    updateAdmission,
    deleteAdmission,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };

  return (
    <AdmissionsContext.Provider value={value}>
      {children}
    </AdmissionsContext.Provider>
  );
}

export function useAdmissions() {
  const context = useContext(AdmissionsContext);
  if (context === undefined) {
    throw new Error("useAdmissions must be used within a AdmissionsProvider");
  }
  return context;
}
