"use client";

import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { warehouseService } from "@/services/warehouse-service";
import type { DispenseOrder, DispenseOrderFormValues } from "@/types";

interface DispenseOrdersContextValue {
  dispenseOrders: DispenseOrder[];
  totalOrders: number;
  totalPages: number;
  isLoading: boolean;
  error: Error | null;
  createOrder: (data: DispenseOrderFormValues) => Promise<void>;
  updateOrder: (id: string, data: DispenseOrderFormValues) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

const DispenseOrdersContext = createContext<DispenseOrdersContextValue | undefined>(undefined);

export function DispenseOrdersProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: queryKeys.dispenseOrders.list(),
    queryFn: () => warehouseService.getDispenseOrders(),
    select: (response) => response.data,
  });

  const createMutation = useMutation({
    mutationFn: (data: DispenseOrderFormValues) => warehouseService.createDispenseOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dispenseOrders.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: DispenseOrderFormValues }) =>
      warehouseService.updateDispenseOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dispenseOrders.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => warehouseService.deleteDispenseOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dispenseOrders.all });
    },
  });

  const createOrder = useCallback(async (data: DispenseOrderFormValues) => {
    await createMutation.mutateAsync(data);
  }, [createMutation]);

  const updateOrder = useCallback(async (id: string, data: DispenseOrderFormValues) => {
    await updateMutation.mutateAsync({ id, data });
  }, [updateMutation]);

  const deleteOrder = useCallback(async (id: string) => {
    await deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  const value: DispenseOrdersContextValue = {
    dispenseOrders: ordersQuery.data?.data ?? [],
    totalOrders: ordersQuery.data?.meta.total ?? 0,
    totalPages: ordersQuery.data?.meta.totalPages ?? 0,
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,
    createOrder,
    updateOrder,
    deleteOrder,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };

  return (
    <DispenseOrdersContext.Provider value={value}>
      {children}
    </DispenseOrdersContext.Provider>
  );
}

export function useDispenseOrders() {
  const context = useContext(DispenseOrdersContext);
  if (context === undefined) {
    throw new Error("useDispenseOrders must be used within a DispenseOrdersProvider");
  }
  return context;
}
