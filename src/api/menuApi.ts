import axiosClient from './axiosClient';

export const getMenu = () => axiosClient.get('/menu');
export const getTopMenu = (limit = 5) => axiosClient.get(`/menu/top?limit=${limit}`);
export const createMenuItem = (data: any, token: string) => axiosClient.post('/menu', data, { headers: { Authorization: `Bearer ${token}` } });
export const updateMenuItem = (id: string, data: any, token: string) => axiosClient.put(`/menu/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteMenuItem = (id: string, token: string) => axiosClient.delete(`/menu/${id}`, { headers: { Authorization: `Bearer ${token}` } });
