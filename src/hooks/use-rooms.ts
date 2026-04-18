"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { depoService } from "@/services/depo-service";
import { useRoomsStore } from "@/stores/rooms-store";
import type { RoomFormValues } from "@/types";

export function useRooms() {
  const filters = useRoomsStore((s) => s.filters);
  const pagination = useRoomsStore((s) => s.pagination);

  const queryClient = useQueryClient();

  const roomsQuery = useQuery({
    queryKey: queryKeys.rooms.list({
      ...filters,
      page: pagination.page,
      limit: pagination.pageSize,
    }),
    queryFn: () =>
      depoService.getRooms({ ...filters, page: pagination.page, limit: pagination.pageSize }),
    select: (response) => response.data,
    placeholderData: keepPreviousData,
  });

  const paginationMeta = roomsQuery.data
    ? {
        total: roomsQuery.data.meta.total,
        totalPages: roomsQuery.data.meta.totalPages,
        page: roomsQuery.data.meta.page,
        pageSize: roomsQuery.data.meta.limit,
        hasNext: roomsQuery.data.meta.hasNext,
        hasPrev: roomsQuery.data.meta.hasPrev,
      }
    : null;

  const createMutation = useMutation({
    mutationFn: (data: RoomFormValues) =>
      depoService.createRoom(data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.rooms.all,
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: RoomFormValues }) =>
      depoService.updateRoom(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.rooms.all,
      }),
  });

  const updateRoom = async (id: string, data: RoomFormValues) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => depoService.deleteRoom(id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.rooms.all,
      }),
  });

  return {
    rooms: roomsQuery.data?.data ?? [],
    isLoading: roomsQuery.isLoading,
    isFetching: roomsQuery.isFetching,
    isPlaceholderData: roomsQuery.isPlaceholderData,
    error: roomsQuery.error,
    filters,
    pagination,
    paginationMeta,
    setFilters: useRoomsStore.getState().setFilters,
    resetFilters: useRoomsStore.getState().resetFilters,
    setPage: useRoomsStore.getState().setPage,
    setPageSize: useRoomsStore.getState().setPageSize,
    createRoom: createMutation.mutateAsync,
    updateRoom,
    deleteRoom: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
