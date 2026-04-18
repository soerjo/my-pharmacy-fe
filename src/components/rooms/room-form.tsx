"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Spinner } from "@heroui/react";
import { roomSchema, type RoomFormValues, type Room } from "@/types";
import { useRooms } from "@/hooks/use-rooms";
import { onServerError } from "@/providers/error-provider";
import { RoomCategoryAutocomplete } from "@/components/ui/room-category-autocomplete";

interface RoomFormProps {
  room?: Room;
  onClose: () => void;
}

export function RoomForm({ room, onClose }: RoomFormProps) {
  const { createRoom, updateRoom, isCreating, isUpdating } =
    useRooms();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditing = !!room;
  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
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
    console.log({data})
    setSubmitError(null);
    const payload = {
      code: data.code || undefined,
      name: data.name,
      categoryId: data.categoryId,
    };

    try {
      console.log({room})
      console.log({payload})
      if (isEditing && room) {
        await updateRoom(room.id, payload);
      } else {
        await createRoom(payload);
      }
      onClose();
    } catch (err) {
      onServerError(err);
      setSubmitError(
        isEditing
          ? "Failed to update room. Please try again."
          : "Failed to create room. Please try again.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onPress={onClose}>Cancel</Button>
        <Button type="submit" variant="primary" isDisabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" />
              {isEditing ? "Updating..." : "Creating..."}
            </span>
          ) : isEditing ? (
            "Update Room"
          ) : (
            "Create Room"
          )}
        </Button>
      </div>
    </form>
  );
}
