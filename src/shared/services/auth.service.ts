import axios, { AxiosError, AxiosResponse } from 'axios';

import {
  IForgotRequest,
  IForgotResponse,
  ILoginRequest,
  ILoginResponse,
  ISignUpRequest,
  ISignUpResponse,
} from '@/types/authentication';
import { IUserDetailResponse } from '@/types/user';

// const BASE_URL = 'https://bash-phi.vercel.app/api';
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api'

export const authLogin = async (dto: ILoginRequest): Promise<ILoginResponse> => {
  try {
    const response: AxiosResponse<ILoginResponse> = await axios.post(BASE_URL + '/users/login', {
      email: dto.email,
      password: dto.password,
    });

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    } else {
      throw new Error(error);
    }
  }
};

export const authForgot = async (dto: IForgotRequest): Promise<IForgotResponse> => {
  try {
    const response: AxiosResponse<ILoginResponse> = await axios.get(BASE_URL + '/users/login', {
      params: {
        email: dto.email,
      },
    });

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    } else {
      throw new Error(error);
    }
  }
};

export const authSignUp = async (dto: ISignUpRequest): Promise<ISignUpResponse> => {
  try {
    const response: AxiosResponse<ILoginResponse> = await axios.post(BASE_URL + '/users/login', {
      email: dto.email,
      username: dto.username,
      password: dto.password,
    });

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    } else {
      throw new Error(error);
    }
  }
};

export const getAuthDetail = async (token: string): Promise<{data: IUserDetailResponse, token: string}> => {
  try {
    const response: AxiosResponse<{ data: IUserDetailResponse }> = await axios.get(BASE_URL + '/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      data: response.data?.data,
      token: token,
    }
  } catch (error: any) {
    throw new Error(error);
  }};
