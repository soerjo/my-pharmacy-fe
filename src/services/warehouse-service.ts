import { clients } from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse } from "@/types";
import type {
  Product,
  ProductFormValues,
  ProductTypeEntity,
  UnitOfMeasure,
  ProductCategory,
  Manufacturer,
} from "@/types";

export const warehouseService = {
  getProducts: (params?: { isActive?: boolean; search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.isActive !== undefined) searchParams.set("isActive", String(params.isActive));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

    return clients.warehouse.get<ApiResponse<PaginatedResponse<Product>>>(
      searchParams.toString() ? `/products?${searchParams.toString()}` : "/products"
    );
  },

  getProduct: (id: string) =>
    clients.warehouse.get<ApiResponse<Product>>(`/products/${id}`),

  createProduct: (data: ProductFormValues) =>
    clients.warehouse.post<ApiResponse<Product>>("/products", data),

  updateProduct: (id: string, data: ProductFormValues) =>
    clients.warehouse.put<ApiResponse<Product>>(`/products/${id}`, data),

  deleteProduct: (id: string) =>
    clients.warehouse.delete<ApiResponse<void>>(`/products/${id}`),

  getProductTypes: (params?: { search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

    return clients.warehouse.get<ApiResponse<ProductTypeEntity[]>>(
      searchParams.toString() ? `/products/type?${searchParams.toString()}` : "/products/type"
    );
  },

  getUnitOfMeasures: (params?: { search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

    return clients.warehouse.get<ApiResponse<PaginatedResponse<UnitOfMeasure>>>(
      searchParams.toString() ? `/unit-of-measures?${searchParams.toString()}` : "/unit-of-measures"
    );
  },

  getProductCategories: (params?: { search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

    return clients.warehouse.get<ApiResponse<PaginatedResponse<ProductCategory>>>(
      searchParams.toString() ? `/product-categories?${searchParams.toString()}` : "/product-categories"
    );
  },

  getManufacturers: (params?: { search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

    return clients.warehouse.get<ApiResponse<PaginatedResponse<Manufacturer>>>(
      searchParams.toString() ? `/manufacturers?${searchParams.toString()}` : "/manufacturers"
    );
  },
};
