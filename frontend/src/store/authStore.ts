// frontend/src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

interface User {
  userId: number;
  username: string;
  roles: string[];
  permissions: string[];
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (loginData: any) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,

      login: async (loginData: any) => {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, loginData);
          const { accessToken } = response.data;

          const base64Url = accessToken.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const payload = JSON.parse(jsonPayload);
          
          const user = {
            userId: payload.sub,
            username: payload.username,
            roles: payload.roles || [],
            permissions: payload.permissions || [],
          };
          
          set({ accessToken, user, isAuthenticated: true });
        } catch (error) {
          // console.error('Login failed:', error); // 콘솔 에러 로깅 제거
          throw new Error('Login Failed'); // 새로운 에러를 던져서 UI에 실패를 알림
        }
      },

      logout: () => {
        set({ accessToken: null, user: null, isAuthenticated: false });
        window.location.href = '/login';
      },

      hasPermission: (permission: string) => {
        const user = get().user;
        if (!user || !user.permissions) {
          return false;
        }
        return user.permissions.includes(permission);
      },

      hasRole: (role: string) => {
        const user = get().user;
        if (!user || !user.roles) {
          return false;
        }
        return user.roles.includes(role);
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
