import React, {useEffect, useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {NavigationContainer, InitialState} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainScreens from '@screens/MainScreens';
import SearchInfoScreens from '@screens/SearchInfoScreens';
import SearchScreens from '@screens/SearchScreens';
import MyTabs from '@navigation/MyTabs';
import CodePush from 'react-native-code-push';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COOKIE_ACCESS_TOKEN} from './src/config/constants';
import BootSplash from 'react-native-bootsplash';
import {navigationRef} from '@utils/navigationRef';
import {RootStackParamList, RouteNames} from '@components/Route';
import * as Sentry from '@sentry/react-native';
import WriteScreens from '@screens/WriteScreens';
import BoardDetailScreens from '@screens/BoardDetailScreens';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';
import {AppState} from 'react-native';
import notifee, {AndroidImportance, AndroidColor} from '@notifee/react-native';
import pushNoti from '@utils/pushNoti';
import ProfileScreens from '@screens/ProfileScreens';

// 프로덕션 모드일 때만 Sentry 초기화
if (!__DEV__) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    _experiments: {
      profilesSampleRate: 1.0,
    },
  });
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const queryClient = new QueryClient();

  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState<InitialState | undefined>();

  useEffect(() => {
    const checkAccessToken = async () => {
      try {
        const accessToken = await AsyncStorage.getItem(COOKIE_ACCESS_TOKEN);
        if (accessToken) {
          setInitialState({
            index: 0,
            routes: [{name: RouteNames.HOMETABS}],
          });
        } else {
          setInitialState({
            index: 0,
            routes: [{name: RouteNames.MAIN}],
          });
        }
      } catch (error) {
        console.error('Failed to fetch the access token:', error);
        setInitialState({
          index: 0,
          routes: [{name: RouteNames.MAIN}],
        });
      } finally {
        setIsReady(true);
      }
    };

    checkAccessToken();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      pushNoti.displayNoti(remoteMessage); // 위에서 작성한 함수로 넘겨준다
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isReady) {
      BootSplash.hide();
    }
  }, [isReady]);

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  if (!isReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer initialState={initialState} ref={navigationRef}>
        <RootNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
}

const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={RouteNames.MAIN}
        component={MainScreens}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={RouteNames.HOMETABS}
        component={MyTabs}
        options={{headerShown: false, gestureEnabled: false, title: ''}}
      />
      <Stack.Screen
        name={RouteNames.SEARCH}
        component={SearchScreens}
        options={{headerShown: false, title: ''}}
      />
      <Stack.Screen
        name={RouteNames.SEARCHINFO}
        component={SearchInfoScreens}
        options={{headerShown: false, headerTitle: ''}}
      />
      <Stack.Screen
        name={RouteNames.BOARDWRITE}
        component={WriteScreens}
        options={{headerShown: false, title: '커뮤니티'}}
      />
      <Stack.Screen
        name={RouteNames.BOARDDETAIL}
        component={BoardDetailScreens}
        options={{headerShown: false, title: '커뮤니티'}}
      />
      <Stack.Screen
        name={RouteNames.PROFILE}
        component={ProfileScreens}
        options={{headerShown: false, title: ''}}
      />
    </Stack.Navigator>
  );
};

// 프로덕션 모드일 때만 Sentry.wrap 사용
export default __DEV__ ? App : Sentry.wrap(App);
