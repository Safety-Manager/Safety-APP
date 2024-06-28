export const RouteNames = {
  MAIN: 'Main' as const,
  SEARCH: 'Search' as const,
  SEARCHINFO: 'SearchInfo' as const,
  WELCOME: 'Welcome' as const,
  HOMETABS: 'HomeTabs' as const,
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
  [RouteNames.SEARCHINFO]: {lawIdx: number}; // lawIdx가 필요하다면
};
