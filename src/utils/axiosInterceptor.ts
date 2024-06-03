import axios from 'axios';
import Cookies from 'js-cookie';
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  API_URL,
} from '../config/constants';
import * as Keychain from 'react-native-keychain';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'content-Type': 'application/json',

    // 필요시 추가 기본 헤더 설정
  },
  withCredentials: true,
});

// 인터셉터 예시
axiosInstance.interceptors.request.use(
  async config => {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: 'com.safe.access',
      });
      if (credentials) {
        config.headers.Authorization = `Bearer ${credentials.password}`;
      }
    } catch (error) {
      console.error('토큰 가져오기 실패:', error);
    }
    return config;
  },
  error => {
    // 요청 오류 처리
    return Promise.reject(error);
  },
);
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // 응답 오류 처리
    return Promise.reject(error);
  },
);

export default axiosInstance;
