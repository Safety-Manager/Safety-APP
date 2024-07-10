import axiosInstance from '@utils/axiosInterceptor';
import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';

export const boardApi = {
  // 게시글 조회 함수
  boardFn: async (pageParam: number, keyWord?: string) => {
    const res = await axiosInstance.get(
      `/board/list?pageNum=${pageParam}&keyWord=${keyWord}&row=10`,
    );
    return res.data.boardList;
  },
  // 게시글 조회
  GetBoardList: function (keyWord?: string) {
    return useInfiniteQuery({
      queryKey: ['board', 'list', keyWord],
      queryFn: ({pageParam = 1}) => this.boardFn(pageParam, keyWord),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage && lastPage.length === 10) {
          return allPages.length + 1; // 다음 페이지 번호를 반환
        } else {
          return undefined; // 더 이상 페이지가 없음을 의미
        }
      },
      refetchOnWindowFocus: true, // 페이지가 다시 포커스될 때 재호출
      staleTime: 0, // 데이터가 stale 상태가 되기까지의 시간 (0초)
      gcTime: 0, // 데이터가 캐시될 시간 (0초, 데이터가 캐시되지 않도록 설정)
    });
  },
  // 게시글 생성
  PostBoard: function () {
    return useMutation({
      mutationFn: async (data: {
        title: string;
        content: string;
      }): Promise<boolean> => {
        const res = await axiosInstance.post('/board/create', data);
        return res.data;
      },
    });
  },
};
