import React, {useEffect, useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
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

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const queryClient = new QueryClient();

  const [isReady, setIsReady] = useState(false);
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccessToken = async () => {
      const accessToken = await AsyncStorage.getItem(COOKIE_ACCESS_TOKEN);
      if (accessToken) {
        setAuth(true);
      } else {
        setAuth(false);
      }
      setIsReady(true);
    };

    checkAccessToken();
  }, []);

  useEffect(() => {
    if (isReady) {
      BootSplash.hide();
    }
  }, [isReady]);

  if (!isReady) {
    // 스플래시 화면이 표시되므로 아무것도 렌더링하지 않음
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
    <Stack.Navigator
      initialRouteName={auth ? RouteNames.HOMETABS : RouteNames.MAIN}>
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
        options={{
          headerShown: false,
          headerTitle: '',
        }}
      />
    </Stack.Navigator>
  );
};

// const codePushOptions = {
//   checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
//   rollbackRetryOptions: {
//     delayInHours: 1,
//     maxRetryAttempts: 3,
//   },
//   installMode: CodePush.InstallMode.IMMEDIATE,
// };

export default App;

527916;
