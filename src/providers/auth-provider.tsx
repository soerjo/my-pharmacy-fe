'use client';

import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export function AuthInitializer({ children }: { children: ReactNode }) {
  const verify = useAuthStore((s) => s.verify);

  useEffect(() => {
    verify();
  }, [verify]);

  return <>{children}</>;
}
