export const queryKeys = {
  all: ["all"] as const,
  home: {
    all: ["home"] as const,
  },
  auth: {
    all: ["auth"] as const,
    user: () => [...queryKeys.auth.all, "user"] as const,
  },
} as const;
