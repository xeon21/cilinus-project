// frontend/src/lib/axios.ts
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // 환경 변수에서 API URL 가져오기
});

// 요청 인터셉터: API 요청을 보내기 전에 토큰을 헤더에 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: API 응답을 받은 후 에러 처리 (특히 401 인증 오류)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 401 에러 발생 시, 토큰이 만료되었거나 유효하지 않으므로 로그아웃 처리
      useAuthStore.getState().logout();
      alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;