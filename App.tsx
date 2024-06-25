import React, {useEffect} from 'react';
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

  useEffect(() => {
    const checkAccessToken = async () => {
      const accessToken = await AsyncStorage.getItem(COOKIE_ACCESS_TOKEN);

      if (accessToken) {
        navigation.navigate('Home');
      }
    };

    checkAccessToken();
  }, [navigation]);

  return (
    <Stack.Navigator initialRouteName="Main">
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
        options={{headerShown: false, gestureEnabled: false, title: ''}}
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
