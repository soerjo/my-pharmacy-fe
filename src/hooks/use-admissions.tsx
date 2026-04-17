"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { depoService } from "@/services/depo-service";
import type { Admission, AdmissionFormValues } from "@/types";

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

  const admissionsQuery = useQuery({
    queryKey: queryKeys.admissions.list({ ...filters } as Record<string, unknown>),
    queryFn: () => depoService.getAdmissions(filters),
    select: (response) => response.data,
  });

  const createMutation = useMutation({
    mutationFn: (data: AdmissionFormValues) => depoService.createAdmission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admissions.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdmissionFormValues }) =>
      depoService.updateAdmission(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admissions.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => depoService.deleteAdmission(id),
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
