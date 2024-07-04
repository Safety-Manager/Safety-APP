import axios from 'axios';
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  API_URL,
} from '../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigate} from './navigationRef';
import {Alert, BackHandler} from 'react-native';
import {RouteNames} from '@components/Route';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'content-Type': 'application/json',
  },
  withCredentials: true,
});

// 알림 상태 변수
let alertDisplayed = false;

// 요청 인터셉터
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
    console.log('요청 오류:', error);
    return Promise.reject(error);
  },
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await AsyncStorage.getItem(COOKIE_REFRESH_TOKEN);
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/user/refresh-token`, {
            refreshToken: refreshToken,
          });

          const {accessToken} = response.data;

          if (accessToken) {
            await AsyncStorage.setItem(COOKIE_ACCESS_TOKEN, accessToken);
          } else {
            console.error('Received undefined accessToken');
          }

          // 원래의 요청을 다시 시도
          return axiosInstance(originalRequest);
        } catch (tokenRefreshError) {
          console.log('토큰 갱신 실패:', tokenRefreshError);

          await AsyncStorage.removeItem(COOKIE_ACCESS_TOKEN);
          await AsyncStorage.removeItem(COOKIE_REFRESH_TOKEN);
          await AsyncStorage.removeItem('user');

          // 알림이 표시되지 않은 경우에만 표시
          if (!alertDisplayed) {
            alertDisplayed = true;
            Alert.alert(
              '알림',
              '로그인이 만료되었습니다. 다시 로그인해주세요.',
              [
                {
                  text: '확인',
                  onPress: () => {
                    alertDisplayed = false; // 알림이 닫힐 때 상태를 초기화
                    navigate(RouteNames.MAIN);
                    // 필요 시 앱 종료
                    // BackHandler.exitApp();
                  },
                },
              ],
              {cancelable: false},
            );
          }

          return Promise.reject(tokenRefreshError);
        }
      } else {
        await AsyncStorage.removeItem(COOKIE_ACCESS_TOKEN);
        await AsyncStorage.removeItem(COOKIE_REFRESH_TOKEN);
        await AsyncStorage.removeItem('user');
        if (!alertDisplayed) {
          alertDisplayed = true;
          navigate(RouteNames.MAIN);
          alertDisplayed = false;
        }
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
