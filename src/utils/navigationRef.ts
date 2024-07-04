import {RouteNames} from '@components/Route';
import {
  createNavigationContainerRef,
  NavigationContainerRef,
} from '@react-navigation/native';
import {StackActions} from '@react-navigation/native';

// 네비게이션 레퍼런스 타입 선언
export const navigationRef: React.RefObject<NavigationContainerRef<any>> =
  createNavigationContainerRef<NavigationContainerRef<any>>();

// 네비게이션 함수 타입 선언
export function navigate(name: string, params?: object) {
  if (navigationRef.current && navigationRef.current.isReady()) {
    navigationRef.current.navigate(name, params);
  }
}

// 로그인 페이지로 이동하는 함수
export function navigateToLogin() {
  navigate(RouteNames.MAIN); // 'Login' 화면으로 네비게이션 이동
}
