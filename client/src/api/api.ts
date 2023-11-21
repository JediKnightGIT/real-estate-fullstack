import axios, { AxiosRequestConfig, AxiosResponse, Cancel } from 'axios';

import {
  UserTypeWithMiddleware,
  ListingData,
  ListingDataWithMiddleware,
} from '../redux/user/types';

export type apiAuthData = {
  id: number;
  email: string;
  login: string;
};

export type apiPhoto = {
  small: string;
  large: string;
};

export type apiCaptcha = {
  url: string;
};

export type apiLoginData = {
  userId: number;
};

export type apiAuth<T = any> = {
  resultCode: number;
  messages: string[];
  data: T;
};

export type apiLogin = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha: string;
};

export type userProfile = {
  id: number;
  name: string;
  status?: string;
  photos: apiPhoto;
  followed: boolean;
};

export type userProfileWithExtra = userProfile & {
  username: string;
  onlineStatus: string;
};

export type getUsersResponse = {
  items: userProfileWithExtra[];
  totalCount: number;
  error: string;
};

export type apiProfile = {
  aboutMe: string;
  userId?: number;
  lookingForAJob: boolean;
  lookingForAJobDescription: string;
  fullName: string;
  contacts?: {
    github: string;
    vk: string;
    facebook: string;
    instagram: string;
    twitter: string;
    website: string;
    youtube: string;
    mainLink: string;
  };
};

export type apiProfileWithPhotos = apiProfile & {
  photos: apiPhoto;
};

const instance = axios.create({
  withCredentials: true,
  baseURL: '/api',
  headers: {
    // 'API-KEY': process.env.REACT_APP_API_KEY || '',
    'Content-type': 'application/json',
    Accept: 'application/json',
  },
});

export const userAPI = {
  async getLandlord(userRef: string): Promise<UserTypeWithMiddleware> {
    try {
      const response = await instance.get(`/user/${userRef}`);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) return Promise.reject(error as Cancel);
      throw error;
    }
  },
  async getUserListings(id: string): Promise<ListingData[]> {
    try {
      const response = await instance.get(`/user/listings/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) return Promise.reject(error as Cancel);
      throw error;
    }
  },
  async updateUser(id: string, body: Record<string, string>): Promise<UserTypeWithMiddleware> {
    try {
      const response = await instance.put(`/user/update/${id}`, body);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) return Promise.reject(error as Cancel);
      throw error;
    }
  },
  async deleteUser(id: string): Promise<UserTypeWithMiddleware> {
    try {
      const response = await instance.delete(`/user/delete/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) return Promise.reject(error as Cancel);
      throw error;
    }
  },
};

export const usersAPI = {
  async getUsers(currentPage: number = 1, pageSize: number = 100): Promise<getUsersResponse> {
    try {
      const response = await instance.get(`users?page=${currentPage}&count=${pageSize}`);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) return Promise.reject(error as Cancel);
      throw error;
    }
  },
};

export const settingsAPI = {
  getUserInfo(userId: number = 2): Promise<AxiosResponse<apiProfileWithPhotos>> {
    return instance.get(`profile/${userId}`);
  },
  getUserStatus(userId: number = 2): Promise<AxiosResponse<string>> {
    return instance.get(`profile/status/${userId}`);
  },
  updateUserStatus(status: string): Promise<AxiosResponse<apiAuth<string>>> {
    console.log('put', status);
    return instance.put(`profile/status`, { status });
  },
  savePhoto(file: File): Promise<AxiosResponse<apiAuth<{ photos: apiPhoto }>>> {
    console.log('put', file);
    const formData = new FormData();
    formData.append('image', file);
    const config: AxiosRequestConfig<FormData> = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return instance.put(`profile/photo`, formData, config);
  },
  saveProfile(profile: apiProfile): Promise<AxiosResponse<apiAuth>> {
    console.log('put', profile);
    return instance.put(`profile`, profile);
  },
};

export const authAPI = {
  me(): Promise<AxiosResponse<apiAuth<apiAuthData>>> {
    return instance.get('auth/me');
  },
  login(
    email: string,
    password: string,
    rememberMe: boolean,
    captcha: string = '',
  ): Promise<AxiosResponse<apiLogin>> {
    return instance.post('auth/login', {
      email,
      password,
      rememberMe,
      captcha,
    });
  },
  logout(): Promise<AxiosResponse<apiAuth<apiAuthData>>> {
    return instance.delete('auth/login');
  },
};

export const securityAPI = {
  getCaptcha(): Promise<AxiosResponse<apiCaptcha>> {
    return instance.get('security/get-captcha-url');
  },
};
