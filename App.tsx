import React, {useEffect, useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainScreens from '@screens/MainScreens';
import WelcomeScreens from '@screens/WelcomeScreens';
import SearchInfoScreens from '@screens/SearchInfoScreens';
import SearchScreens from '@screens/SearchScreens';
import MyTabs from '@navigation/MyTabs';
import CodePush from 'react-native-code-push';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  API_URL,
} from './src/config/constants';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';

// 타입 정의
export type RootStackParamList = {
  Main: undefined;
  Welcome: undefined;
  Home: undefined;
  Search: {
    searchQuery: string;
    searchData: [{lawIdx: number; lawDocId: string; title: string}];
    category: number;
  };
  SearchInfo: {lawIdx: number}; // lawIdx가 필요하다면
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
}

const RootNavigator = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccessToken = async () => {
      const accessToken = await AsyncStorage.getItem(COOKIE_ACCESS_TOKEN);
      if (accessToken) {
        setAuth(true);
        navigation.navigate('Home');
      } else {
        setAuth(false);
      }
      BootSplash.hide(); // 스플래시 화면 숨기기
    };

    checkAccessToken();
  }, [navigation]);

  if (auth === null) {
    // auth가 아직 설정되지 않았다면 스플래시 화면을 표시
    return null;
  }

  return (
    <Stack.Navigator initialRouteName={auth ? 'Home' : 'Main'}>
      <Stack.Screen
        name="Main"
        component={MainScreens}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreens}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Home"
        component={MyTabs}
        options={{headerShown: false, gestureEnabled: false, title: ''}}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreens}
        options={{headerShown: false, title: ''}}
      />
      <Stack.Screen
        name="SearchInfo"
        component={SearchInfoScreens}
        options={{
          headerShown: false,
          headerTitle: '',
        }}
      />
    </Stack.Navigator>
  );
};

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  // updateDialog: {
  //   title: '...',
  //   optionalUpdateMessage: '...',
  //   optionalInstallButtonLabel: '업데이트',
  //   optionalIgnoreButtonLabel: '아니요.',
  // },
  installMode: CodePush.InstallMode.IMMEDIATE,
};

export default CodePush(codePushOptions)(App);
