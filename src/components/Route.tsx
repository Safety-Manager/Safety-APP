export const RouteNames = {
  MAIN: 'Main' as const,
  SEARCH: 'Search' as const,
  SEARCHINFO: 'SearchInfo' as const,
  WELCOME: 'Welcome' as const,
  HOMETABS: 'HomeTabs' as const,
  HOME: 'Home' as const,
  SAFETYCOMPANY: 'SafetyCompany' as const,
  BOARD: 'Board' as const,
  BOARDDETAIL: 'BoardDetail' as const,
  BOARDWRITE: 'BoardWrite' as const,
  MYPAGE: 'MyPage' as const,
  PROFILE: 'Profile' as const,
};

export type RootStackParamList = {
  [RouteNames.MAIN]: undefined;
  [RouteNames.WELCOME]: undefined;
  [RouteNames.HOMETABS]: undefined;
  [RouteNames.SEARCH]: {
    searchQuery: string;
    searchData: [{lawIdx: number; lawDocId: string; title: string}];
    category: number;
  };
  [RouteNames.SEARCHINFO]: {searchQuery: string; lawIdx: number};
  [RouteNames.HOME]: undefined;
  [RouteNames.SAFETYCOMPANY]: undefined;
  [RouteNames.BOARD]: undefined;
  [RouteNames.BOARDDETAIL]: {Idx: number};
  [RouteNames.BOARDWRITE]: undefined;
  [RouteNames.MYPAGE]: undefined;
  [RouteNames.PROFILE]: undefined;
};
