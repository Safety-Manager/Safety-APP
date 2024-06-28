import axiosInstance from '@utils/axiosInterceptor';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {LawCountTypes, LawLankTypes, LawListTypes} from 'types/law';

export const lawApi = {
  lawFn: async (pageParam: number, keyWord: string, category: number) => {
    const res = await axiosInstance.get(
      `/law/search?pageNum=${pageParam}&keyWord=${keyWord}&row=10&category=${category}`,
    );
    return res.data.searchDataList;
  },
  // 법령 검색
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
  // 법령 상세정보
  GetLawInfo: function (lawIdx: number) {
    return useQuery({
      queryKey: ['law', 'info', lawIdx],
      queryFn: async () => {
        const res = await axiosInstance.get(`/law/detail/${lawIdx}`);
        return res.data;
      },
    });
  },
  // 카테고리별 법령 개수
  GetLawCategoryCount: function (keyword: number) {
    return useQuery({
      queryKey: ['law', 'count', keyword],
      queryFn: async (): Promise<LawCountTypes[]> => {
        const res = await axiosInstance.get(
          `/law/search/count?keyword=${keyword}`,
        );
        return res.data.categoryCounts;
      },
    });
  },
  // 최근 본 법령
  GetLawHistory: function () {
    return useQuery({
      queryKey: ['law', 'history'],
      queryFn: async (): Promise<LawListTypes[]> => {
        const res = await axiosInstance.get('/law/history?pageNum=1&row=5 ');

        return res.data.lawHistory;
      },
      refetchOnWindowFocus: true, // 페이지가 다시 포커스될 때 재호출
      staleTime: 0, // 데이터가 stale 상태가 되기까지의 시간 (0초)
      gcTime: 0, // 데이터가 캐시될 시간 (0초, 데이터가 캐시되지 않도록 설정)
    });
  },
  // 법령 순위
  GetLawLanking: function () {
    return useQuery({
      queryKey: ['law', 'lanking'],
      queryFn: async (): Promise<LawLankTypes[]> => {
        const res = await axiosInstance.get('/law/ranking/keyword');
        return res.data.scoreList;
      },
      refetchOnWindowFocus: true,
      staleTime: 0,
      gcTime: 0,
    });
  },
};
