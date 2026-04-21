import { QueryProvider } from './query-provider';
import { AuthInitializer } from './auth-provider';

export { AuthInitializer } from './auth-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthInitializer>{children}</AuthInitializer>
    </QueryProvider>
  );
}
