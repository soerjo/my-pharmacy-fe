import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { authService } from '@/services/auth-service';
import { registerApiSchema, type RegisterFormValues } from '@/types';

interface RegisterState {
  isLoading: boolean;
  error: Error | null;

  register: (data: RegisterFormValues) => Promise<void>;
  reset: () => void;
}

export const useRegisterStore = create<RegisterState>()(
  devtools(
    (set) => ({
      isLoading: false,
      error: null,

      register: async (data: RegisterFormValues) => {
        set({ isLoading: true, error: null }, false, 'register/start');
        try {
          const apiData = registerApiSchema.parse(data);
          await authService.register(apiData);
          set({ isLoading: false }, false, 'register/success');
        } catch (error) {
          set({ isLoading: false, error: error as Error }, false, 'register/error');
          throw error;
        }
      },

      reset: () => {
        set({ isLoading: false, error: null }, false, 'reset');
      },
    }),
    { name: 'register-store' },
  ),
);
