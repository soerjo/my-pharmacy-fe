"use client";

import { useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopover,
  ListBox,
  ListBoxItem,
  Pagination,
} from "@heroui/react";

const PAGE_SIZE_OPTIONS = [
  { id: "10", label: "10 / page" },
  { id: "25", label: "25 / page" },
  { id: "50", label: "50 / page" },
  { id: "100", label: "100 / page" },
];

interface TablePaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function TablePagination({
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const pages = useMemo(() => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const delta: (number | "ellipsis")[] = [1];

    if (page > 3) delta.push("ellipsis");

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) delta.push(i);

    if (page < totalPages - 2) delta.push("ellipsis");

    delta.push(totalPages);

    return delta;
  }, [page, totalPages]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between items-center justify-center px-2 py-3 w-full">
      <div className="flex items-center gap-3 w-full">
        <Pagination.Summary>
          {totalItems} result{totalItems !== 1 ? "s" : ""}
        </Pagination.Summary>
        <Select
          selectedKey={String(pageSize)}
          onSelectionChange={(key) => {
            if (key) onPageSizeChange(Number(key));
          }}
          className="w-32"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectPopover>
            <ListBox items={PAGE_SIZE_OPTIONS}>
              {(item) => (
                <ListBoxItem key={item.id} textValue={item.label}>
                  {item.label}
                </ListBoxItem>
              )}
            </ListBox>
          </SelectPopover>
        </Select>
      </div>
      {totalPages > 1 && (
        <Pagination size="sm" className="w-fit">
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.Previous
                isDisabled={page <= 1}
                onPress={() => onPageChange(page - 1)}
              >
                <Pagination.PreviousIcon />
              </Pagination.Previous>
            </Pagination.Item>
            {pages.map((p, i) =>
              p === "ellipsis" ? (
                <Pagination.Item key={`ellipsis-${i}`}>
                  <Pagination.Ellipsis />
                </Pagination.Item>
              ) : (
                <Pagination.Item key={p}>
                  <Pagination.Link isActive={p === page} onPress={() => onPageChange(p)}>
                    {p}
                  </Pagination.Link>
                </Pagination.Item>
              ),
            )}
            <Pagination.Item>
              <Pagination.Next
                isDisabled={page >= totalPages}
                onPress={() => onPageChange(page + 1)}
              >
                <Pagination.NextIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      )}
    </div>
  );
}
