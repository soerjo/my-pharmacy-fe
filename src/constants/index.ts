export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "My App";

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  patients: "/patients",
  admissions: "/admissions",
  dispenseOrders: "/dispense-order",
  rooms: "/rooms",
  products: "/products",
  settings: "/settings",
} as const;