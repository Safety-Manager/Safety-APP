import axiosInstance from '@utils/axiosInterceptor';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';

export const boardApi = {
  // 게시글 조회 함수
  boardFn: async (pageParam: number, keyWord: string, category: number) => {
    const res = await axiosInstance.get(
      `/board/list?pageNum=${pageParam}&keyWord=${keyWord}&row=10&category=${category}`,
    );
    return res.data.boardList;
  },
  // 게시글 조회
  GetBoardList: function (keyWord: string, category: number) {
    return useInfiniteQuery({
      queryKey: ['board', 'list', keyWord, category],
      queryFn: ({pageParam = 1}) => this.boardFn(pageParam, keyWord, category),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage && lastPage.length === 10) {
          return allPages.length + 1; // 다음 페이지 번호를 반환
        } else {
          return undefined; // 더 이상 페이지가 없음을 의미
        }
      },
    });
  },
};
