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
} as const;
