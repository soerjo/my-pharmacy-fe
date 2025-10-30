import { addToast } from '@heroui/toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { authForgot, authLogin, authSignUp, getAuthDetail } from '@/shared/services/auth.service';
import { useAuthenticationStore } from '@/shared/store/authentication';
import { IForgotRequest, ILoginRequest, ISignUpRequest } from '@/types/authentication';

export const useAuthLogin = () => {
  const router = useRouter();
  const { login } = useAuthenticationStore();

  return useMutation({
    mutationFn: (params: ILoginRequest) => authLogin(params),
    onSuccess: async (data) => {
      await login(data);
      addToast({
        title: 'Success',
        description: 'You have successfully logged in',
        color: 'success',
        variant: 'flat',
      });
      router.push('/dashboard');
    },
    onError: (error) => {
      addToast({
        title: 'Error',
        description: error?.message || 'Something went wrong',
        color: 'danger',
        variant: 'flat',
      });
    },
  });
};

export const useAuthForgot = () => {
  return useMutation({
    mutationFn: (params: IForgotRequest) => authForgot(params),
  });
};

export const useAuthSignUp = () => {
  return useMutation({
    mutationFn: (params: ISignUpRequest) => authSignUp(params),
  });
};

export const useAuthDetails = () => {
  const router = useRouter();
  const { setToken } = useAuthenticationStore();

  return useMutation({

    mutationFn: (token: string) => getAuthDetail(token),
    onSuccess: async ({data, token}) => {
      console.log({data})
      setToken({
        token: token,
        userDetail: {
          ...data
        }
      });
      addToast({
        title: 'Success',
        description: 'You have successfully logged in',
        color: 'success',
        variant: 'flat',
      });
      router.push('/dashboard');
    },
    onError: (error) => {
      addToast({
        title: 'Error',
        description: error?.message || 'Something went wrong',
        color: 'danger',
        variant: 'flat',
      });
      router.push('/login');
    },
  });};
