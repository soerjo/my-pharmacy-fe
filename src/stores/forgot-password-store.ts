import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { authService } from '@/services/auth-service';
import type { ForgotPasswordFormValues } from '@/types';

interface ForgotPasswordState {
  isLoading: boolean;
  error: Error | null;

  forgotPassword: (data: ForgotPasswordFormValues) => Promise<void>;
  reset: () => void;
}

export const useForgotPasswordStore = create<ForgotPasswordState>()(
  devtools(
    (set) => ({
      isLoading: false,
      error: null,

      forgotPassword: async (data: ForgotPasswordFormValues) => {
        set({ isLoading: true, error: null }, false, 'forgotPassword/start');
        try {
          await authService.forgotPassword(data);
          set({ isLoading: false }, false, 'forgotPassword/success');
        } catch (error) {
          set({ isLoading: false, error: error as Error }, false, 'forgotPassword/error');
          throw error;
        }
      },

      reset: () => {
        set({ isLoading: false, error: null }, false, 'reset');
      },
    }),
    { name: 'forgot-password-store' },
  ),
);
