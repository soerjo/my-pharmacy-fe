import Cookies from 'js-cookie';
import { create } from 'zustand';
import { useEffect } from 'react';

import { getUserDetail } from '../services/users.service';

import { ILoginResponse } from '@/types/authentication';
import { IUserDetailResponse } from '@/types/user';

interface IUserPayload {
  userId?: string;
  email?: string;
  isAdmin?: boolean;
  name?: string;
}

interface IAuthenticationState {
  payload: IUserPayload;
  isLogin: boolean;
  login: (dto: ILoginResponse) => Promise<void>;
  setToken: (dto: {userDetail: IUserDetailResponse, token: string}) => void;
  logout: () => void;
  initializeAuth: () => void;
}
export const useAuthenticationStore = create<IAuthenticationState>((set) => ({
  payload: {},
  isLogin: false,
  login: async (dto) => {
    Cookies.set('token', dto.token!, {
      expires: 1 / 3, // 8 hours
      secure: true,
      sameSite: 'Strict',
    });
    const userDetail = await getUserDetail();

    Cookies.set(
      'user',
      JSON.stringify({
        userId: userDetail._id,
        email: userDetail.email,
        isAdmin: userDetail.isAdmin,
        name: userDetail.name,
      }),
      {
        expires: 1 / 3, // 8 hours
        secure: true,
        sameSite: 'Strict',
      },
    );

    set(() => ({
      payload: {
        userId: userDetail._id,
        email: userDetail.email,
        isAdmin: userDetail.isAdmin,
        name: userDetail.name,
      },
      isLogin: true,
    }));
  },
  setToken: async (dto) => {
    Cookies.set('token', dto.token!, {
      expires: 1 / 3, // 8 hours
      secure: true,
      sameSite: 'Strict',
    });

    Cookies.set(
      'user',
      JSON.stringify({
        userId: dto.userDetail._id,
        email: dto.userDetail.email,
        isAdmin: dto.userDetail.isAdmin,
        name: dto.userDetail.name,
      }),
      {
        expires: 1 / 3, // 8 hours
        secure: true,
        sameSite: 'Strict',
      },
    );

    set(() => ({
      payload: {
        userId: dto.userDetail._id,
        email: dto.userDetail.email,
        isAdmin: dto.userDetail.isAdmin,
        name: dto.userDetail.name,
      },
      isLogin: true,
    }));
  },
  logout: () =>
    set(() => {
      Cookies.remove('token');
      Cookies.remove('user');

      return {
        payload: {},
        isLogin: false,
      };
    }),
  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('token');
      const userData = Cookies.get('user');
      const initialPayload: IUserPayload = JSON.parse(userData ?? '{}');

      set({
        isLogin: !!token,
        payload: initialPayload,
      });
    }
  },
}));

// Hook to call `initializeAuth` on mount
export const useInitializeAuth = () => {
  const initializeAuth = useAuthenticationStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
};
