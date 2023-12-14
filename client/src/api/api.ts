import axios, { Cancel } from 'axios';

import {
  UserType,
  UserTypeWithMiddleware,
  ListingData,
  ListingDataWithMiddleware,
} from '../redux/user/types';

const instance = axios.create({
  withCredentials: true,
  baseURL: '/api',
  headers: {
    // 'API-KEY': process.env.REACT_APP_API_KEY || '',
    'Content-type': 'application/json',
    Accept: 'application/json',
  },
});

export const authAPI = {
  async signIn(formData: Record<string, string>): Promise<UserTypeWithMiddleware> {
    try {
      const response = await instance.post('/auth/sign-in', formData);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) return Promise.reject(error as Cancel);
      throw error;
    }
  },
  async signUp(formData: Record<string, string>): Promise<UserTypeWithMiddleware> {
    try {
      const response = await instance.post('/auth/sign-up', formData);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) return Promise.reject(error as Cancel);
      throw error;
    }
  },
  async signOut(): Promise<UserTypeWithMiddleware> {
    try {
      const response = await instance.get('/auth/sign-out');
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) return Promise.reject(error as Cancel);
      throw error;
    }
  },
  async googleAuth(idToken: string): Promise<UserType> {
    try {
      const response = await instance.post(
        '/auth/google',
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) return Promise.reject(error as Cancel);
      throw error;
    }
  },
};

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
      console.log(response)
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
  async deleteUser(id?: string): Promise<UserTypeWithMiddleware> {
    try {
      const response = await instance.delete(`/user/delete/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) return Promise.reject(error as Cancel);
      throw error;
    }
  },
};

export const listingAPI = {
  async deleteListing(id?: string): Promise<ListingDataWithMiddleware> {
    try {
      const response = await instance.delete(`/listing/delete/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) return Promise.reject(error as Cancel);
      throw error;
    }
  },
  async createListing(formData: ListingData): Promise<ListingDataWithMiddleware> {
    try {
      const response = await instance.post('/listing/create', formData);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) return Promise.reject(error as Cancel);
      throw error;
    }
  },
  async updateListing(formData: ListingData, id?: string): Promise<ListingDataWithMiddleware> {
    try {
      const response = await instance.put(`/listing/update/${id}`, formData);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) return Promise.reject(error as Cancel);
      throw error;
    }
  },
  async getListing(id?: string): Promise<ListingDataWithMiddleware> {
    try {
      const response = await instance.get(`/listing/get/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) return Promise.reject(error as Cancel);
      throw error;
    }
  },
  async search(searchQuery: string): Promise<ListingDataWithMiddleware[]> {
    try {
      const response = await instance.get(`/listing/get?${searchQuery}`);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) return Promise.reject(error as Cancel);
      throw error;
    }
  },
};
