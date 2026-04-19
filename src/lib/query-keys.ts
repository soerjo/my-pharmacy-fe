export const queryKeys = {
  home: {
    all: ["home"] as const,
  },
  auth: {
    verify: ["auth", "verify"] as const,
    me: ["auth", "me"] as const,
  },
  patients: {
    all: ["patients"] as const,
    list: (params?: Record<string, unknown>) => ["patients", "list", params] as const,
    detail: (id: string) => ["patients", "detail", id] as const,
  },
  admissions: {
    all: ["admissions"] as const,
    list: (params?: Record<string, unknown>) => ["admissions", "list", params] as const,
    detail: (id: string) => ["admissions", "detail", id] as const,
  },
  dispenseOrders: {
    all: ["dispenseOrders"] as const,
    list: (params?: Record<string, unknown>) => ["dispenseOrders", "list", params] as const,
    detail: (id: string) => ["dispenseOrders", "detail", id] as const,
  },
  rooms: {
    all: ["rooms"] as const,
    list: (params?: Record<string, unknown>) => ["rooms", "list", params] as const,
    detail: (id: string) => ["rooms", "detail", id] as const,
  },
  roomCategories: {
    all: ["roomCategories"] as const,
    list: (params?: Record<string, unknown>) => ["roomCategories", "list", params] as const,
    detail: (id: string) => ["roomCategories", "detail", id] as const,
  },
  products: {
    all: ["products"] as const,
    list: (params?: Record<string, unknown>) => ["products", "list", params] as const,
    detail: (id: string) => ["products", "detail", id] as const,
  },
  productTypes: {
    all: ["productTypes"] as const,
    list: (params?: Record<string, unknown>) => ["productTypes", "list", params] as const,
  },
  unitOfMeasures: {
    all: ["unitOfMeasures"] as const,
    list: (params?: Record<string, unknown>) => ["unitOfMeasures", "list", params] as const,
  },
  productCategories: {
    all: ["productCategories"] as const,
    list: (params?: Record<string, unknown>) => ["productCategories", "list", params] as const,
  },
  manufacturers: {
    all: ["manufacturers"] as const,
    list: (params?: Record<string, unknown>) => ["manufacturers", "list", params] as const,
  },
} as const;
