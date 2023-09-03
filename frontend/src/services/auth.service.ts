import api from '../utils/api';

export const authService = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (data: { email: string; password: string; username: string }) =>
    api.post('/auth/register', data),
};
