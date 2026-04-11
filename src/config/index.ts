export const appConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "",
  isDev: process.env.NODE_ENV === "development",
} as const;

export type AppConfig = typeof appConfig;
