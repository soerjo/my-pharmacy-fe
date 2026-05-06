"use client";

import { useState, useCallback, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  Button,
  TableCell,
  TableColumn,
  TableRow,
  TooltipRoot,
  TooltipContent,
  toast,
  useOverlayState,
  Modal,
  ModalBackdrop,
  ModalContainer,
  ModalDialog,
  Table,
} from "@heroui/react";
import { Copy } from "@gravity-ui/icons";
import { DataTable } from "@/components/ui/data-table";
import { useProducts } from "@/hooks/use-products";
import { useProductsStore } from "@/stores/products-store";
import { ProductCreateForm } from "./product-create-form";
import { ProductUpdateForm } from "./product-update-form";
import { ChangesConfirmModal } from "@/components/ui";
import { ProductTypeFilter, ProductCategoryFilter, ManufacturerFilter } from "@/components/ui";
import type { Product } from "@/types";

function CopyableText({ text }: { text?: string | null }) {
  const handleCopy = useCallback(async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    toast.success("Copied!", { description: text });
  }, [text]);

  if (!text) return <p>-</p>;

  return (
    <TooltipRoot>
      <div className="flex items-center gap-1.5">
        <p>{text}</p>
        <TooltipContent showArrow>
          <span className="text-xs">Copy</span>
        </TooltipContent>
        <button
          type="button"
          onClick={handleCopy}
          className="text-default-400 hover:text-default-600 transition-colors hover:cursor-pointer"
        >
          <Copy className="size-3.5" />
        </button>
      </div>
    </TooltipRoot>
  );
}

export function ProductsTable() {
  const {
    products,
    isLoading,
    error,
    pagination,
    paginationMeta,
    setPage,
    setPageSize,
  } = useProducts();

  const { filters, setFilters, isFormOpen, openCreateForm, closeForm } =
    useProductsStore(
      useShallow((state) => ({
        filters: state.filters,
        setFilters: state.setFilters,
        isFormOpen: state.isFormOpen,
        openCreateForm: state.openCreateForm,
        closeForm: state.closeForm,
      })),
    );

  const [updateId, setUpdateId] = useState<string | null>(null);

  const isCreateDirtyRef = useRef(false);
  const createChangesOverlayState = useOverlayState({ defaultOpen: false });

  const handleCreateCloseRequest = useCallback(() => {
    if (isCreateDirtyRef.current) {
      createChangesOverlayState.open();
    } else {
      closeForm();
    }
  }, [closeForm, createChangesOverlayState]);

  const handleCreateDirtyChange = useCallback((dirty: boolean) => {
    isCreateDirtyRef.current = dirty;
  }, []);

  const updateModalState = useOverlayState({
    isOpen: !!updateId,
    onOpenChange: (open) => {
      if (!open) {
        setUpdateId(null);
      }
    },
  });

  function openUpdate(id: string) {
    setUpdateId(id);
  }

  function closeUpdate() {
    setUpdateId(null);
  }

  return (
    <>
      <DataTable<Product>
        entityNamePlural="Products"
        ariaLabel="Products table"
        data={products}
        isLoading={isLoading}
        error={error}
        columns={
          <>
            <TableColumn defaultWidth="1fr" minWidth={200}>
              Name <Table.ColumnResizer />
            </TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={180}>
              Code <Table.ColumnResizer />
            </TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={180}>
              Category <Table.ColumnResizer />
            </TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={160}>
              Dosage Form</TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={100}>
              Strength</TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={170}>
              Manufacturer</TableColumn>
            <TableColumn defaultWidth="1fr" minWidth={100}>
              Actions <Table.ColumnResizer />
            </TableColumn>
          </>
        }
        renderRow={(product: Product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div>
                <p className="font-bold">{product.name}</p>
                <p className="text-xs text-default-400">{product.productType ?? "-"}</p>
              </div>
            </TableCell>
            <TableCell>
              <CopyableText text={product.code} />
            </TableCell>
            <TableCell>{product.categoryName ?? "-"}</TableCell>
            <TableCell>{product.dosageForm ?? "-"}</TableCell>
            <TableCell>{product.strength ?? "-"}</TableCell>
            <TableCell>{product.manufacturerName ?? "-"}</TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button
                  isDisabled={!product.organizationId}
                  size="sm"
                  variant="secondary"
                  onPress={() => openUpdate(product.id!)}
                >
                  Edit
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
        isFormOpen={isFormOpen}
        formTitle="New Product"
        renderForm={(onClose, formId, onSubmittingChange) => (
          <ProductCreateForm onClose={onClose} formId={formId} onDirtyChange={handleCreateDirtyChange} onSubmittingChange={onSubmittingChange} />
        )}
        onCloseForm={handleCreateCloseRequest}
        filters={filters}
        onSearchChange={(value) => setFilters({ search: value })}
        onAdd={openCreateForm}
        addLabel="+ Add Product"
        toolbarExtra={
          <div className="flex md:flex-row flex-col gap-4 w-full">
            <ProductTypeFilter filters={filters} setFilters={setFilters} />
            <ProductCategoryFilter filters={filters} setFilters={setFilters} />
            <ManufacturerFilter filters={filters} setFilters={setFilters} />
          </div>
        }
        page={pagination.page}
        pageSize={pagination.pageSize}
        totalItems={paginationMeta?.total ?? 0}
        totalPages={paginationMeta?.totalPages ?? 1}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <ChangesConfirmModal
        state={createChangesOverlayState}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to close? All changes will be lost."
        onConfirm={closeForm}
        onDismiss={() => createChangesOverlayState.close()}
      />

      <Modal state={updateModalState}>
        <ModalBackdrop variant="blur">
          <ModalContainer size="lg">
            <ModalDialog className="h-dvh w-full max-w-full md:h-auto md:w-3/4 md:max-w-2/4 md:rounded-3xl p-0 md:p-2">
              <ProductUpdateForm id={updateId!} onClose={closeUpdate} />
            </ModalDialog>
          </ModalContainer>
        </ModalBackdrop>
      </Modal>
    </>
  );
}
