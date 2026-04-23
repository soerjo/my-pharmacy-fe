"use client";

import { type ReactNode } from "react";
import { Button, ModalFooter, Spinner, useOverlayState } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableContent,
  TableFooter,
  TableScrollContainer,
} from "@heroui/react";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContainer,
  ModalDialog,
  ModalHeader,
  ModalHeading,
} from "@heroui/react";
import { TablePagination } from "./table-pagination";
import { TableToolbar } from "./table-toolbar";
import { Plus } from "@gravity-ui/icons";

const FORM_ID = "data-table-form";

interface DataTableProps<T extends object> {
  entityNamePlural: string;
  ariaLabel: string;

  data: T[];
  isLoading: boolean;
  error: Error | null;

  columns: ReactNode;
  renderRow: (item: T) => ReactNode;

  isFormOpen: boolean;
  formTitle: string;
  renderForm: (onClose: () => void, formId: string) => ReactNode;
  onCloseForm: () => void;

  filters: { search: string };
  onSearchChange: (value: string) => void;
  onAdd: () => void;
  addLabel: string;
  toolbarExtra?: ReactNode;

  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function DataTable<T extends object>({
  entityNamePlural,
  ariaLabel,
  data,
  isLoading,
  error,
  columns,
  renderRow,
  isFormOpen,
  formTitle,
  renderForm,
  onCloseForm,
  filters,
  onSearchChange,
  onAdd,
  addLabel,
  toolbarExtra,
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<T>) {
  const modalState = useOverlayState({
    isOpen: isFormOpen,
    onOpenChange: (open) => {
      if (!open) onCloseForm();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-danger/20 bg-danger/5 py-12">
        <p className="text-sm text-danger">
          Failed to load {entityNamePlural.toLowerCase()}. Please try again.
        </p>
        <Button variant="secondary" size="sm" onPress={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        title={entityNamePlural}
        searchPlaceholder={`Search ${entityNamePlural.toLowerCase()}...`}
        searchValue={filters.search}
        onSearchChange={onSearchChange}
        addLabel={addLabel}
        onAdd={onAdd}
        extra={toolbarExtra}
      />

      <Modal state={modalState}>
        <ModalBackdrop variant="blur">
          <ModalContainer size="lg" className="p-2 sm:p-10">
            <ModalDialog className="h-dvh w-full max-w-full rounded-none sm:h-auto sm:w-3/4 sm:max-w-3/4 sm:rounded-3xl">
              <ModalHeader>
                <ModalHeading>{formTitle}</ModalHeading>
              </ModalHeader>
              <ModalBody className="p-2">{renderForm(onCloseForm, FORM_ID)}</ModalBody>
              <ModalFooter>
                <Button variant="secondary" onPress={onCloseForm}>
                  Cancel
                </Button>
                <Button type="submit" form={FORM_ID} variant="primary">
                  Save
                </Button>
              </ModalFooter>
            </ModalDialog>
          </ModalContainer>
        </ModalBackdrop>
      </Modal>

      {data.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 py-12 text-center text-zinc-500">
          {filters.search
            ? `No ${entityNamePlural.toLowerCase()} found for "${filters.search}".`
            : `No ${entityNamePlural.toLowerCase()} found. Click "${addLabel}" to create one.`}
        </div>
      ) : (
        <Table>
        <Table.ResizableContainer aria-label={ariaLabel}>
          <TableScrollContainer>
            <Table.Content>
              <Table.Header>{columns}</Table.Header>
              <Table.Body items={data}>{(item: T) => renderRow(item)}</Table.Body>
            </Table.Content>
          </TableScrollContainer>
          <TableFooter>
            <div className="flex flex-col items-start justify-center w-full">
              <TablePagination
                page={page}
                pageSize={pageSize}
                totalItems={totalItems}
                totalPages={totalPages}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
              />
              <Button variant="primary"  onPress={onAdd} className="flex md:hidden self-end" isIconOnly>
                <Plus />
              </Button>
            </div>
          </TableFooter>


        </Table.ResizableContainer>
        </Table>
      )}
    </div>
  );
}
