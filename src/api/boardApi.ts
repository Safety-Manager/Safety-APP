import axiosInstance from '@utils/axiosInterceptor';
import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import {BoardReplyType, BoardType, BoardWriteType} from 'types/board';

export const boardApi = {
  // 게시글 조회 함수
  boardFn: async (
    pageParam: number,
    keyWord?: string,
  ): Promise<BoardType[]> => {
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
  // 게시글 상세보기
  GetBoardDetail: function (id: number) {
    return useQuery({
      queryKey: ['board', 'detail', id],
      queryFn: async (): Promise<BoardType> => {
        const res = await axiosInstance.get(`/board/${id}`);

        return res.data;
      },
      refetchOnWindowFocus: true,
      staleTime: 0,
      enabled: !!id,
    });
  },
  // 게시글 삭제
  DeleteBoard: function () {
    return useMutation({
      mutationFn: async (boardIdx: number): Promise<boolean> => {
        const res = await axiosInstance.delete(`/board/delete/${boardIdx}`);
        return res.data;
      },
    });
  },
  // 댓글 조회
  GetCommentList: function (id: number) {
    return useQuery({
      queryKey: ['board', 'comment', id],
      queryFn: async (): Promise<BoardReplyType[]> => {
        const res = await axiosInstance.get(`/board/comment/${id}`);

        return res.data.commentList;
      },
      refetchOnWindowFocus: true,
      staleTime: 0,
      enabled: !!id,
    });
  },
  // 댓글 생성
  PostComment: function () {
    return useMutation({
      mutationFn: async (data: BoardWriteType): Promise<any> => {
        const res = await axiosInstance.post('/board/comment/create', data);
        console.log('>>', res.data);
        return res.data;
      },
    });
  },
  // 댓글 삭제
  DeleteComment: function () {
    return useMutation({
      mutationFn: async (commentIdx: number): Promise<boolean> => {
        const res = await axiosInstance.delete(
          `/board/comment/delete/${commentIdx}`,
        );
        return res.data;
      },
    });
  },
};
