import React, {useEffect, useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainScreens from '@screens/MainScreens';
import WelcomeScreens from '@screens/WelcomeScreens';
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
import {NativeModules, PermissionsAndroid, Platform} from 'react-native';

Sentry.init({
  dsn: 'https://5fdbd09b48895376131cc91f9a7b4726@o4507525130616832.ingest.us.sentry.io/4507525134352384',
  tracesSampleRate: 1.0,
  _experiments: {
    profilesSampleRate: 1.0,
  },
});

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const queryClient = new QueryClient();

  const [isReady, setIsReady] = useState(false);
  const [auth, setAuth] = useState<boolean | null>(null);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('koten>', token);
  };

  useEffect(() => {
    requestUserPermission();
    getToken();
  }, []);

  // useEffect(() => {
  //   Platform.OS === 'android'
  //     ? androidRequestPermission()
  //     : iosRequestPermission();
  // }, []);

  // const iosRequestPermission = async () => {
  //   try {
  //     const authorizationStatus = await messaging().requestPermission();
  //     console.log('iOS authorizationStatus:', authorizationStatus); // 로그 추가

  //     if (authorizationStatus === 1) {
  //       const apnsToken = await firebaseMessaging.getAPNSToken();
  //       console.log('iOS APNs Token:', apnsToken); // 로그 추가

  //       if (apnsToken) {
  //         const fcmToken = await firebaseMessaging.getToken();
  //         console.log('iOS FCM Token:', fcmToken); // 로그 추가
  //         NativeModules.DotReactBridge.setPushToken(fcmToken);
  //       }
  //     } else {
  //       console.log('알림권한 비 활성화:');
  //     }
  //   } catch (error) {
  //     console.log('ios error::', error);
  //   }
  // };

  // const androidRequestPermission = async () => {
  //   try {
  //     const authorizationStatus = await messaging().requestPermission();
  //     console.log('Android authorizationStatus:', authorizationStatus); // 로그 추가

  //     const fcmToken = await firebaseMessaging.getToken();
  //     console.log('Android FCM Token:', fcmToken); // 로그 추가

  //     if (Platform.OS === 'android') {
  //       if (Platform.Version >= 33) {
  //         const granted = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //         );
  //         console.log('Android POST_NOTIFICATIONS granted:', granted); // 로그 추가

  //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //           if (fcmToken) {
  //             NativeModules.DotReactBridge.setPushToken(fcmToken);
  //           }
  //         }
  //       } else {
  //         if (fcmToken) {
  //           NativeModules.DotReactBridge.setPushToken(fcmToken);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.log('Android error:', error);
  //   }
  // };

  useEffect(() => {
    const checkAccessToken = async () => {
      try {
        const accessToken = await AsyncStorage.getItem(COOKIE_ACCESS_TOKEN);
        setAuth(!!accessToken);
      } catch (error) {
        console.error('Failed to fetch the access token:', error);
        setAuth(false);
      } finally {
        setIsReady(true);
      }
    };

    checkAccessToken();
  }, []);

  useEffect(() => {
    if (isReady) {
      BootSplash.hide();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer ref={navigationRef}>
        <RootNavigator auth={auth} />
      </NavigationContainer>
    </QueryClientProvider>
  );
}

const RootNavigator = ({auth}: {auth: boolean | null}) => {
  return (
    <Stack.Navigator>
      {auth === false ? (
        <Stack.Screen
          name={RouteNames.MAIN}
          component={MainScreens}
          options={{headerShown: false}}
        />
      ) : (
        <Stack.Screen
          name={RouteNames.HOMETABS}
          component={MyTabs}
          options={{headerShown: false, gestureEnabled: false, title: ''}}
        />
      )}
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
    </Stack.Navigator>
  );
};

export default Sentry.wrap(App);
