import axiosInstance from '@utils/axiosInterceptor';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';

export const lawApi = {
  lawFn: async (pageParam: number, keyWord: string, category: number) => {
    const res = await axiosInstance.get('/law/search', {
      params: {
        pageNum: pageParam,
        keyWord: keyWord,
        row: 10,
        category: category,
      },
    });
    console.log('이게 몇번>>>', res);
    return res.data.searchDataList;
  },
  GetLawList: function (keyWord: string, category: number) {
    return useInfiniteQuery({
      queryKey: ['law', 'list', keyWord, category],
      queryFn: ({pageParam = 1}) => this.lawFn(pageParam, keyWord, category),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        // lastPage가 유효하고, lastPage의 길이가 10이면 다음 페이지를 요청
        if (lastPage && lastPage.length === 10) {
          return allPages.length + 1; // 다음 페이지 번호를 반환
        } else {
          return undefined; // 더 이상 페이지가 없음을 의미
        }
      },
    });
  },
  lawCategoryFn: async () => {
    const res = await axiosInstance.get('/law/category');
    return res.data.categories;
  },
  GetLawCategory: function () {
    return useQuery({
      queryKey: ['law', 'category'],
      queryFn: () => this.lawCategoryFn(),
    });
  },
  GetLawInfo: function (lawIdx: number) {
    return useQuery({
      queryKey: ['law', 'info', lawIdx],
      queryFn: async () => {
        const res = await axiosInstance.get(`/law/detail/${lawIdx}`);
        console.log('>>resres', res);
        return res.data;
      },
    });
  },
};
