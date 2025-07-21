import axiosClient from './axiosClient';

export const login = (email: string, password: string) =>
  axiosClient.post('/auth/login', { email, password });

export const register = (data: { email: string; password: string; fullName: string; phone: string; role?: string }) =>
  axiosClient.post('/auth/register', data);

export const refreshToken = (refreshToken: string) =>
  axiosClient.post('/auth/refresh-token', { refreshToken });
