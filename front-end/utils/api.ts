import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function apiGet<T = any>(path: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
  return apiClient.get<T>(path, config);
}

export function apiPost<T = any>(path: string, data: any, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
  return apiClient.post<T>(path, data, config);
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${path}`;
  return fetch(url, options);
}
