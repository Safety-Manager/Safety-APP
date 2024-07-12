export interface BoardType {
  boardIdx: number;
  title: string;
  content: string;
  heartCount: number;
  commentCount: number;
  selfHeartValid: false;
  createDt: string;
  updateDt: string;
  createUser: string;
  createUserName: string;
  createUserProfileUrl: string;
}

export interface BoardReplyType {
  commentIdx: number;
  parentIdx: number;
  content: string;
  createDt: string;
  updateDt: string;
  createUser: string;
  createUserName: string;
  createUserProfileUrl: string;
}

export interface BoardWriteType {
  parentIdx?: number | null;
  boardIdx: number;
  content: string;
}
