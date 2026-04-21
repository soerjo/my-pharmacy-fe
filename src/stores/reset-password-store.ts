import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { authService } from '@/services/auth-service';
import type { ResetPasswordFormValues } from '@/types';

interface ResetPasswordState {
  isLoading: boolean;
  error: Error | null;

  resetPassword: (data: ResetPasswordFormValues) => Promise<void>;
  reset: () => void;
}

export const useResetPasswordStore = create<ResetPasswordState>()(
  devtools(
    (set) => ({
      isLoading: false,
      error: null,

      resetPassword: async (data: ResetPasswordFormValues) => {
        set({ isLoading: true, error: null }, false, 'resetPassword/start');
        try {
          await authService.resetPassword(data);
          set({ isLoading: false }, false, 'resetPassword/success');
        } catch (error) {
          set({ isLoading: false, error: error as Error }, false, 'resetPassword/error');
          throw error;
        }
      },

      reset: () => {
        set({ isLoading: false, error: null }, false, 'reset');
      },
    }),
    { name: 'reset-password-store' },
  ),
);
