import axios, { AxiosInstance } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({ baseURL: '/api', timeout: 10000 });
    this.client.interceptors.response.use(
      (r) => r,
      (e) => {
        const msg = e?.response?.data?.message || e.message || 'Request failed';
        return Promise.reject(new Error(msg));
      }
    );
  }

  setToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async get(path: string, params?: any) { const { data } = await this.client.get(path, { params }); return data; }
  async post(path: string, body?: any) { const { data } = await this.client.post(path, body); return data; }
  async put(path: string, body?: any) { const { data } = await this.client.put(path, body); return data; }
  async delete(path: string) { const { data } = await this.client.delete(path); return data; }
}

export const api = new ApiClient();
