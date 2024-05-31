import {useMutation} from '@tanstack/react-query';
import axiosInstance from '@utils/axiosInterceptor';
import axios from 'axios';
import {UserTypes} from 'types/user';

export const authApi = {
  joinFn: async (data: UserTypes): Promise<boolean> => {
    const res = await axiosInstance.post('/api/v1/user/app/sns-login', data);
    console.log('>>>', res);
    return res.data;
  },
  PostJoin: function () {
    return useMutation({mutationFn: this.joinFn});
  },
};
