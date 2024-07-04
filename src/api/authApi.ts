import {useMutation, useQuery} from '@tanstack/react-query';
import axiosInstance from '@utils/axiosInterceptor';
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  FCM_TOKEN,
} from '../config/constants';
import {UserNotification, UserProfile, UserTypes} from 'types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authApi = {
  PostJoin: function () {
    return useMutation({
      mutationFn: async (data: UserTypes) => {
        const res = await axiosInstance.post('/user/app/sns-login', data);
        return res.data;
      },
    });
  },
  GetProfile: function () {
    return useQuery({
      queryKey: ['user', 'profile'],
      queryFn: async (): Promise<UserProfile> => {
        const res = await axiosInstance.get('/user/profile');
        return res.data;
      },
    });
  },
  DeleteUser: function () {
    return useMutation({
      mutationFn: async () => {
        await AsyncStorage.removeItem(COOKIE_ACCESS_TOKEN);
        await AsyncStorage.removeItem(COOKIE_REFRESH_TOKEN);
        await AsyncStorage.removeItem(FCM_TOKEN);
        const res = await axiosInstance.delete('/user/delete');
        return res.data;
      },
    });
  },
  // 알림 동의 요청
  PutAgreeNotification: function () {
    return useMutation({
      mutationFn: async (data: UserNotification): Promise<boolean> => {
        const res = await axiosInstance.put('/user/notification/agree', data);
        return res.data;
      },
    });
  },
};
