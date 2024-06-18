import axios from 'axios';
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  API_URL,
} from '../config/constants';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useQuery} from '@tanstack/react-query';

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
      const accessToken = await AsyncStorage.getItem(COOKIE_ACCESS_TOKEN);

      console.log('accessToken>>', accessToken);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
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
  async error => {
    // 응답 오류 처리
    if (error.response?.status === 401) {
      // refresh token react query
      try {
        const newToken = await AsyncStorage.getItem(COOKIE_REFRESH_TOKEN);

        const response = await axiosInstance.post('/user/refresh-token', {
          refreshToken: newToken,
        });
        await AsyncStorage.setItem(
          COOKIE_ACCESS_TOKEN,
          response.data.accessToken,
        );
        await AsyncStorage.setItem(
          COOKIE_REFRESH_TOKEN,
          response.data.refreshToken,
        );
        return response.data;
      } catch (tokenRefreshError) {
        return Promise.reject(tokenRefreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
