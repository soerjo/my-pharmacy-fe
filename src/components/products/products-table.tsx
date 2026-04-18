"use client";

import { useShallow } from "zustand/react/shallow";
import { Button, Spinner } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableContent,
  TableFooter,
} from "@heroui/react";
import { useProducts } from "@/hooks/use-products";
import { useProductsStore } from "@/stores/products-store";
import { onServerError } from "@/providers/error-provider";
import { ProductForm } from "./product-form";
import { ProductsToolbar } from "./products-toolbar";
import { ProductRow } from "./product-row";
import { ProductsPagination } from "./products-pagination";
import type { Product } from "@/types";

export function ProductsTable() {
  const {
    products,
    isLoading,
    isFetching,
    error,
    deleteProduct,
    pagination,
    paginationMeta,
    setPage,
    setPageSize,
  } = useProducts();

  const {
    filters,
    setFilters,
    isFormOpen,
    editingProduct,
    deletingId,
    openCreateForm,
    openEditForm,
    closeForm,
    setDeletingId,
  } = useProductsStore(
    useShallow((state) => ({
      filters: state.filters,
      setFilters: state.setFilters,
      isFormOpen: state.isFormOpen,
      editingProduct: state.editingProduct,
      deletingId: state.deletingId,
      openCreateForm: state.openCreateForm,
      openEditForm: state.openEditForm,
      closeForm: state.closeForm,
      setDeletingId: state.setDeletingId,
    })),
  );

  const totalPages = paginationMeta?.totalPages ?? 1;
  const totalItems = paginationMeta?.total ?? 0;

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteProduct(id);
    } catch (err) {
      onServerError(err);
    } finally {
      setDeletingId(null);
    }
  }

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
        <p className="text-sm text-danger">Failed to load products. Please try again.</p>
        <Button
          variant="secondary"
          size="sm"
          onPress={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ProductsToolbar
        searchValue={filters.search}
        onSearchChange={(value) => setFilters({ search: value })}
        onAdd={openCreateForm}
      />

      {/* {isFormOpen && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingProduct ? `Edit ${editingProduct.name}` : "New Product"}
          </h3>
          <ProductForm product={editingProduct} onClose={closeForm} />
        </div>
      )} */}

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 py-12 text-center text-zinc-500">
          {filters.search
            ? `No products found for "${filters.search}".`
            : "No products found. Click \"+ Add Product\" to create one."}
        </div>
      ) : (
        <Table aria-label="Products table">
          <TableContent>
            <TableHeader>
              <TableColumn>SKU</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Category</TableColumn>
              <TableColumn>Dosage Form</TableColumn>
              <TableColumn>Strength</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody items={products}>
              {(product: Product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  isDeleting={deletingId === product.id}
                  onEdit={openEditForm}
                  onDelete={handleDelete}
                />
              )}
            </TableBody>
          </TableContent>
          <TableFooter>
            <ProductsPagination
              page={pagination.page}
              pageSize={pagination.pageSize}
              totalItems={totalItems}
              totalPages={totalPages}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </TableFooter>
        </Table>
      )}
    </div>
  );
}
