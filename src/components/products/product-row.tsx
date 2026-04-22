"use client";

import { Button, Spinner } from "@heroui/react";
import { TableCell, TableRow } from "@heroui/react";
import type { Product } from "@/types";

interface ProductRowProps {
  product: Product;
  isDeleting: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductRow({ product, isDeleting, onEdit, onDelete }: ProductRowProps) {
  return (
    <TableRow key={product.id}>
      <TableCell>
        <div>
          <p className="font-bold">{product.name}</p>
          <p className="text-xs text-default-400" >{product.categoryName}</p>
          {/* <p className="text-xs text-default-400">{product.code}</p> */}
        </div>
      </TableCell>
      <TableCell>{product.categoryName ?? "-"}</TableCell>
      {/* <TableCell>{product.manufacturerName ?? "-"}</TableCell> */}
      <TableCell>{product.dosageForm ?? "-"}</TableCell>
      <TableCell>{product.strength ?? "-"}</TableCell>
      <TableCell>
        <div className="flex gap-2">
            <Button isDisabled={!product.organizationId} size="sm" variant="secondary" onPress={() => onEdit(product)}>
              Edit
            </Button>
          {/* <Button size="sm" variant="danger" onPress={() => onDelete(product.id)} isDisabled={isDeleting}>
            {isDeleting ? <Spinner size="sm" /> : "Delete"}
          </Button> */}
        </div>
      </TableCell>
    </TableRow>
  );
}
