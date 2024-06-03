import {useMutation} from '@tanstack/react-query';
import axiosInstance from '@utils/axiosInterceptor';
import {UserTypes} from 'types/auth';

export const authApi = {
  joinFn: async (data: UserTypes): Promise<boolean> => {
    const res = await axiosInstance.post('/user/app/sns-login', data);
    return res.data;
  },
  PostJoin: function () {
    return useMutation({mutationFn: this.joinFn});
  },
};
