import { clients } from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse } from "@/types";
import type {
  DispenseOrder,
  DispenseOrderFormValues,
  Product,
  ProductFormValues,
  ProductTypeEntity,
  UnitOfMeasure,
  ProductCategory,
  Manufacturer,
} from "@/types";

export const warehouseService = {
  getDispenseOrders: () =>
    clients.warehouse.get<ApiResponse<PaginatedResponse<DispenseOrder>>>("/api/dispense-orders"),

  getDispenseOrder: (id: string) =>
    clients.warehouse.get<ApiResponse<DispenseOrder>>(`/api/dispense-orders/${id}`),

  createDispenseOrder: (data: DispenseOrderFormValues) =>
    clients.warehouse.post<ApiResponse<DispenseOrder>>("/api/dispense-orders", data),

  updateDispenseOrder: (id: string, data: DispenseOrderFormValues) =>
    clients.warehouse.put<ApiResponse<DispenseOrder>>(`/api/dispense-orders/${id}`, data),

  deleteDispenseOrder: (id: string) =>
    clients.warehouse.delete<ApiResponse<void>>(`/api/dispense-orders/${id}`),

  getProducts: (params?: { isActive?: boolean; search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.isActive !== undefined) searchParams.set("isActive", String(params.isActive));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

    return clients.warehouse.get<ApiResponse<PaginatedResponse<Product>>>(
      searchParams.toString() ? `/api/products?${searchParams.toString()}` : "/api/products"
    );
  },

  getProduct: (id: string) =>
    clients.warehouse.get<ApiResponse<Product>>(`/api/products/${id}`),

  createProduct: (data: ProductFormValues) =>
    clients.warehouse.post<ApiResponse<Product>>("/api/products", data),

  updateProduct: (id: string, data: ProductFormValues) =>
    clients.warehouse.put<ApiResponse<Product>>(`/api/products/${id}`, data),

  deleteProduct: (id: string) =>
    clients.warehouse.delete<ApiResponse<void>>(`/api/products/${id}`),

  getProductTypes: (params?: { search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

    return clients.warehouse.get<ApiResponse<ProductTypeEntity[]>>(
      searchParams.toString() ? `/api/products/type?${searchParams.toString()}` : "/api/products/type"
    );
  },

  getUnitOfMeasures: (params?: { search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

    return clients.warehouse.get<ApiResponse<PaginatedResponse<UnitOfMeasure>>>(
      searchParams.toString() ? `/api/unit-of-measures?${searchParams.toString()}` : "/api/unit-of-measures"
    );
  },

  getProductCategories: (params?: { search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

    return clients.warehouse.get<ApiResponse<PaginatedResponse<ProductCategory>>>(
      searchParams.toString() ? `/api/product-categories?${searchParams.toString()}` : "/api/product-categories"
    );
  },

  getManufacturers: (params?: { search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

    return clients.warehouse.get<ApiResponse<PaginatedResponse<Manufacturer>>>(
      searchParams.toString() ? `/api/manufacturers?${searchParams.toString()}` : "/api/manufacturers"
    );
  },
};
