"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ROUTES } from "@/constants";
import { depoClient, queryKeys } from "@/lib";
import type { ApiResponse } from "@/types";
import type { PatientFormValues, Patient } from "@/features/patients/types";

interface PatientFilters {
  isActive: boolean;
  search: string;
}

interface PatientsContextValue {
  patients: Patient[];
  isLoading: boolean;
  error: Error | null;
  filters: PatientFilters;
  setSearch: (search: string) => void;
  setIsActive: (isActive: boolean) => void;
  createPatient: (data: PatientFormValues) => Promise<void>;
  updatePatient: (id: string, data: PatientFormValues) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

const PatientsContext = createContext<PatientsContextValue | undefined>(undefined);

export function PatientsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<PatientFilters>({
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

  const patientsQuery = useQuery({
    queryKey: queryKeys.patients.list(Object.fromEntries(params)),
    queryFn: () =>
      depoClient.get<ApiResponse<Patient[]>>(
        `${API_ROUTES.patients}?${params.toString()}`
      ),
    select: (response) => response.data,
  });

  const createMutation = useMutation({
    mutationFn: (data: PatientFormValues) =>
      depoClient.post<ApiResponse<Patient>>(API_ROUTES.patients, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PatientFormValues }) =>
      depoClient.put<ApiResponse<Patient>>(`${API_ROUTES.patients}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      depoClient.delete<ApiResponse<void>>(`${API_ROUTES.patients}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.all });
    },
  });

  const createPatient = useCallback(async (data: PatientFormValues) => {
    await createMutation.mutateAsync(data);
  }, [createMutation]);

  const updatePatient = useCallback(async (id: string, data: PatientFormValues) => {
    await updateMutation.mutateAsync({ id, data });
  }, [updateMutation]);

  const deletePatient = useCallback(async (id: string) => {
    await deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  const value: PatientsContextValue = {
    patients: patientsQuery.data ?? [],
    isLoading: patientsQuery.isLoading,
    error: patientsQuery.error,
    filters,
    setSearch,
    setIsActive,
    createPatient,
    updatePatient,
    deletePatient,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };

  return (
    <PatientsContext.Provider value={value}>
      {children}
    </PatientsContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientsContext);
  if (context === undefined) {
    throw new Error("usePatients must be used within a PatientsProvider");
  }
  return context;
}
