"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@heroui/react";
import { roomSchema, type RoomFormValues, type Room } from "@/types";
import { useRooms } from "@/hooks/use-rooms";
import { RoomCategoryAutocomplete } from "@/components/ui/room-category-autocomplete";

interface RoomFormProps {
  room?: Room;
  onClose: () => void;
  formId: string;
}

export function RoomForm({ room, onClose, formId }: RoomFormProps) {
  const { createRoom, updateRoom } = useRooms();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditing = !!room;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: room
      ? {
          code: room.code ?? "",
          name: room.name,
          categoryId: room.categoryId ?? "",
        }
      : {
          code: "",
          name: "",
          categoryId: "",
        },
  });

  async function onSubmit(data: RoomFormValues) {
    setSubmitError(null);
    const payload = {
      code: data.code || undefined,
      name: data.name,
      categoryId: data.categoryId,
    };

    try {
      if (isEditing && room) {
        await updateRoom(room.id, payload);
      } else {
        await createRoom(payload);
      }
      onClose();
    } catch {
      setSubmitError(
        isEditing
          ? "Failed to update room. Please try again."
          : "Failed to create room. Please try again.",
      );
    }
  }

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="code" className="text-sm font-medium">
            Code
          </label>
          <Input id="code" placeholder="Enter room code" {...register("code")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Name <span className="text-danger">*</span>
          </label>
          <Input id="name" placeholder="Enter room name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-danger">{errors.name.message}</p>
          )}
        </div>
      </div>

      <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <RoomCategoryAutocomplete
              selectedKey={field.value || null}
              onSelectionChange={(key) => field.onChange(key)}
              label="Category"
              placeholder="Search categories..."
              required
              error={errors.categoryId?.message}
            />
          )}
        />

      {submitError && <p className="text-sm text-danger">{submitError}</p>}
    </form>
  );
}
