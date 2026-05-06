import { createEntityStore } from "@/lib/create-entity-store";
import type { Product } from "@/types";

export interface ProductsFilters {
  isActive: boolean;
  search: string;
  productType: string;
  categoryId: string;
  manufacturerId: string;
}

export const useProductsStore = createEntityStore<Product, ProductsFilters>(
  { isActive: true, search: "", productType: "", categoryId: "", manufacturerId: "" },
  "products-store",
);
