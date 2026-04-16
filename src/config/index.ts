export const appConfig = {
  auth: {
    apiUrl: process.env.NEXT_PUBLIC_API_AUTH_SERVICE ?? "",
  },
  warehouse: {
    apiUrl: process.env.NEXT_PUBLIC_API_WAREHOUSE_SERVICE ?? "",
  },
  depo: {
    apiUrl: process.env.NEXT_PUBLIC_API_DEPO_SERVICE ?? "",
  },
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "",
  isDev: process.env.NODE_ENV === "development",
} as const;

export type AppConfig = typeof appConfig;
