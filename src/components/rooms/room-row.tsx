"use client";

import { Button, Spinner } from "@heroui/react";
import { TableCell, TableRow } from "@heroui/react";
import type { Room } from "@/types";

interface RoomRowProps {
  room: Room;
  isDeleting: boolean;
  onEdit: (room: Room) => void;
  onDelete: (id: string) => void;
}

export function RoomRow({ room, isDeleting, onEdit, onDelete }: RoomRowProps) {
  return (
    <TableRow key={room.id}>
      <TableCell>{room.code ?? "-"}</TableCell>
      <TableCell>{room.name}</TableCell>
      <TableCell>{room?.categoryName ?? "-"}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onPress={() => onEdit(room)}>Edit</Button>
          <Button size="sm" variant="danger" onPress={() => onDelete(room.id)} isDisabled={isDeleting}>
            {isDeleting ? <Spinner size="sm" /> : "Delete"}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
