import api from './api';

class AuthService {
  async register(email: string, password: string, role: string, phone?: string): Promise<any> {
    const payload: any = { email, password, role };
    if (phone) {
      payload.phone = phone;
    }
    const response = await api.post<any>('/auth/register', payload);
    return response.data;
  }

  async sendOtp(email: string, purpose: string): Promise<string> {
    const response = await api.post<any>('/auth/otp/send', { email, purpose });
    return response.data?.code || '';
  }

  async verifyOtp(email: string, code: string, purpose: string): Promise<boolean> {
    const response = await api.post<any>('/auth/otp/verify', { email, code, purpose });
    return response.data?.verified || false;
  }
}

export const authService = new AuthService();
export default authService;
