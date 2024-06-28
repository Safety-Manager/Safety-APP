import axios from 'axios';
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  API_URL,
} from '../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useQuery} from '@tanstack/react-query';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {navigateToLogin} from './navigationRef';
import {RootStackParamList} from '@components/Route';

type ScreenProps = NativeStackNavigationProp<RootStackParamList>;

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
    console.log('>error>>', error);
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
        console.log('error>>>', error.response.data);
        const newToken = await AsyncStorage.getItem(COOKIE_REFRESH_TOKEN);

        const response = await axios.post(`${API_URL}/user/refresh-token`, {
          refreshToken: newToken,
        });
        console.log('response>>>', response.data);

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
        console.log('catch');
        //
        AsyncStorage.removeItem(COOKIE_ACCESS_TOKEN);
        AsyncStorage.removeItem(COOKIE_REFRESH_TOKEN);
        AsyncStorage.removeItem('user');
        navigateToLogin();

        return Promise.reject(tokenRefreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
