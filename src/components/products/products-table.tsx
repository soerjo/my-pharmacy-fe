"use client";

import { useShallow } from "zustand/react/shallow";
import { Button, TableCell, TableColumn, TableRow } from "@heroui/react";
import { DataTable } from "@/components/ui/data-table";
import { useProducts } from "@/hooks/use-products";
import { useProductsStore } from "@/stores/products-store";
import { ProductForm } from "./product-form";
import type { Product } from "@/types";

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

  const {
    filters,
    setFilters,
    isFormOpen,
    editingEntity,
    openCreateForm,
    openEditForm,
    closeForm,
  } = useProductsStore(
    useShallow((state) => ({
      filters: state.filters,
      setFilters: state.setFilters,
      isFormOpen: state.isFormOpen,
      editingEntity: state.editingEntity,
      openCreateForm: state.openCreateForm,
      openEditForm: state.openEditForm,
      closeForm: state.closeForm,
    })),
  );

  return (
    <DataTable<Product>
      entityNamePlural="Products"
      ariaLabel="Products table"
      data={products}
      isLoading={isLoading}
      error={error}
      columns={
        <>
          <TableColumn isRowHeader>Name</TableColumn>
          <TableColumn>Category</TableColumn>
          <TableColumn>Dosage Form</TableColumn>
          <TableColumn>Strength</TableColumn>
          <TableColumn>Actions</TableColumn>
        </>
      }
      renderRow={(product: Product) => (
        <TableRow key={product.id}>
          <TableCell>
            <div>
              <p className="font-bold">{product.name}</p>
              <p className="text-xs text-default-400">{product.categoryName}</p>
            </div>
          </TableCell>
          <TableCell>{product.categoryName ?? "-"}</TableCell>
          <TableCell>{product.dosageForm ?? "-"}</TableCell>
          <TableCell>{product.strength ?? "-"}</TableCell>
          <TableCell>
            <Button
              isDisabled={!product.organizationId}
              size="sm"
              variant="secondary"
              onPress={() => openEditForm(product)}
            >
              Edit
            </Button>
          </TableCell>
        </TableRow>
      )}
      isFormOpen={isFormOpen}
      formTitle={editingEntity ? `Edit ${editingEntity.name}` : "New Product"}
      renderForm={(onClose, formId) => <ProductForm product={editingEntity} onClose={onClose} formId={formId} />}
      onCloseForm={closeForm}
      filters={filters}
      onSearchChange={(value) => setFilters({ search: value })}
      onAdd={openCreateForm}
      addLabel="+ Add Product"
      page={pagination.page}
      pageSize={pagination.pageSize}
      totalItems={paginationMeta?.total ?? 0}
      totalPages={paginationMeta?.totalPages ?? 1}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
    />
  );
}
