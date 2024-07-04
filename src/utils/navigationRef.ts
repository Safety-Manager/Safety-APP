import {RootStackParamList, RouteNames} from '@components/Route';
import {
  createNavigationContainerRef,
  NavigationContainerRef,
  useNavigation,
} from '@react-navigation/native';
import {StackActions} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// 네비게이션 레퍼런스 타입 선언
export const navigationRef: React.RefObject<NavigationContainerRef<any>> =
  createNavigationContainerRef<NavigationContainerRef<any>>();

// 네비게이션 함수 타입 선언
export function navigate(name: string, params?: object) {
  if (navigationRef.current && navigationRef.current.isReady()) {
    navigationRef.current.navigate(name, params);
  }
}
